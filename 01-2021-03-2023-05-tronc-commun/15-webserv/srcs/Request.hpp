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

#pragma once

#include <iostream>
#include <map>
#include <netinet/in.h>
#include "Queryparser.hpp"

#include "Server.hpp"
#include "Location.hpp"
#include "Response.hpp"
#include "Listener.hpp"

class Server;
class Location;
class Response;
class Listener;

class Request
{
public:
	typedef std::map<std::string, std::string>			map_ss;
	typedef std::pair<std::string, std::string>			pair_ss;

	typedef std::vector<std::string>					vector_str;

	typedef std::vector<Server>							vector_s;

private:
	Listener const&	_listener;

	bool			_complete_header;
	bool			_parsed;
	bool			_binded2server;
	bool			_answered;

	std::string		_plaintext;
	std::string::difference_type	_content_start;

	unsigned long	_char_sent;

	std::string		_method;
	std::string		_location;
	std::string		_query;
	std::string		_content;

	std::string		_addr;
	std::string		_host;

	map_ss			_header;

	const Response	*_response;

	const Server	*_server;
	const Location	*_server_location;

	void			_parse_firstline(const std::string &str, std::string::const_iterator &it);
	
	Queryparser::Firstline _get_first_line() const;

	Server const*	_get_matching_Server() const;
	Location const*	_get_matching_Location(Server const& serv) const;
	void			_bind_server();

	bool			_should_redirect_if_dir_request();
	bool			_asked_for_dir_list();
	void			_check_answer();

public:
	Request(Listener const &listener, struct sockaddr_in address);

	~Request();

	void			parse();

	void			append_plaintext(std::string::const_iterator const &begin,
									std::string::const_iterator const &end);

	unsigned long	get_contentLength() const;

	//void			do_end();

	bool			is_complete_header() const;
	bool			is_parsed() const;
	bool			is_binded2server() const;
	bool			is_answered() const;

	std::string		get_location() const;
	std::string		get_query() const;
	std::string		get_content() const;
	std::string		get_method() const;
	std::string		get_http_version() const;
	std::string		get_buffer() const;

	std::string		get_addr() const;
	std::string		get_host() const;

	unsigned long	get_char_sent() const;
	void			set_char_sent(unsigned long size);

	Response const*	get_response() const;

	Server const*	get_server() const;
	void			set_server(Server const* src);

	Location const*	get_server_location() const;
	void			set_server_location(Location const* src);

	void			bind_response(Response const* resp);

	void			set_s_sloc(Server const* serv, Location const* sloc);

	map_ss &		get_header();
	map_ss const&	get_header() const;

	in_addr			get_client_addr() const;
};

std::ostream& operator<<(std::ostream& os, Request const& request);
