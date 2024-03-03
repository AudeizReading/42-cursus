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

#include "../Response.hpp"

#define _PROTO_RESPONSE(_Name) \
		class _Name: public Response \
		{ \
		protected: \
			virtual void _init(); \
		public: \
			_Name(Request const& request); \
			~_Name(); \
		};

// Don't forget to edit: `includes/http_error_codes.hpp` if you want add an error_code

_PROTO_RESPONSE(Response_Bad_Request)
_PROTO_RESPONSE(Response_Forbidden)
_PROTO_RESPONSE(Response_Not_Found)
_PROTO_RESPONSE(Response_Method_Not_Allowed)
_PROTO_RESPONSE(Response_Payload_Too_Large)
_PROTO_RESPONSE(Response_Request_Header_Too_Large)
_PROTO_RESPONSE(Response_Internal_Server_Error)
_PROTO_RESPONSE(Response_Internal_Server_Gateway_Timeout)
