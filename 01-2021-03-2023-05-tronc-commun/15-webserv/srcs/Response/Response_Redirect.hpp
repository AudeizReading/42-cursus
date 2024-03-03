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

#include "Response_Redirect.hpp"
#include "Response_4XX.hpp"

_PROTO_RESPONSE(Response_Redirect)

class Response_Redirect_Permanent: public Response
{
protected:
	virtual void _init();
public:
	Response_Redirect_Permanent(Request const& request, std::string const& redirect_to);
	~Response_Redirect_Permanent();
};
