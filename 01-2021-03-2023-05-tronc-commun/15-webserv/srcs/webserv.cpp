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

#include <webserv.hpp>
#include "Listener.hpp"

#include <csignal>
#include <iostream>
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

const t_map_ss	*g_mime_types = NULL;	// At least if we use a global, make it const

struct s_thread_init
{
	Listener		&listener;	// This thread's Listener
	pthread_cond_t	&condvar;	// Conditional variable to signal when thread terminates
	pthread_mutex_t	&mutex;		// Mutex of conditional variable
	bool			done;		// Has current thread copied all necessary pointers from this struct?

	s_thread_init(Listener& listener, pthread_cond_t& condvar, pthread_mutex_t& mutex)
		: listener(listener), condvar(condvar), mutex(mutex), done(false)
	{}
};

// NOTE: For some reason, keeping this code in allows the killing of each thread
// when pressing ctrl+C, whereas without it it doesn't. No idea why.
void signal_handler(int signal) // TESTME: Would sigaction be better ?
{
	(void) signal;
}

// NOTE: The p_thread_init pointer WILL be invalidated after this call. This is fine,
// because it only contains pointers to values that aren't invalidated.
/* static */ void	*init_thread(void *p_thread_init)
{
	struct s_thread_init	*thread_init = static_cast<s_thread_init*>(p_thread_init);
	Listener				&listener = thread_init->listener;
	pthread_cond_t			*condvar = &thread_init->condvar;
	pthread_mutex_t			*mutex = &thread_init->mutex;

	thread_init->done = true;	// We have all the pointers, the thread creating loop
	thread_init = NULL;			// can invalidate p_thread_init and thus thread_init
	p_thread_init = NULL;		// from now on.

	pthread_mutex_lock(mutex);
	pthread_cond_wait(condvar, mutex);	// Wait for signal to start from main thread
	pthread_mutex_unlock(mutex);

	try
	{
		listener.start_listener();
	}
	catch (std::exception const& e)
	{
		std::stringstream	err;
		err << _RED << "fatal: webserv terminated because " << e.what() << RESET << std::endl;
		std::cerr << err.str();
		pthread_cond_signal(condvar);
	}
	return (0);
}

static bool create_dico_mimetypes(TOML::Document config)
{
	if (!config.has("mime_types"))
	{
		std::cerr << "Error: add mime_types dico." << std::endl;
		return (false);
	}

	TOML::Document	conf = config.at("mime_types");

	t_map_ss	*new_mime_types = new t_map_ss();
	for (TOML::Document::iterator it = conf.begin(); it != conf.end(); ++it)
	{
		for (std::string::const_iterator ch = it->key().cbegin(); ch != it->key().cend(); ++ch)
			if (!(('a' <= *ch && *ch <= 'z') || ('A' <= *ch && *ch <= 'Z') || ('0' <= *ch && *ch <= '9')))
				throw std::runtime_error("[mime_types]: Invalid character for extension " + it->key());
		for (std::string::const_iterator ch = it->Str().cbegin(); ch != it->Str().cend(); ++ch)
			if (!(('a' <= *ch && *ch <= 'z') || ('A' <= *ch && *ch <= 'Z') || ('0' <= *ch && *ch <= '9')
				|| *ch == '-' || *ch == '_' || *ch == '/' || *ch == '.'))
				throw std::runtime_error("[mime_types]: Invalid character for mime_types value " + it->Str());
		new_mime_types->insert(std::pair<std::string, std::string>(it->key(), it->Str()));
	}
	g_mime_types = new_mime_types;
	return (true);
}

int	webserv(const char *config_file_path)
{
	std::signal(SIGINT, signal_handler);

	if (config_file_path == NULL)
		config_file_path = DEFAULT_CONFIG_FILE;
	TOML::Document	config = parse_config_file(config_file_path);

	if (!create_dico_mimetypes(config.at("http")))
		return (1);

	std::vector<Listener>	listeners = create_Listeners(config);
	std::vector<pthread_t>	threads;
	threads.reserve(listeners.size());

	pthread_mutex_t	*mutex = new pthread_mutex_t;	// Thread shared ressources should be on the heap
	pthread_cond_t	*condvar = new pthread_cond_t;
	if (pthread_mutex_init(mutex, NULL) != 0 || pthread_cond_init(condvar, NULL) != 0)
	{
		delete mutex;
		delete condvar;
		throw std::runtime_error("failed to initialize conditional variable or mutex");
	}

	unsigned int i = 0;
	for (std::vector<Listener>::iterator it = listeners.begin(); it != listeners.end(); ++it, ++i)
	{
		int				errnum;
		s_thread_init	thread_init(*it, *condvar, *mutex);

		if ((errnum = pthread_create(&threads[i], NULL, &init_thread, &thread_init)) < 0)
			throw std::runtime_error(std::string("Failed to launch thread :") + strerror(errnum));
		while (!thread_init.done)
			;
	}

	std::cout << CYNB << "All threads are initialized. Starting webserv..." << RESET << std::endl;
	pthread_cond_broadcast(condvar);	// Notify all threads, so they start their Listener
	pthread_mutex_lock(mutex);
	pthread_cond_wait(condvar, mutex);	// Sleeps indefinitely until a thread throws an exception.

	std::cout << REDB << "Webserv shutting down..." << RESET << std::endl;
	for (std::vector<pthread_t>::iterator it = threads.begin(); it != threads.end(); ++it)
	{
		pthread_kill(*it, SIGINT);
	}
	delete mutex;
	delete condvar;
	delete g_mime_types;

	return (1);
}
