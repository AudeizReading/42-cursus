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
#include <utility>

#include <unistd.h>
#include <stdlib.h>
#include <sstream>

#include "Request.hpp"
#include "Server.hpp"
#include "Location.hpp"

#define REQUEST_METHOD		"REQUEST_METHOD"
#define QUERY_STRING		"QUERY_STRING"
#define CONTENT_LENGTH		"CONTENT_LENGTH"  
#define CONTENT_TYPE		"CONTENT_TYPE"
#define GATEWAY_INTERFACE	"GATEWAY_INTERFACE"
#define SERVER_SOFTWARE		"SERVER_SOFTWARE"
#define SERVER_NAME			"SERVER_NAME"
#define SERVER_PROTOCOL		"SERVER_PROTOCOL"
#define SERVER_PORT			"SERVER_PORT"
#define PATH_INFO			"PATH_INFO"
#define PATH_TRANSLATED		"PATH_TRANSLATED"
#define DOCUMENT_ROOT		"DOCUMENT_ROOT"
#define SCRIPT_NAME			"SCRIPT_NAME"
#define REMOTE_HOST			"REMOTE_HOST"
#define REMOTE_ADDR			"REMOTE_ADDR"
#define REMOTE_USER			"REMOTE_USER"
#define REMOTE_IDENT		"REMOTE_IDENT"
#define AUTH_TYPE			"AUTH_TYPE"
#define CGI_EXEC			"CGI_EXEC" 
#define DIR_UPLOAD			"DIR_UPLOAD" 

#define PRINT(x) std::cerr << std::boolalpha << "\nin " << __FILE__ << ":" << __LINE__ << "\n"<< __func__ << ": " << #x << "\n" << x << std::endl;

template<typename T, int row, int col>
int get_arr_2D_width(T(&)[row][col]) {return row;}

class CGIEnviron {
	public:
		typedef std::map<std::string, std::string>			map_ss;
		typedef std::pair<std::string, std::string>			value_type;

	private:
		const Request&	_request;
		const Server&	_server;
		const Location&	_location;

		Request::map_ss	_header;
		map_ss			_env;
		std::string		_boundary;

		CGIEnviron(void);
		CGIEnviron(const CGIEnviron &src);
		CGIEnviron & operator=(const CGIEnviron &src);

		bool		_putenv(const char *name, const char *value);
		CGIEnviron&	_setGlobalEnv();
		void		_setHeaderEnv();
		void		_setEnv();

	public:
		CGIEnviron(const Request& req, const Server& serv, const Location& location);
		~CGIEnviron(void);

		map_ss		getEnv() const;
		std::string	getBoundary()	const;
};
