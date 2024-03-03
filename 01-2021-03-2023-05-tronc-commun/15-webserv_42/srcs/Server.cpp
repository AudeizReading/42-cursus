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

#include "Server.hpp"

Server::Server(std::string const& name, std::string const& addr, int port, unsigned int max_body_size,
		std::pair<vector_str::iterator, vector_str::iterator> serv_names, std::vector<Location> locations,
		std::map<int, std::string> error_pages
	): _name(name), _addr(addr), _port(port), _max_body_size(max_body_size), _locations(locations), _error_pages(error_pages)
{
	_server_names.assign(serv_names.first, serv_names.second);
}

Server::~Server()
{
}

std::string Server::get_name() const
{
	return (_name);
}

bool	Server::has_server_name(std::string const& name) const
{
	return std::find(_server_names.begin(), _server_names.end(), name) != _server_names.end();
}

unsigned int	Server::get_max_body_size() const
{
	return _max_body_size;
}

std::string	Server::get_addr() const
{
	return _addr;
}

int	Server::get_port() const
{
	return _port;
}

std::string	Server::get_port_str() const
{
	std::stringstream portstr;
	portstr << _port;
	return portstr.str();
}

std::vector<Location> const&	Server::get_locations() const
{
	return _locations;
}

Server::vector_str const&	Server::get_server_names() const
{
	return _server_names;
}

std::map<int, std::string> const&	Server::get_error_pages() const
{
	return _error_pages;
}

std::string	Server::get_error_page(std::string const& code) const
{
	std::map<int, std::string>::const_iterator	target = _error_pages.find(std::atoi(code.c_str()));
	return (target == _error_pages.end() ? "" : target->second);
}

std::string	Server::get_error_page(int code) const
{
	std::map<int, std::string>::const_iterator	target = _error_pages.find(code);
	return (target == _error_pages.end() ? "" : target->second);
}
