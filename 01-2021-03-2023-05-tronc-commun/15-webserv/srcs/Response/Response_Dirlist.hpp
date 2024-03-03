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

class Response_Dirlist: public Response
{
private:

protected:
	virtual void _init();

public:
	Response_Dirlist(Request const& request, std::string const& content);

	~Response_Dirlist();
};
