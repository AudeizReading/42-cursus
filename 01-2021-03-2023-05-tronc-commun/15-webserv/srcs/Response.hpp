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

#include "Request.hpp"
#include <http_error_codes.hpp>

class Request;

class Response
{
public:
	typedef std::map<std::string, std::string>			map_ss;
	typedef std::pair<std::string, std::string>			pair_ss;

private:
	std::string			_plaintext;

protected:
	const Request*		_request;
	std::string			_status;
	std::string			_content_path;
	std::string			_content_type;
	std::string			_content;
	map_ss				_header;

	virtual void _init() = 0;

public:
	Response(Request const& request);

	virtual ~Response();

	Response	&operator=(Response const &src);

	operator std::string() const;

	const char*	c_str() const;
	int			length() const;

	std::string	get_status() const;
	std::string	get_ctype() const;

	void		create();
	void		print_debug() const;
};

std::ostream& operator<<(std::ostream& os, const Response& response);
