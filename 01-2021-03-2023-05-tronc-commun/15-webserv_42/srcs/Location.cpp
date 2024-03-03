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

#include "Location.hpp"

Location::Location(std::string const& URI,
				   std::string const& root,
				   std::string const& index,
				   std::string const& redirect,
				   std::string const& cgi_file_ext,
				   bool dir_listing,
				   std::map<std::string, std::string> const& cgi_environ)

: _URI(URI), _root(root), _index(index), _redirect(redirect), _cgi_file_ext(cgi_file_ext),
	_cgi_environ(cgi_environ), _allow_dir_listing(dir_listing), _allow_GET(true), _allow_POST(true),
	_allow_DELETE(true), _allow_HEAD(true)
{
	if (*(_root.end() - 1) == '/')
		_root.erase(_root.end() - 1);
	if (_URI[0] != '/')
		_URI = '/' + _URI;
}

void	Location::set_allowed_methods(bool GET, bool POST, bool DELETE, bool HEAD)
{
	_allow_GET		= GET;
	_allow_POST		= POST;
	_allow_DELETE	= DELETE;
	_allow_HEAD		= HEAD;
}

bool	Location::allows_GET() const
{
	return _allow_GET;
}
bool	Location::allows_POST() const
{
	return _allow_POST;
}
bool	Location::allows_DELETE() const
{
	return _allow_DELETE;
}

bool	Location::allows_method(std::string const& method_name) const
{
	if (method_name == "GET")
		return _allow_GET;
	else if (method_name == "POST")
		return _allow_POST;
	else if (method_name == "DELETE")
		return _allow_DELETE;
	else if (method_name == "HEAD")
		return _allow_HEAD;
	else
		return false;
}

std::string	Location::get_allowed_methods() const
{
	std::string allowed;
	if (_allow_GET)
		allowed += "GET";
	if (_allow_POST)
		allowed += std::string(allowed.empty() ? "" : ", ") + "POST";
	if (_allow_DELETE)
		allowed += std::string(allowed.empty() ? "" : ", ") + "DELETE";
	if (_allow_HEAD)
		allowed += std::string(allowed.empty() ? "" : ", ") + "HEAD";
	return allowed;
}

bool	Location::allows_dir_listing() const
{
	return _allow_dir_listing;
}

bool	Location::has_redirect() const
{
	return _redirect.size();
}

std::string const&	Location::get_root() const
{
	return _root;
}
std::string const&	Location::get_URI() const
{
	return _URI;
}
std::string const&	Location::get_index() const
{
	return _index;
}
std::string const&	Location::get_redirect() const
{
	return _redirect;
}

std::string const&	Location::get_cgi_file_ext() const
{
	return _cgi_file_ext;
}

Location::map_strstr const&	Location::get_cgi_environ() const
{
	return _cgi_environ;
}
