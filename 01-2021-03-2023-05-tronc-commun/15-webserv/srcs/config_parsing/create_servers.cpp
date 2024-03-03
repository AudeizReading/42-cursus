/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */

#include "webserv.hpp"
#include "../Listener.hpp"
#include "../Server.hpp"
#include <toml_parser.hpp>
#include <http_error_codes.hpp>

#include <vector>
#include <string>
#include <algorithm>

static bool	_location_URI_comp(Location const& a, Location const& b)
{
	return (std::count(a.get_URI().begin(), a.get_URI().end(), '/')
		< std::count(b.get_URI().begin(), b.get_URI().end(), '/')
		|| a.get_URI() == "/");
}

static
std::map<std::string, std::string>
	_get_cgi_environ(TOML::Value::group_type const& toml_cgi_environ)
{
	std::map<std::string, std::string>	cgi_environ;

	for (TOML::Value::const_group_iterator it = toml_cgi_environ.group_begin();
		it != toml_cgi_environ.group_end();
		++it)
	{
		cgi_environ.insert( std::make_pair(it->key(), it->Str()) );
	}

	return cgi_environ;
}

// Why can't this take advantage of RVO/copy elision ? I might need to read more docs.
// Maybe Apple clang or C++98 just sucks at that ?
static
std::vector<Location>	_get_locations_from_server(TOML::Value::array_type const& toml_locations)
{
	std::vector<Location>	locations;
	locations.reserve(toml_locations.size());

	for (TOML::Value::array_type::const_iterator it = toml_locations.begin();
		it != toml_locations.end();
		++it)
	{
		locations.push_back(
			Location(
				(*it)["URI"].Str(),
				it->at_or("root",			TOML::make_string(""))			.Str(),
				it->at_or("index",			TOML::make_string("index.html")).Str(),
				it->at_or("redirect",		TOML::make_string(""))			.Str(),
				it->at_or("cgi_file_ext",	TOML::make_string("pl"))		.Str(),
				it->at_or("dir_listing",	TOML::make_bool(false))			.Bool(),
				_get_cgi_environ(it->at("cgi_environ"))
			) );
		if (it->has("allowed_methods"))
		{
			uint8_t		allowed = 0; // Screw it, bitwise time.
			const TOML::Value::array_type	array = (*it)["allowed_methods"].Array();

			for (TOML::Value::array_type::const_iterator j = array.begin(); j != array.end(); ++j)
			{
				if (j->Str() == "GET")
					allowed |= 0b0001;
				else if (j->Str() == "POST")
					allowed |= 0b0010;
				else if (j->Str() == "DELETE")
					allowed |= 0b0100;
				else if (j->Str() == "HEAD")
					allowed |= 0b1000;
			}
			locations.back().set_allowed_methods(allowed & 0b001, allowed & 0b010, allowed & 0b100,
				allowed & 0b1000);
		}
	}
	// Sort locations from smallest path to biggest, by counting the number of '/'
	std::stable_sort(locations.begin(), locations.end(), _location_URI_comp);
	return locations;
}

static
std::map<int, std::string>	_get_error_pages(TOML::Value const& server)
{
	const std::string	supported_errors[] = SUPPORTED_ERROR_CODES;
	std::map<int, std::string>	error_pages;

	for (unsigned int i = 0; i < sizeof(supported_errors) / sizeof(supported_errors[0]); ++i)
	{
		error_pages.insert(
			std::pair<int, std::string>(
				std::atoi(supported_errors[i].c_str()),
				server.at_or(std::string("error_") + supported_errors[i],
					TOML::make_string("./res/error/" + supported_errors[i] + ".html")).Str()
			)
		);
	}
	return error_pages;
}

// NOTE: I also had a function which returned void and took in a reference to the vector, and edited that.
// I don't know which overload is the best, in term of performance and/or clean code ?
// Apparently this one could take advantage of RVO. But it didn't do that in testing?
static std::vector<Server>	_get_servers_from_config(TOML::Value::array_type const& toml_servers)
{
	std::vector<Server>		servers;
	servers.reserve(toml_servers.size());

	for (TOML::Value::array_type::const_iterator it = toml_servers.begin();
		it != toml_servers.end();
		++it)
	{
		std::vector<std::string>	server_names;
		if (!it->has("server_name"))
			server_names.push_back("");
		else
		{	// Copy everything in there. Assign won't work because TOML::Value isn't 
			// implicitely convertible to string. TODO ?
			// for (auto const &j : (*it)["server_name"].Array()) => I cry every day
			for (TOML::Value::array_type::const_iterator j = (*it)["server_name"].Array().begin();
				j != (*it)["server_name"].Array().end();
				++j)
			{
				server_names.push_back(j->Str());
			}
		}
		servers.push_back(
			Server(
				it->at_or("name",					TOML::make_string("Groenland"))		.Str(),
				it->at_or("listen_addr",			TOML::make_string("0.0.0.0"))		.Str(),
				(*it)["listen_port"].Int(),
				it->at_or("client_max_body_size",	TOML::make_int(CL_MAX_BODYSIZE))	.Int(),
				std::make_pair(server_names.begin(), server_names.end()),
				_get_locations_from_server((*it)["location"].Array()), // "location" is guaranteed to exist at this point
				_get_error_pages(*it)
			) );
	}
	return servers;
}

static bool	_Server_port_compare(Server const& a, Server const& b)
{
	return a.get_port() < b.get_port();
}

static bool	_Server_different_port_and_addr(Server const& a, Server const& b)
{
	return a.get_port() != b.get_port() || a.get_addr() != b.get_addr();
}

#define CEND(__type, x)		(__type::const_iterator(x.end()))
#define VEC_CEND(__T, x)	(std::vector<__T>::const_iterator(x.end()))

// Returns a vector of Listeners, each fully configured AND error checked
// TOML::Document as an input is already parsed and error checked for missing/incorrect directives
std::vector<Listener>	create_Listeners(TOML::Document const& conf)
{
	TOML::Value::array_type const&	toml_servers = conf["http"]["server"].Array();
	std::vector<Server>				servers = _get_servers_from_config(toml_servers);
	std::vector<Listener>			listeners;

	// Sorting servers by port number allows us to give iterator ranges to Listener later on.
	std::stable_sort(servers.begin(), servers.end(), _Server_port_compare);

	// Create a Listener for each different port in servers
	for (std::vector<Server>::const_iterator it = servers.begin(); it != servers.end();)
	{
		std::vector<Server>::const_iterator	different_listen
			= std::find_first_of(it, VEC_CEND(Server, servers), it, it + 1, _Server_different_port_and_addr);
		listeners.push_back(Listener(it->get_addr(), it->get_port(), LISTEN_BACKLOG, it, different_listen));
		it = different_listen;
	}
	return listeners;
}
