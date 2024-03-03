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

#include "webserv.hpp"

int	main(int argc, const char *argv[])  
{
	if (argc != 1 && argc != 2)
	{
		std::cout << argv[0] << ": invalid number of arguments" << std::endl;
		return 1;
	}
	try
	{
		return webserv(argv[1]);
	}
	catch(const std::exception& e)
	{
		std::cerr << BRED << "Webserv failed with error: " << e.what() << RESET << '\n';
		return (1);
	}
}
