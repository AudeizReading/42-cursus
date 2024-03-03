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

#include <webserv_utils.hpp>

std::string	strtrim_right(std::string const& str, const char *charset)
{
	std::string::size_type	tgt = str.find_last_not_of(charset);

	if (tgt == std::string::npos)
		return "";
	else
		return str.substr(0, tgt + 1);
}

std::string	strtrim_left(std::string const& str, const char *charset)
{
	std::string::size_type	tgt = str.find_first_not_of(charset);

	if (tgt == std::string::npos)
		return "";
	else
		return str.substr(tgt);
}

bool	is_valid_URI(std::string const& uri)
{
	for (std::string::const_iterator it = uri.begin(); it != uri.end(); ++it)
	{
		if (!(('a' <= *it && *it <= 'z') || ('A' <= *it && *it <= 'Z') || ('0' <= *it && *it <= '9')
			|| *it == '-' || *it == '_' || *it == '/' || *it == '.'))
		{
			return false;
		}
	}
	return true;
}
