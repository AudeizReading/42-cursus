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

#include <ctype.h>
#include <stdlib.h>

namespace Queryparser
{
	typedef std::multimap<std::string, std::string>		multimap_ss;
	typedef std::map<std::string, std::string>			map_ss;
	typedef std::pair<std::string, std::string>			pair_ss;

	struct Firstline {
		std::string method;
		std::string uri;
		std::string http_version;
	};

	Firstline parse_req_firstline(const std::string &str, std::string::const_iterator &it);
	void parse_resp_firstline(const std::string &str, std::string::const_iterator &it);
	std::string parse_otherline(std::string &str, std::string::const_iterator &it, map_ss &header);

	std::string decode_URI_Component(std::string str);
	void querystring_parser(multimap_ss &data, const std::string &query, char starter);
}
