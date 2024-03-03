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

#include <iostream>

#include <sys/types.h>
#include <sys/socket.h>
#include <sys/event.h>
#include <sys/time.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>

#include "webserv.hpp"
#include "Listener.hpp"
#include "Response/Response_Ok.hpp"
#include "Response/Response_4XX.hpp"

#include <arpa/inet.h>
#include <cassert>

#define I_LOVE_ICEBERG 1

Listener::Listener(std::string const& listen_addr, int listen_port, int listen_backlog,
		vector_s::const_iterator servers_first,
		vector_s::const_iterator servers_last
	): _fd(INT_MIN), _addr(listen_addr), _port(listen_port), _listen_backlog(listen_backlog)
{
	_servers.assign(servers_first, servers_last);
}

Listener::vector_s const&	Listener::get_servers() const
{
	return _servers;
}

void	Listener::outflush()
{
	std::cout << _out.str();
	_out.str("");
}

void	Listener::start_listener()
{
	/*
	* PF_INET: Internet version 4 protocols
	* SOCK_STREAM: TCP
	* protocol toujours 0
	*/
	_fd = socket(PF_INET, SOCK_STREAM, 0); 
	_out << "[listener] create socket#" << _fd << std::endl;
	outflush();
	if (_fd < 0)
		throw std::runtime_error(strerror(errno));
	fcntl(_fd, F_SETFL, O_NONBLOCK);

	/*
	* SOL_SOCKET: La doc indique directement SOL_SOCKET.
	* SO_REUSEADDR: Allows the socket to be bound to an address that is already in use.
	*
	* doc: https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-setsockopt
	*/
	// SO_REUSEADDR => Comportement indéterminé !, vaut mieux désactiver le TIME_WAIT avec SO_LINGER = OFF
	unsigned re_use_addr = 1;
	if (setsockopt(_fd, SOL_SOCKET, SO_REUSEADDR, &re_use_addr, sizeof(re_use_addr)) < 0)
		throw std::runtime_error(strerror(errno));

	// Disable TIME_WAIT
	/*struct linger so_linger = { 0, 0 }; // l_onoff = 0 -> OFF, l_linger = 0sec (no timeout because OFF)
	if (setsockopt(_fd, SOL_SOCKET, SO_LINGER, &so_linger, sizeof(so_linger)) < 0)
		throw std::runtime_error(strerror(errno));

	// TIMEOUT TO 10sec
	struct timeval timeout; // fonctionne peut-être
	timeout.tv_sec = 10;
	timeout.tv_usec = 0;

	if (setsockopt(_fd, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout)) < 0)
		throw std::runtime_error(strerror(errno));*/

	/*
	* En fonction du premier argument de socket, la doc nous guide vers sockaddr_in
	* doc: https://man7.org/linux/man-pages/man7/ip.7.html
	* 
	* struct sockaddr_in {
	* 	sa_family_t			sin_family;	// address family: AF_INET
	* 	in_port_t			sin_port;	// port in network byte order
	* 	struct in_addr		sin_addr;	// internet address
	* };
	* 
	*/
	struct sockaddr_in			address;

	bzero(reinterpret_cast<char *>(&address), sizeof(address));

	address.sin_family = AF_INET;
	address.sin_port = htons(_port);
	address.sin_addr.s_addr = inet_addr(_addr.c_str());

	_out << "[listener] bind socket#" << _fd << " to " << _addr << ':' <<_port << std::endl;
	outflush();
	if (bind(_fd, reinterpret_cast<struct sockaddr *>(&address), sizeof(address)) < 0)
		throw std::runtime_error(strerror(errno));

	// if (_port == 1234)
	// 	throw std::runtime_error("DEBUG: TEST EXCEPTION THROW");

	_out << "[listener] listen socket#" << _fd << " (max " << _listen_backlog << " sockets)" << std::endl;
	outflush();
	if (listen(_fd, _listen_backlog) < 0)
	{
		/*
		 * If a connection request arrives with the queue full, the client may receive an error
		 * with an indication of ECONNREFUSED. Alternatively, if the underlying protocol supports
		 * retransmission, the request may be ignored so that retries may succeed.
		 */
		_out << "[listener] Cannot listen, please retry" << std::endl;
		outflush();
		throw std::runtime_error(strerror(errno));
	}

	// src: https://dev.to/frevib/a-tcp-server-with-kqueue-527
	int							kq = kqueue();
	struct kevent				change_event, event;

	// TIMEOUT TO 10sec
	struct timespec				ktimeout; // fonctionne peut-être
	ktimeout.tv_sec = 10;
	ktimeout.tv_nsec = 0;

	_out << "[listener] register kevent for socket#" << _fd << std::endl;
	outflush();

	EV_SET(&change_event, _fd, EVFILT_READ, EV_ADD, 0, 0, NULL);
	if (kevent(kq, &change_event, 1, NULL, 0, &ktimeout) < 0)
		throw std::runtime_error(strerror(errno));

	while (I_LOVE_ICEBERG)
	{
		int							new_events;

		new_events = kevent(kq, NULL, 0, &event, 1, &ktimeout);
		if (new_events < 0)
			throw std::runtime_error(strerror(errno));

		for (int i = 0, event_fd; new_events > i; i++)
		{
			event_fd = event.ident;

			/*
			if (event.filter == EVFILT_READ)	std::cerr << "EVFILT_READ: ";
			if (event.filter == EVFILT_WRITE)	std::cerr << "EVFILT_WRITE: ";
			//if (event.filter == EVFILT_EMPTY)	std::cerr << "EVFILT_EMPTY: ";
			if (event.filter == EVFILT_AIO)		std::cerr << "EVFILT_AIO: ";
			if (event.filter == EVFILT_VNODE)	std::cerr << "EVFILT_VNODE: ";
			if (event.filter == EVFILT_PROC)	std::cerr << "EVFILT_PROC: ";
			//if (event.filter == EVFILT_PROCDESC)	std::cerr << "EVFILT_PROCDESC: ";
			if (event.filter == EVFILT_SIGNAL)	std::cerr << "EVFILT_SIGNAL: ";
			if (event.filter == EVFILT_TIMER)	std::cerr << "EVFILT_TIMER: ";
			if (event.filter == EVFILT_USER)	std::cerr << "EVFILT_USER: ";

			if (event.flags & EV_ADD)			std::cerr << "EV_ADD ";
			if (event.flags & EV_ENABLE)		std::cerr << "EV_ENABLE ";
			if (event.flags & EV_DISABLE)		std::cerr << "EV_DISABLE ";
			if (event.flags & EV_DISPATCH)		std::cerr << "EV_DISPATCH ";
			if (event.flags & EV_DELETE)		std::cerr << "EV_DELETE ";
			if (event.flags & EV_RECEIPT)		std::cerr << "EV_RECEIPT ";
			if (event.flags & EV_ONESHOT)		std::cerr << "EV_ONESHOT ";
			if (event.flags & EV_CLEAR)			std::cerr << "EV_CLEAR ";
			if (event.flags & EV_EOF)			std::cerr << "EV_EOF ";
			if (event.flags & EV_ERROR)			std::cerr << "EV_ERROR ";

			std::cerr << std::endl;
			*/

			if (event.flags & EV_EOF)
			{
				std::cout << "[listener] client has disconnected for event#" << event_fd << std::endl;
				_requests.erase(event_fd);
				EV_SET(&change_event, event_fd, EVFILT_TIMER, EV_DELETE, 0, 0, NULL);
				kevent(kq, &change_event, 1, NULL, 0, &ktimeout);
				close(event_fd);
			}
			else if (event_fd == _fd) // = Socket connection
			{
				int sockaddr_in_size = sizeof(address);
				int new_socket = accept(event_fd, reinterpret_cast<struct sockaddr *>(&address),
								reinterpret_cast<socklen_t *>(&sockaddr_in_size));

				std::cout << "[listener] accept connection #" << new_socket
							<< " for socket#" << event_fd << std::endl;
				if (new_socket < 0)
				{
					std::cout << "[listener] accept socket error for event#" << event_fd << std::endl;
					perror("[listener] -- accept socket error");
					continue;
				}

				EV_SET(&change_event, new_socket, EVFILT_READ, EV_ADD, 0, 0, NULL);
				if (kevent(kq, &change_event, 1, NULL, 0, &ktimeout) < 0)
				{
					std::cout << "[listener] EVFILT_READ add: error for event#" << event_fd << std::endl;
					perror("[listener] -- kevent error");
				}
			}
			else if (event.filter == EVFILT_READ)
			/*
			 * This event coming each block of 512 (PIPE_BUF) character of the request, until we :
			 * A) Read all the data (also sometime, content cannot be thrust)
			 * B) close
			 * Also, we can send() before A) or B).
			 */
			{
				// char buffer[PIPE_BUF + 1] = {0};
				// int size = recv(event_fd, buffer, PIPE_BUF, 0);

				std::vector<char> buffer(event.data);
				int size = recv(event_fd, &buffer[0], buffer.size(), 0);

				Listener::map_ir::iterator search = _requests.find(event_fd);
				if (search == _requests.end())
				{
					_requests.insert(Listener::pair_ir(event_fd, Request(*this, address)));
					search = _requests.find(event_fd);
					search->second.set_s_sloc(&_servers[0], &_servers[0].get_locations()[0]);
					std::cout << "[listener] Start recv socket#" << event_fd
						<< " ip: " << search->second.get_addr()
						<< " host: " << search->second.get_host() << std::endl;
				}

				Request &request = search->second;

				if (size < 0)
				{
					std::cout << "[listener] recv error for socket#" << event_fd << std::endl;
					request.bind_response(new Response_Internal_Server_Error(Request(*this, address)));
				}
				else
					request.append_plaintext(buffer.cbegin(), buffer.cend());

				// REGISTER AND RELOAD TIMEOUT
				EV_SET(&change_event, event_fd, EVFILT_TIMER, EV_ADD | EV_ONESHOT, NOTE_SECONDS, 10, NULL);
				if (kevent(kq, &change_event, 1, NULL, 0, &ktimeout) < 0)
				{
					std::cout << "[listener] EVFILT_TIMER add: error for socket#" << event_fd << std::endl;
					perror("[listener] -- kevent error");
				}

				if (!request.is_answered() && !request.is_parsed())
					continue ;

				if (request.is_answered()) { // answer is ERROR
					std::cout << "[listener] already answered, disable EVFILT_READ for socket#" << event_fd << std::endl;
					EV_SET(&change_event, event_fd, EVFILT_READ, EV_DELETE, 0, 0, NULL);
					if (kevent(kq, &change_event, 1, NULL, 0, &ktimeout) < 0)
					{
						std::cout << "[listener] EVFILT_READ delete: error for socket#" << event_fd << std::endl;
						perror("[listener] -- kevent error");
					}
				}

				unsigned long	content_length = request.get_contentLength();

				if (request.is_answered() || (request.is_parsed()
							&& ! (event.data - size > 0
							|| request.get_content().length() < content_length))) {
					if (!request.is_answered())
						request.bind_response(new Response_Ok(request));

					std::cerr << request << std::endl;
					EV_SET(&change_event, event_fd, EVFILT_WRITE, EV_ADD, 0, 0, NULL);
					if (kevent(kq, &change_event, 1, NULL, 0, &ktimeout) < 0)
					{
						std::cout << "[listener] EVFILT_WRITE add: error for socket#" << event_fd << std::endl;
						perror("[listener] -- kevent error");
					}
				}
			}
			else if (event.filter == EVFILT_WRITE)
			{
				Listener::map_ir::iterator search = _requests.find(event_fd);
				if (search == _requests.end())
				{
					std::cout << "\033[32mUnexpected: Malformed/empty request\033[0m" << std::endl;
					_requests.insert(Listener::pair_ir(event_fd, Request(*this, address)));
					search = _requests.find(event_fd);
				}

				Request &request = search->second;
				if (!request.is_answered())
				{
					std::cout << "\033[32mUnexpected: Malformed/empty request\033[0m" << std::endl;
					request.bind_response(new Response_Bad_Request(request));
				}

				Response const& response = *(request.get_response());

				long already_sent = request.get_char_sent();
				std::string will_be_send = static_cast<std::string>(response).substr(already_sent);

				long size = send(event_fd, will_be_send.c_str(), will_be_send.length(), 0);
				std::cout << "[listener] send size: " << size << "/" << will_be_send.length() << " to socket#" << event_fd << std::endl;

				if(size < 0)
				{
					std::cout << "Cannot send, retry!" << std::endl;
					continue ;
				}
				request.set_char_sent(already_sent + size);
				if (static_cast<unsigned long>(size) >= will_be_send.length())
				{
					response.print_debug();
					std::cout << "[listener] \033[32msend " << response.get_status() << "\033[0m to socket#" << event_fd
						<< _CYN << " (Request location: " << request.get_location() << ")" << RESET << std::endl;
					//delete response;
					//delete request;
					std::cout << "[listener] close socket#" << event_fd << std::endl;
					_requests.erase(event_fd);
					EV_SET(&change_event, event_fd, EVFILT_TIMER, EV_DELETE, 0, 0, NULL);
					kevent(kq, &change_event, 1, NULL, 0, &ktimeout);
					close(event_fd);
				}
			}
			else if (event.filter == EVFILT_TIMER)
			{
				std::cerr << "\033[32m[start_listener]{event.filter == EVFILT_TIMER} event.data: <<" << event.data << ">>\033[0m\n";
				if (_requests.find(event_fd) == _requests.end())
				{
					std::cout << "[listener] \033[32mmissing request\033[0m for EVFILT_TIMER socket#" << event_fd << std::endl;
					continue ; // we continue because already close.
				} else {
					Listener::map_ir::iterator search = _requests.find(event_fd);

					Request &request = search->second;

					request.bind_response(new Response_Internal_Server_Gateway_Timeout(request));
					EV_SET(&change_event, event_fd, EVFILT_READ, EV_DELETE, 0, 0, NULL);
					kevent(kq, &change_event, 1, NULL, 0, &ktimeout);
					EV_SET(&change_event, event_fd, EVFILT_WRITE, EV_ADD, 0, 0, NULL);
					if (kevent(kq, &change_event, 1, NULL, 0, &ktimeout) < 0)
					{
						std::cout << "[listener] EVFILT_WRITE add: error for socket#" << event_fd << std::endl;
						perror("[listener] -- kevent error");
					}
				}
			}
			else
			{
				std::cout << "[listener] and else? event#" << event_fd << std::endl;
			}
		}
	}
}

Listener::~Listener()
{
	if (_fd == INT_MIN) // Listener hasn't been started
		return ;
	_out << "[listener] shutdown and close socket#" << _fd << std::endl;
	outflush();
	shutdown(_fd, SHUT_RDWR);
	_requests.clear();
	if (close(_fd) < 0)
		throw std::runtime_error(strerror(errno));
}
