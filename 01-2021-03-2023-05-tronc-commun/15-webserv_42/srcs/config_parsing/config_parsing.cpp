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
#include <toml_parser.hpp>

void	debug_print_recursive(TOML::Document const& doc, std::string ident = "")
{
	for (TOML::Document::const_iterator it = doc.begin(); it != doc.end(); ++it)
	{
		if (it->isGroup()) {
			std::cout << ident + '\t' << "[" + it->key() + "]" << std::endl;
			debug_print_recursive(TOML::Document(*it), ident + '\t');
		}
		else if (it->isArray() && it->Array().type() == TOML::T_GROUP)
		{
			for (TOML::Document::array_type::const_iterator arr_it = it->Array().begin();
				arr_it != it->Array().end();
				++arr_it)
			{
				std::cout << ident + '\t' << "[[" + it->key() + "]]" << std::endl;
				debug_print_recursive(TOML::Document(*arr_it), ident + '\t');
				std::cout << std::endl;
			}
		}
		else
			std::cout << ident << it->key() << " = " << *it << std::endl;
	}
}

// A bit of a recursive, weird mess. But it looks like it works.
// Does whatever is required with specific keys. Right now, only the "include" directive matters.
static void	_parse_value(TOML::Value& val)
{
	if (val.type() == TOML::T_ARRAY)
	{
		// for (auto &it : val.Array()) => Remember what they took away from you.
		for (TOML::Document::array_type::iterator it = val.Array().begin();
			it != val.Array().end();
			++it)
		{
			_parse_value(*it);
		}
	}
	else if (val.type() == TOML::T_GROUP)
	{
		if (val.has("include"))
			include_directive(val, val["include"]);
		for (TOML::Value::group_iterator it = val.group_begin();
			it != val.group_end();
			++it)
		{
			_parse_value(*it);
		}
	}
}

static TOML::Value::group_type	_get_default_cgi_environ_group()
{
	// static to avoid constructing every time before return. Did that because RVO seems janky in C++98 w/ Apple clang.
	// And because I wanted to.
	static TOML::Value::group_type	cgi_environ = TOML::make_group("cgi_environ");
	static bool is_init = false;

	if (is_init == false)
	{
		cgi_environ.group_addValue( TOML::make_string("DIR_UPLOAD",			"./demo/www/upload")	);
		cgi_environ.group_addValue( TOML::make_string("GATEWAY_INTERFACE",	"CGI/1.1")				);
		cgi_environ.group_addValue( TOML::make_string("CGI_EXEC",			"/usr/bin/perl")		);
		cgi_environ.group_addValue( TOML::make_string("SERVER_SOFTWARE",	"42_AGP_webserv")		);
		is_init = true;
	}
	return cgi_environ;
}

static TOML::Value	_get_default_root_location()
{
	TOML::Value new_group = TOML::make_group("");	// Group has no key because it's in an array
	new_group.group_addValue( TOML::make_string("URI", "/") );
	new_group.group_addValue( TOML::make_string("root", "./demo/www") );
	new_group.group_addValue( _get_default_cgi_environ_group() );

	return new_group;
}

static bool	_is_root_location(TOML::Value const& loc)
{
	return loc.at("URI").Str() == "/";
}

// Goes through each server block in the HTTP group, and adds a default "location"
// to a server when none is defined.
static void	_insert_default_locations(TOML::Value& http)
{
	TOML::Value::array_type&	serv_array = http["server"].Array();
	for (TOML::Document::array_type::iterator it = serv_array.begin();
		it != serv_array.end();
		++it)
	{
		if (!it->has("location"))	// Current server has no "location" array
		{
			it->group_addValue( TOML::make_array("location", TOML::T_GROUP) );
			(*it)["location"].groupArray_addValue( _get_default_root_location() );
		}
		else
		{
			TOML::Value::array_type::iterator root_loc = std::find_if(it->at("location").Array().begin(),
				it->at("location").Array().end(),
				_is_root_location);
			bool	has_root_location = (root_loc != it->at("location").Array().end());
			if (!has_root_location)
			{
				std::cout << "Does not have root loc" << std::endl;
				(*it)["location"].groupArray_addValue( _get_default_root_location() );
			}
		}
	}
}

// Checks for some environment variables in cgi_environ group. If they're not present,
// inserts them with a default value.
static void	_insert_default_cgi_environ_vars(TOML::Value& cgi_environ)
{
	if (!cgi_environ.has("DIR_UPLOAD")) // A bit useless for locations that will deny dir upload, but is easier to do here
		cgi_environ.group_addValue( TOML::make_string("DIR_UPLOAD",			"./demo/www/upload")	);
	if (!cgi_environ.has("GATEWAY_INTERFACE"))
		cgi_environ.group_addValue( TOML::make_string("GATEWAY_INTERFACE",	"CGI/1.1")				);
	if (!cgi_environ.has("CGI_EXEC"))
		cgi_environ.group_addValue( TOML::make_string("CGI_EXEC",			"/usr/bin/perl")		);
	if (!cgi_environ.has("SERVER_SOFTWARE"))
		cgi_environ.group_addValue( TOML::make_string("SERVER_SOFTWARE",	"42_AGP_webserv")		);
}

static void	_location_fields_autoformat(TOML::Value::array_type& servers)
{
	for (TOML::Value::array_type::iterator i = servers.begin(); i != servers.end(); ++i)
	{
		for (TOML::Value::array_type::iterator j = (*i)["location"].Array().begin();
			j != (*i)["location"].Array().end();
			++j)
		{
			(*j)["URI"].Str() = strtrim_right((*j)["URI"].Str(), "/");
			if ((*j)["URI"].Str().empty())
				(*j)["URI"].Str() = "/";
			
			if (!j->has("redirect"))
			{
				(*j)["root"].Str() = strtrim_right((*j)["root"].Str(), "/");
				if ((*j)["root"].Str().empty())
					(*j)["root"].Str() = "/";
			}
			if (!j->has("cgi_environ"))
				j->group_addValue( _get_default_cgi_environ_group() );
			else
				_insert_default_cgi_environ_vars(*j);
			
			// std::cerr << YELB << "URI: \"" << (*j)["URI"].Str() << '\"' << RESET << std::endl;
			// std::cerr << YELB << "root: \"" << (*j)["root"].Str() << '\"' << RESET << std::endl << std::endl;
		}
	}
}

// Opens, parses, and does some basic error checking on the configuration file.
// Checks if mandatory directives are present. Checks if each supported directive has
// got the right type. Does NOT check for directives with the right type but bad values.
// Throws a descriptive std::runtime_error if something went wrong.
TOML::Document	parse_config_file(const char *path)
{
	TOML::Document	config(path);
	try
	{
		config.parse();
		for (TOML::Document::iterator it = config.begin(); it != config.end(); ++it)
			_parse_value(*it);
		check_mandatory_directives(config);
		check_optional_directives(config);
		_insert_default_locations(config["http"]);
		_location_fields_autoformat(config["http"]["server"].Array());
	}
	catch(const std::exception& e)
	{
		throw std::runtime_error(std::string("Failed to parse configuration file: ") + e.what());
	}

	// debug_print_recursive(config);
	// std::cout << config["http"].at("mime_types") << std::endl;
	return config;
}
