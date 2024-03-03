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

#include "Queryparser.hpp"
#include <webserv.hpp>

Queryparser::Firstline Queryparser::parse_req_firstline(const std::string &str, std::string::const_iterator &it)
{
	std::string::const_iterator		end = str.begin();

	Queryparser::Firstline			firstline;

	while(end < str.end() && *end != '\n')
		end++;

	if (*(end - 1) != '\r')
		throw std::runtime_error("Bad Request: Missparsed end of firstline");

	for (; it < end && *it != ' '; it++)
		firstline.method += toupper(*it);
	it++;
	for (; it < end && *it != ' '; it++)
		firstline.uri += *it;
	it++;
	for (; it < end && *it != ' ' && *it != '\r'; it++)
		firstline.http_version += *it;

	if (*it != '\r')
		throw std::runtime_error("Bad Request: Too many element on firstline");
	it += 2;

	if (firstline.http_version.rfind("HTTP/", 0) != 0)
		throw std::runtime_error("Bad Request: Bad HTTP_VERSION");

	return firstline;
}

void Queryparser::parse_resp_firstline(const std::string &str, std::string::const_iterator &it)
{
	std::string::const_iterator		end = str.begin();

	while(end < str.end() && *end != '\n')
		end++;

	if (*(end - 1) != '\r')
		throw std::runtime_error("Bad Request: Missparsed end of firstline");

	for (; it < end && *it != ' '; it++)
	{
	}
	it++;
	for (; it < end && *it != ' '; it++)
	{
		if (!('0' <= *it && *it <= '9'))
			throw std::runtime_error("Bad Request: Not a number");
	}
	it++;
	for (; it < end && *it != '\r'; it++)
	{
	}

	if (*it != '\r')
		throw std::runtime_error("Bad Request: Too many element on firstline");
	it += 2;
}

std::string Queryparser::parse_otherline(std::string &str, std::string::const_iterator &it, map_ss &header)
{
	std::string::const_iterator		end = str.end();

	std::string			key;
	std::string			val;

	header.clear();
	for (std::string key, val; it < end && *it != '\r' && *it != '\n'; it += 2, key = "", val = "")
	{
		for (int i = 0; it < end && *it != ':'; it++, i++)
		{
			if (!(('a' <= *it && *it <= 'z') || ('A' <= *it && *it <= 'Z') || ('0' <= *it && *it <= '9')
					|| *it == '-' || *it == '_'))
				throw std::runtime_error("Bad Request: Keyname invalid");
			key += (i == 0 || *(it - 1) == '-') ? toupper(*it) : tolower(*it);
		}
		if (*(++it) == ' ') it++;
		for (int i = 0; it < end && *it != '\r' && *it != '\n'; it++, i++)
			val += *it;
		header.insert(Queryparser::pair_ss(key, val));
		if (*it != '\r' || *(it + 1) != '\n')
			throw std::runtime_error("Bad Request: Missparsed header");
	}
	if (*it != '\r' || *(it + 1) != '\n')
		throw std::runtime_error("Bad Request: Missparsed end of header");
	it += 2;
	return std::string(it, end);
}

std::string Queryparser::decode_URI_Component(std::string str)
{
	std::string::iterator		it;
	std::string::iterator		start;
	int							mode = 0;
	int							num;
	char						repl[2] = {0};

	for (it = str.begin(); it != str.end(); it++)
	{
		if (*it == '%')
		{
			start = it;
			mode = 1;
		}
		else if (isxdigit(*it) && 1 <= mode && mode < 3)
		{
			mode++;
			if (mode == 3)
			{
				num = strtol(std::string(start + 1, it + 1).c_str(), NULL, 16);
				if (32 <= num && num <= 126)
				{
					*repl = static_cast<char>(num);
					str.replace(start, it + 1, repl);
					it -= 2;
				}
				else if (0 <= num && num < 32)
				// Securité on accepte pas les caractères invisibles
				{
					str.erase(start, it + 1);
					it -= 3;
				}
				mode = 0;
			}
		}
		else
			mode = 0;
	}
	return (str);
}

void	Queryparser::querystring_parser(Queryparser::multimap_ss &data, const std::string &query, char starter = '?')
{
	char						sep = '&';
	char						eq = '=';

	std::string					varName;
	std::string					key;
	std::string					val;

	std::string::const_iterator	it;
	int							mode = -1;

	for (it = query.begin(); it != query.end(); it++)
	{
		if (mode < 0 && *it == starter && starter != 0)
			continue;
		else if (mode <= 0 && *it == eq)
			mode = 1;
		else if (mode <= 0 && *it != sep && *it != '\0')
			key = ((key == "") ? "" : key) + *it;
		else if (*it != sep && *it != '\0')
			val = val + *it;
		else
		{
			if (key != "")
				data.insert(pair_ss(
					decode_URI_Component(key),
					decode_URI_Component(val)
				));
			key = "";
			val = "";
			mode = 0;
		}
	}
}
