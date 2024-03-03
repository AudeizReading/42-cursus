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

class Response_Ok: public Response
{
private:

protected:
	virtual void _init();

public:
	Response_Ok(Request const& request);

	~Response_Ok();
};
