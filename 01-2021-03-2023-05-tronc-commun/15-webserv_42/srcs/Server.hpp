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
#include <string>
#include <vector>
#include <utility>

#include <toml_parser.hpp>
#include "Location.hpp"

class Location;

class Server
{
public:
	typedef std::vector<std::string>	vector_str;

private:
	std::string							_name;

	std::string							_addr;
	int									_port;
	unsigned int						_max_body_size;
	vector_str							_server_names;
	std::vector<Location>				_locations;
	std::map<int, std::string>			_error_pages;

public:
	// Not using a reference on locations is intentional. That SHOULD let us use copy elision.
	Server(std::string const& name, std::string const& addr, int port, unsigned int max_body_size,
			std::pair<vector_str::iterator, vector_str::iterator> serv_names, std::vector<Location> locations,
			std::map<int, std::string> error_pages);

	~Server();

	std::string get_name() const;

	std::string		get_addr()			const;
	int				get_port() 			const;
	std::string		get_port_str()		const;
	unsigned int	get_max_body_size()	const;

	std::vector<Location> const&		get_locations() const;
	vector_str const&					get_server_names() const;
	std::map<int, std::string> const&	get_error_pages() const;
	std::string							get_error_page(std::string const& code) const;
	std::string							get_error_page(int code) const;

	bool	has_server_name(std::string const& name) const;
};
