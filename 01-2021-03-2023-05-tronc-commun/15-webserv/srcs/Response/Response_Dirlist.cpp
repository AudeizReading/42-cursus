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

#include "Response_Dirlist.hpp"
#include "Response_4XX.hpp"

Response_Dirlist::Response_Dirlist(Request const& request, std::string const& content): Response(request)
{
	_content = content;
	create();
}

Response_Dirlist::~Response_Dirlist()
{
}

void Response_Dirlist::_init()
{
	const std::string&	req_location = _request->get_location();
	const Location&		serv_loc = *_request->get_server_location();

	if (req_location[0] != '/')
	{
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
