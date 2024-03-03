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

#include "Response_4XX.hpp"

#define _DEFINE_RESPONSE(_Name, _Page, _Status, _StatusCode) \
		_Name::_Name(Request const& request): Response(request) \
		{ \
			_content_path = request.get_server()->get_error_page(_StatusCode); \
			create(); \
		} \
		_Name::~_Name() { } \
		void _Name::_init() { _status = _Status; } \

_DEFINE_RESPONSE(Response_Bad_Request,						"res/error/400.html", "400 Bad Request",			400)
_DEFINE_RESPONSE(Response_Forbidden,						"res/error/403.html", "403 Forbidden", 				403)
_DEFINE_RESPONSE(Response_Not_Found,						"res/error/404.html", "404 Not Found", 				404)
_DEFINE_RESPONSE(Response_Payload_Too_Large,				"res/error/413.html", "413 Payload Too Large", 		413)
_DEFINE_RESPONSE(Response_Request_Header_Too_Large,			"res/error/431.html",
															"431 Request Header Fields Too Large",				431)
_DEFINE_RESPONSE(Response_Internal_Server_Error,			"res/error/500.html", "500 Internal Server Error",	500)
_DEFINE_RESPONSE(Response_Internal_Server_Gateway_Timeout,	"res/error/504.html", "504 Gateway Timeout",		504)

// ============================================================================================== //
// ------------------------------------- Manual Definitions ------------------------------------- //
// ============================================================================================== //

Response_Method_Not_Allowed::Response_Method_Not_Allowed(Request const& request) : Response(request)
{
	_content_path = request.get_server()->get_error_page(E_METHOD_NOT_ALLOWED);
	create();
}
Response_Method_Not_Allowed::~Response_Method_Not_Allowed()
{
}

void	Response_Method_Not_Allowed::_init()
{
	_status = "405 Method Not Allowed";
	_header.insert(Response::pair_ss("Allow", _request->get_server_location()->get_allowed_methods()));
}
