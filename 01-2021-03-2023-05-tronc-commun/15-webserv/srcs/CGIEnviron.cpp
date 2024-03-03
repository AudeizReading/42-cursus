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

#include "CGIEnviron.hpp"

CGIEnviron::CGIEnviron(const Request& req, const Server& serv, const Location& location) : _request(req), _server(serv), _location(location), _header(this->_request.get_header()), _env(), _boundary() {
	this->_setGlobalEnv();
}

CGIEnviron::~CGIEnviron(void) {
}

CGIEnviron::map_ss	CGIEnviron::getEnv()		const { return this->_env; }
std::string			CGIEnviron::getBoundary()	const { return this->_boundary; }

void				CGIEnviron::_setHeaderEnv()
{
	Request::map_ss::iterator	header_begin = _header.begin();
	Request::map_ss::iterator	header_end = _header.end();
		
	for (; header_begin != header_end; ++header_begin)
	{
		std::string http_key = header_begin->first;
		std::string http_val = header_begin->second;

		std::transform(http_key.begin(), http_key.end(), http_key.begin(), toupper);
		std::replace(http_key.begin(), http_key.end(), '-', '_');

		// On cherche le token de delimitations des fichiers binaires 
		if (http_key == "CONTENT_TYPE" && (http_val.find("multipart/form-data") != std::string::npos))
		{
			if (http_val.find_first_of(";") != std::string::npos)
			{
				std::string tmp = http_val.substr(http_val.find_first_of(";") + 2);
				if (tmp.find("boundary") != std::string::npos)
				{
					this->_boundary = tmp.substr(tmp.find_first_of("=") + 1);
				}
			}
		}
		this->_env.insert(value_type(("HTTP_" + http_key), header_begin->second));
		this->_env.insert(value_type((http_key), header_begin->second));
	}
}

void				CGIEnviron::_setEnv()
{
	// Extrait la bonne location HTTP, en tenant compte du rerootage demandé par le sujet.
	// Exemple: dans notre config, "/img/foo/image.png" devient "/foo/image.png"
	std::string	location = _request.get_location().substr(_location.get_URI().length());
	std::string	ext = location.substr(location.find_last_of(".") + 1);

	if (*location.begin() == '/')
	{
		location = location.substr(location.find_first_of("/") + 1); // delete first / because root has already it at its end
	}

	// La racine de l'endroit où tu es, c'est la root de la Location + son URI.
	// http://nginx.org/en/docs/beginners_guide.html, section "Serving Static Content"
	std::string	root = _location.get_root() + '/'; 

	std::string	script_name = root + location;
	// path_info : This is the path part after the script name (yes it can) -> considered as infos on the path by rfc
	std::string	path_info = location.substr(location.find_last_of(".") + ext.size() + 1);
	std::string	query_string = this->_request.get_query();

	// if the location has not the path info
	if (path_info.size() == 0 && query_string.size() > 0 && query_string.find_first_of("/") != std::string::npos )// it is the query string that has the path_info
	{
		path_info = query_string.substr(query_string.find_first_of("/"));
		// on reaffecte seulement si path info n'est pas en fait une query string (/var=value/var2=value2/)
		if (path_info != query_string)
			query_string = query_string.substr(0, query_string.find_first_of("/"));
	}
	// path_translated : This is DOCUMENT_ROOT + PATH_INFO
	std::string	path_translated = root + path_info;

	// method POST
	std::string	content = this->_request.get_content();
	std::string	content_length = std::to_string(content.length());

	// Retraitement de la query string pouvant contenir le path_info
	this->_setHeaderEnv();

	std::string	cgi_env[][2] = {
			{REQUEST_METHOD,		this->_request.get_method()},
			{QUERY_STRING,			query_string},
			{CONTENT_LENGTH,		content_length},
			{CONTENT_TYPE,			this->_header["Content-Type"]},
			{GATEWAY_INTERFACE,		_location.get_cgi_environ().at(GATEWAY_INTERFACE)},
			{CGI_EXEC,				_location.get_cgi_environ().at(CGI_EXEC)},
			{SERVER_SOFTWARE,		_location.get_cgi_environ().at(SERVER_SOFTWARE)},
			{SERVER_NAME,			this->_header["Host"]},
			{SERVER_PROTOCOL,		this->_request.get_http_version()},
			{SERVER_PORT,			_server.get_port_str()},
			{PATH_INFO,				path_info},
			{PATH_TRANSLATED,		path_translated},
			{DOCUMENT_ROOT,			root},
			{SCRIPT_NAME,			script_name},
			{REMOTE_HOST,			_request.get_host()},
			{REMOTE_ADDR,			_request.get_addr()},
			{DIR_UPLOAD,			_location.get_cgi_environ().at(DIR_UPLOAD)} // NOTE: not very pretty?
	};

	for (int i = 0; i != get_arr_2D_width(cgi_env); ++i) 
	{
		this->_env.insert(value_type(cgi_env[i][0], cgi_env[i][1]));
	}
}

bool				CGIEnviron::_putenv(const char *name, const char *value)
{
	if (::setenv(name, value, 1) == -1)
	{
		throw std::runtime_error(strerror(errno));
		return false;
	}
	return true;
}

CGIEnviron&			CGIEnviron::_setGlobalEnv()
{
	this->_setEnv();
	
	for (map_ss::iterator it = this->_env.begin(); it != this->_env.end(); ++it)
	{
		 try {
			 this->_putenv(it->first.c_str(), it->second.c_str());
		 }
		 catch(const std::exception& e)
		 {
			 std::cerr << "\033[31;1m[CGI]: " << __FILE__ << " " << __LINE__ << " " << e.what() << ": problem with the CGI environment\033[0m" << std::endl;
			 std::cerr << e.what() << '\n';
			 return *this;
		 }
	}
	return *this;
}
