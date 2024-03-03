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

#include "Response_Ok.hpp"
#include "Response_4XX.hpp"

Response_Ok::Response_Ok(Request const& request): Response(request)
{
	create();
}

Response_Ok::~Response_Ok()
{
}

void Response_Ok::_init()
{
	const std::string&	req_location = _request->get_location();
	const Location&		serv_loc = *_request->get_server_location();

	if (req_location[0] != '/')
	{
		std::cout << _MAG << "[Response_Ok::_init] Request location: " << req_location << RESET << std::endl;
		Response				&moi = *this;
		moi = Response_Not_Found(*_request);
		return ;
	}

	const std::string	URI			= req_location.substr(serv_loc.get_URI().length());
	_content_path = serv_loc.get_root() + (URI[0] == '/' ? "" : "/") + URI;

	if (req_location.back() == '/')
		_content_path += serv_loc.get_index();

	_status = "200 OK";
}
