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
#include <sstream>
#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <signal.h>

#include "Request.hpp"
#include "Server.hpp"
#include "CGIEnviron.hpp"

#define PRINT(x) std::cerr << std::boolalpha << "\nin " << __FILE__ << ":" << __LINE__ << "\n"<< __func__ << ": " << #x << "\n" << x << std::endl;
// Following https://www.ietf.org/rfc/rfc3875.txt
class CGIManager {
	private:
		CGIEnviron		_environ;
		int				_cgi_response_fds[2];
		int				_cgi_request_fds[2];
		size_t			_content_length;
		std::string		_request_data;
		size_t			_request_data_length;
		std::string		_plaintext;


		CGIManager(void);
		CGIManager(const CGIManager &src);
		CGIManager& operator=(const CGIManager &src);

		void			_close_fds();
		bool			_pipe();
		void			_launchExec() const;
		bool			_getCGIResponse();

	public:
		CGIManager(const Request& req, const Server& serv, const Location& location);
		~CGIManager(void);

		std::string		getPlainText() const;

		static void		signal_pipe_handler(int signo);

		bool			exec();
		
};
