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

#include <iostream>
#include <sstream>
#include <algorithm>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <netdb.h>
#include <dirent.h>

#include <toml_parser.hpp>

#include "webserv.hpp"
#include "Request.hpp"

#include "Response/Response_Ok.hpp"
#include "Response/Response_4XX.hpp"
#include "Response/Response_Redirect.hpp"
#include "Response/Response_Dirlist.hpp"

Request::Request(Listener const &listener, struct sockaddr_in address) : _listener(listener), _complete_header(false), _parsed(false),
	_binded2server(false), _answered(false), _plaintext(""), _char_sent(0), _response(NULL)
{
	_server = NULL;
	_server_location = NULL;
	_response = NULL;

	char	addr_str[INET_ADDRSTRLEN] = {0};
	char	host_str[NI_MAXHOST] = {0};
	inet_ntop(AF_INET, static_cast<void*>(&address.sin_addr), addr_str, INET_ADDRSTRLEN);
	getnameinfo(reinterpret_cast<struct sockaddr *>(&address), sizeof(struct sockaddr_in),
		host_str, NI_MAXHOST, NULL, 0, NI_NAMEREQD);
	_addr = addr_str;
	_host = host_str;
}

Request::~Request()
{
	if (_response != NULL)
		delete const_cast<Response *>(_response);
}

void Request::_parse_firstline(const std::string &str, std::string::const_iterator &it)
{
	Queryparser::Firstline firstline = Queryparser::parse_req_firstline(str, it);

	std::string::size_type			pos = firstline.uri.find("?");

	_method = firstline.method;
	if (pos != std::string::npos)
	{
		_location = firstline.uri.substr(0, pos);
		_query = firstline.uri.substr(pos + 1, firstline.uri.length());
	}
	else
		_location = firstline.uri;

	for (std::string::iterator it = _location.begin(); it != _location.end(); ++it)
	{
		if (!(('a' <= *it && *it <= 'z') || ('A' <= *it && *it <= 'Z') || ('0' <= *it && *it <= '9')
			|| *it == '-' || *it == '_' || *it == '/' || *it == '.' || *it == '%'))
		{
			throw std::runtime_error("Bad Request: Forbidden character");
		}
	}

	if (_location.find("/../", 0) != std::string::npos) 
		throw std::runtime_error("Bad Request: Forbidden previous folder");
}

std::ostream& operator<<(std::ostream& os, Request const& request)
{
	os << "\e[30;48;5;245m\n";

	os << "Method: " << request.get_method() << " - ";
	os << "Location: " << request.get_location() << std::endl;
	if (request.get_query().length() > 0)
		os << "Query: " << request.get_query() << std::endl;
	if (request.get_content().length() > 0)
	{
		if (request.get_content().length() < 1400)
			os << "Content: " << request.get_content() << std::endl;
		else
			os << "Content: <_content length: "
				<< request.get_content().length() << ">" << std::endl;
	}

	os << "Headers (" << request.get_header().size() << "):" << std::endl;
	for (Request::map_ss::const_iterator it2 = request.get_header().begin();
			it2 != request.get_header().end(); it2++)
		os << " - " << it2->first << ": " << it2->second << std::endl;

	os << RESET << std::endl;
	return (os);
}

// Returns the server that matches the request, based on the listen_addr and server_name fields.
Server const*	Request::_get_matching_Server() const
{
	const Request::map_ss::const_iterator find_host = get_header().find("Host");
	std::string	host = (find_host == get_header().end() ? "" : find_host->second);
	if (host.find(':') != std::string::npos)
		host.erase(host.find(':'));

	vector_s const& _servers = _listener.get_servers();

	// Go through candidate servers, and find the one with the matching server_name
	Server const	*target = &*_servers.begin(); // If no server_name matches, get the first server
	for (vector_s::const_iterator it = _servers.begin(); it != _servers.end(); ++it)
	{
		if (it->has_server_name(host)) // Should I break here ?
			target = &*it;
	}
	return target;
}

Location const*	Request::_get_matching_Location(Server const& serv) const
{
	std::string req_location_URI = get_location();
	
	std::cerr << BCYN << "Request URI: " << req_location_URI << RESET << ": Looking URI: "; // DEBUG
	req_location_URI += '/'; // Hacky patch for broken upload, upload.html thing with gphilipp

	// Locations are sorted from least to most complete.
	const Location*	target = &serv.get_locations().front();
	for (std::vector<Location>::const_iterator it = serv.get_locations().begin();
		it != serv.get_locations().end();
		++it)
	{
		// char c = req_location_URI[it->get_URI().length()];
		if (req_location_URI.find(it->get_URI() + '/') != std::string::npos/*  && 
			!(('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9')
				|| c == '-' || c == '_' || c == '.') */)
		{
			std::cerr << req_location_URI[it->get_URI().length()] << "   ";
			target = &*(it);
			std::cerr << "[[ " << BCYN << it->get_URI() << RESET << " ]]"; // DEBUG
		}
		else
			std::cerr << _CYN << it->get_URI() << RESET; // DEBUG
		std::cerr << ", "; // DEBUG
	}
	std::cerr << std::endl;
	return target;
}

void	Request::_bind_server()
{
	const Server	*server = _get_matching_Server();
	if (server != NULL)
	{
		std::cerr << "[listener] matched server "
			<< server->get_addr() << ':' << server->get_port() << ' '
			<< "with first server_name: " << server->get_server_names()[0] << std::endl;
		set_server(server);

		const Location	*location = _get_matching_Location(*server);
		std::cerr << "[listener] matched location: " << location->get_URI() << std::endl;
		set_server_location(location);
	}
}

// Only does something when request doesn't end with '/'.
// Checks if requested URL is a directory. If so, redirects the client to the
// directory by appending a '/' at the end of the request's location, with a 301 redirect.
bool	Request::_should_redirect_if_dir_request()
{
	if (this->get_location().back() == '/')
		return false;

	Location const&	loc = *this->get_server_location();
	std::string	URI = this->get_location().substr(loc.get_URI().length());

	// std::cerr << _YEL << "request location: " << this->get_location() << '\n'
	// 	<< "Matched loc URI: " << loc.get_URI() << '\n'
	// 	<< "loc root: " << loc.get_root() << '\n'
	// 	<< "Extracted URI: " << URI << '\n'
	// 	<< "root + URI: " << loc.get_root() << (URI[0] == '/' ? "" : "/") << URI
	// 	<< RESET << std::endl;

	std::string	URI_full_path = loc.get_root() + (URI[0] == '/' ? "" : "/") + URI;
	struct stat	file_stat;
	std::memset(&file_stat, 0, sizeof(file_stat));
	stat(URI_full_path.c_str(), &file_stat);
	if (!S_ISDIR(file_stat.st_mode))
		return false;

	return true;
}

bool	Request::_asked_for_dir_list()
{
	const Location&		serv_loc = *get_server_location();
	const std::string&	index_file_name = serv_loc.get_index();
	const std::string	adjusted_URI = get_location().substr(serv_loc.get_URI().length());
	const std::string	path = serv_loc.get_root()
		+ (adjusted_URI[0] == '/' ? "" : "/") + adjusted_URI;

	// Check if index file exists
	std::FILE	*file_index;
	if (index_file_name.empty())
		file_index = NULL;
	else
		file_index = std::fopen((path + '/' + index_file_name).c_str(), "r");
	DIR			*dir;
	if (file_index != NULL) // If index file exists at requested directory
	{
		fclose(file_index);
		return false;
	}
	// Index doesn't exist but requested directory EXISTS and dir_listing (aka autoindex) is ON
	else if (serv_loc.allows_dir_listing() == true
		&& (dir = opendir(path.c_str())) != NULL )
	{
		closedir(dir);
		bind_response(new Response_Dirlist(*this, get_dir_list_html(path, get_location())));
	}
	// Index doesn't exist, directory doesn't exist, dir_listing is OFF
	else if ( (dir = opendir(path.c_str())) == NULL )
		bind_response(new Response_Not_Found(*this));
	// Index doesn't exist, directory exists, and dir_listing (a.k.a. autoindex) is OFF
	else
		bind_response(new Response_Forbidden(*this));
	return true;
}

void	Request::_check_answer()
{
	if (is_parsed())
	{
		if (!is_complete_header()) {
			bind_response(new Response_Bad_Request(*this));
		}
		else if (!is_binded2server())
		{
			_bind_server();
			_binded2server = true;
			if (get_server() == NULL)
				bind_response(new Response_Internal_Server_Error(*this));
			else if (get_server_location()->has_redirect())
				bind_response(new Response_Redirect(*this));
			else if (!get_server_location()->allows_method(get_method()))
				bind_response(new Response_Method_Not_Allowed(*this));
			else if (_should_redirect_if_dir_request())
				bind_response(new Response_Redirect_Permanent(*this, get_location() + '/'));
			else if (get_location().back() == '/' && _asked_for_dir_list())
				return ;
		}
		if (get_server() != NULL && get_buffer().length() > get_server()->get_max_body_size())
			bind_response(new Response_Payload_Too_Large(*this));
	}
	else if (get_buffer().length() > MAX_REQ_HEADER_SIZE)
		bind_response(new Response_Request_Header_Too_Large(*this));
}

void Request::parse()
{
	_parsed = true;
	try
	{
		std::string::const_iterator		it = _plaintext.begin();

		_parse_firstline(_plaintext, it);
		_content = Queryparser::parse_otherline(_plaintext, it, _header);
		_content_start = it - _plaintext.begin();

		std::cerr << "Request parsed: " << _method << " " << _location << std::endl;
		//std::cerr << *this << std::endl;
		_complete_header = true;
	}
	catch(const std::runtime_error& e)
	{
		std::cerr << e.what() << '\n';
		_complete_header = false;
	}
}

void	Request::append_plaintext(std::string::const_iterator const &begin,
								std::string::const_iterator const &end)
{
	_plaintext.append(begin, end);
	if (!_parsed && _plaintext.find("\r\n\r\n") != std::string::npos)
		parse();
	if (_parsed)
		_content = _plaintext.substr(_content_start);

	_check_answer();
}

static unsigned long ToNum(std::string str)
{
    std::istringstream oStream(str);
    unsigned long tX = 0;
    oStream >> tX;
    return tX;
}

unsigned long		Request::get_contentLength() const
{
	try {
		return ToNum(get_header().at("Content-Length"));
	} catch (const std::out_of_range& oor) {
		return 0;
	}
}

/*void	Request::do_end()
{
	// ACTUELLEMENT NON UTILISE mais peut etre utile pour le CGI et avoir une map
	// de chacun des fichiers envoyées en upload
	// Necessite de comprendre comment convertir de l'octect-stream (string) en
	// binary

	std::string					type = _header["Content-Type"];

	if (type.find("multipart/form-data; ") == std::string::npos
		|| type.find("boundary=") == std::string::npos)
		return ;

	std::cout << "multipart + boundary detected" << std::endl;
	vector_str					files;  // NEXT: finish this?

	std::string					boundary = "--" + type.substr(type.find("boundary=") + 9);
	if (boundary == "--")
		return ;

	std::string					str = _content;
	std::string::size_type		next_boundary = str.find(boundary);

	if (next_boundary == std::string::npos)
		std::cout << "no boundary in content :(" << std::endl;

	while (next_boundary != std::string::npos) {
		std::string::const_iterator
			it = str.begin() + next_boundary + boundary.length() + 2;

		Queryparser::map_ss		header;
		Queryparser::parse_otherline(str, it, header);
		for (Queryparser::map_ss::const_iterator it2 = header.begin();
			it2 != header.end(); it2++)
			std::cerr << " - " << it2->first << ": " << it2->second << std::endl;
		str = str.substr(it - str.begin());

		std::ofstream outfile ("test.txt", std::ofstream::binary); // NEXT: finish this?

		next_boundary = str.find(boundary);
		std::string out = str;
		if (next_boundary != std::string::npos)
			out = out.substr(0, next_boundary);
		// outfile.write(reinterpret_cast<const char*>(out.c_str()), out.length());
		outfile << out << std::endl;

		outfile.close();
	}
}*/

Queryparser::Firstline Request::_get_first_line() const
{
	try
	{
		std::string::const_iterator	it = _plaintext.begin();
		Queryparser::Firstline		firstline = Queryparser::parse_req_firstline(_plaintext, it);

		return firstline;
	}
	catch(const std::runtime_error& e)
	{
		std::cerr << e.what() << '\n';
	}
	return Queryparser::Firstline();
}

bool	Request::is_complete_header() const
{
	return (_complete_header);
}

bool	Request::is_parsed() const
{
	return (_parsed);
}

bool	Request::is_binded2server() const
{
	return (_binded2server);
}

bool	Request::is_answered() const
{
	return (_answered);
}

std::string	Request::get_location() const
{
	return (_location);
}

std::string	Request::get_query() const
{
	return (_query);
}

std::string	Request::get_content() const
{
	return (_content);
}

std::string	Request::get_method() const
{
	return (_method);
}

std::string	Request::get_http_version() const
{
	Queryparser::Firstline	firstline = this->_get_first_line();

	return (firstline.http_version);
}

std::string	Request::get_buffer() const
{
	return (_plaintext);
}

std::string	Request::get_addr() const
{
	return (_addr);
}

std::string	Request::get_host() const
{
	return (_host);
}

unsigned long	Request::get_char_sent() const
{
	return (_char_sent);
}

void	Request::set_char_sent(unsigned long size)
{
	_char_sent = size;
}

Response const*	Request::get_response() const
{
	return _response;
}

Server const*	Request::get_server() const
{
	if (!_server)
		throw std::runtime_error("Server request not binded!");
	return (_server);
}

void	Request::set_server(Server const* src)
{
	_server = src;
}

Location const*	Request::get_server_location() const
{
	if (!_server_location)
		throw std::runtime_error("Server location request not binded!");
	return (_server_location);
}

void	Request::set_server_location(Location const* src)
{
	_server_location = src;
}

void	Request::bind_response(Response const* src)
{
	if (src == NULL)
		return ;
	if (_response != NULL)
		delete const_cast<Response *>(_response);
	_response = src;
	_answered = true;
}

void	Request::set_s_sloc(Server const* serv, Location const* sloc)
{
	set_server(serv);
	set_server_location(sloc);
}

Request::map_ss&	Request::get_header()
{
	return (_header);
}

Request::map_ss const&	Request::get_header() const
{
	return (_header);
}
