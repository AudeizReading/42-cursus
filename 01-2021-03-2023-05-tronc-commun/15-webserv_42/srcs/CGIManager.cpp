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

#include "CGIManager.hpp"

// - Constr / Destr ------------------------------------------------------------ 
CGIManager::CGIManager(const Request& req, const Server& serv, const Location& location) : _environ(req, serv, location), _content_length(0), _request_data(req.get_content()), _request_data_length(_request_data.size()), _plaintext() {
	try
	{
		this->_pipe();
	}
	catch(const std::exception& e)
	{
		this->_close_fds();
		std::cerr << "\033[31;1m[CGI]: " << __FILE__ << " " << __LINE__ << " " << e.what() << ": problem with the CGI response\033[0m" << std::endl;
		std::cerr << e.what() << '\n';
		return ;
	}
}

CGIManager::~CGIManager(void) { this->_close_fds(); }

// - Accessors ----------------------------------------------------------------- 
std::string			CGIManager::getPlainText()	const { return this->_plaintext; }

// - Accessors ----------------------------------------------------------------- 
void				CGIManager::_close_fds()
{
	::close(this->_cgi_response_fds[0]);
	::close(this->_cgi_response_fds[1]);
	::close(this->_cgi_request_fds[0]);
	::close(this->_cgi_request_fds[1]);
}

bool				CGIManager::_pipe() 
{
	if (::pipe(_cgi_response_fds) == -1)
	{
		throw std::runtime_error(strerror(errno));
		return false;
	}
	if (::pipe(_cgi_request_fds) == -1)
	{
		throw std::runtime_error(strerror(errno));
		return false;
	}
	if (::signal(SIGPIPE, signal_pipe_handler) == SIG_ERR)
	{
		throw std::runtime_error(strerror(errno));
		return false;
	}
	return true;
}

bool				CGIManager::_getCGIResponse()
{
	char	buffer[PIPE_BUF] = {0};
	size_t	tmp_sz = 0;
	size_t	input_sz = 0;

	while ((0 < (tmp_sz = ::read(_cgi_response_fds[0], buffer, PIPE_BUF))))
	{
		buffer[tmp_sz] = 0;
		input_sz += tmp_sz;
		this->_plaintext += buffer;
	}

	size_t	p_size = _plaintext.size();

	// It is forbidden by subject to check errno after a write, so check it manually
	// If we have read the same num of octets than writen them, _content_length takes this value, else throws exception
	(input_sz == p_size && (this->_content_length = p_size));

	if (p_size != input_sz)

	{
		throw std::runtime_error(strerror(EIO));
		return false;
	}
	return true;
}

void				CGIManager::signal_pipe_handler(int signo)
{
	if (signo == SIGPIPE)
	{
		std::cerr << "\033[31;1m[SIGPIPE]: " << __FILE__ << " " << __LINE__ << ": SIGPIPE received from the fds dedicated to to CGI\033[0m" << std::endl;
		throw std::runtime_error(strerror(errno));
		exit(-1);
	}
}

bool				CGIManager::exec() 
{

	int		exit_status = 0;
	pid_t	pid = ::fork();

	switch (pid)
	{
		case -1:
			throw std::runtime_error(strerror(errno));
			return false;
		case 0:
				::close(_cgi_response_fds[0]);
				::close(_cgi_request_fds[1]);

				::close(STDOUT_FILENO);
				::dup2(_cgi_response_fds[1], STDOUT_FILENO);

				::close(STDIN_FILENO);
				::dup2(_cgi_request_fds[0], STDIN_FILENO);

				this->_launchExec();
				std::cerr << "\033[31;1m[CGI]: " << __FILE__ << " " << __LINE__ << ": problem with the CGI executable\033[0m" << std::endl;
				return false;
			break;
		default:
			try
			{
				if (_request_data_length > 0)
				{
					::close(_cgi_request_fds[0]);
					::write(_cgi_request_fds[1], _request_data.c_str(), _request_data_length);
					::close(_cgi_request_fds[1]);
				}

				::close(_cgi_response_fds[1]);
				this->_getCGIResponse();
				::close(_cgi_response_fds[0]);

			}
			catch(const std::exception& e)
			{
				std::cerr << "\033[31;1m[CGI]: " << __FILE__ << " " << __LINE__ << " " << e.what() << ": problem with the CGI response\033[0m" << std::endl;
				return false;
			}
			::waitpid(pid, &exit_status, 0);
			CGIEnviron::map_ss	env = this->_environ.getEnv();
			bool				is_perl_cgi = false;

			if (env["CGI_EXEC"].find("perl") != std::string::npos)
				is_perl_cgi = true;
			if ((exit_status == 1 || exit_status == 256 || exit_status == 512) && WIFEXITED(exit_status) && is_perl_cgi)
				throw std::invalid_argument(strerror(WEXITSTATUS(exit_status)));
			else if (exit_status != 0 && WIFEXITED(exit_status))
				throw std::runtime_error(strerror(WEXITSTATUS(exit_status)));
			else if (WIFSIGNALED(exit_status))
				throw std::runtime_error(strerror(WTERMSIG(exit_status)));
			else if (WIFSTOPPED(exit_status))
				throw std::runtime_error(strerror(WSTOPSIG(exit_status)));
			break;
	}
	if (::signal(SIGPIPE, SIG_DFL) == SIG_ERR) // reset the sighandler to his previous state
	{
		throw std::runtime_error(strerror(errno));
		return false;
	}
	return true;
}

void				CGIManager::_launchExec() const
{
	CGIEnviron::map_ss	env			= this->_environ.getEnv();
	std::string			abs_path	= env["SCRIPT_NAME"].substr(0, env["SCRIPT_NAME"].find_last_of("/"));
	std::string			script		= env["SCRIPT_NAME"].substr(env["SCRIPT_NAME"].find_last_of("/") + 1);
	std::string			boundary	= this->_environ.getBoundary();
	std::string			cgi_exec	= env["CGI_EXEC"];

	// if the cgi_exec does not exist or has not got the x rights -> exit
	if (::access(cgi_exec.c_str(), F_OK) == -1 || ::access(cgi_exec.c_str(), X_OK)  == -1)
	{
		exit(errno);
	}
	
	if (::chdir(abs_path.c_str()) == -1)
	{
		exit(errno);
	}

	if (boundary.size() > 0) // if there are a multipart Content Type so pass the boundary by argv as it remains unavailable for those that should not get this info by env.
	{
		if (::execl(cgi_exec.c_str(), cgi_exec.c_str(), script.c_str(), boundary.c_str(), NULL) == -1)
		{
			exit(errno);
		}
	}
	else
	{
		if (::execl(cgi_exec.c_str(), cgi_exec.c_str(), script.c_str(), NULL) == -1)
		{
			exit(errno);
		}
	}
	std::cerr << "\033[31;1m[CGI]: " << __FILE__ << " " << __LINE__ << " Cette phrase ne doit jamais etre visible\033[0m" << std::endl;
}
