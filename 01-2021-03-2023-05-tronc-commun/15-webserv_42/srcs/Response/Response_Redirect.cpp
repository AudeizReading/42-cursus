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

#include "Response_Redirect.hpp"

Response_Redirect::Response_Redirect(Request const& request) : Response(request)
{
	create();
}
Response_Redirect::~Response_Redirect()
{
}

void	Response_Redirect::_init()
{
	_status = "302 Found";
	_header.insert(Response::pair_ss("Location", _request->get_server_location()->get_redirect()));
}

Response_Redirect_Permanent::Response_Redirect_Permanent(Request const& request, std::string const& redirect_to)
	: Response(request)
{
	_header.insert(Response::pair_ss("Location", redirect_to));
	create();
}
Response_Redirect_Permanent::~Response_Redirect_Permanent()
{
}

void	Response_Redirect_Permanent::_init()
{
	_status = "301 Moved Permanently";
}
