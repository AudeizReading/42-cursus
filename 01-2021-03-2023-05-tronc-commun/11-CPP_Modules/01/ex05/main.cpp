#include <iostream>
#include "Karen.hpp"

int	main(int argc, char **argv)
{
	if (argc == 2)
	{
		Karen		karen;
		std::string	level(argv[1]);

		if (!level.compare("DEBUG") || !level.compare("INFO") || !level.compare("WARNING") || !level.compare("ERROR"))
			karen.complain(level);
		else
		{
			std::cout	<< "How could Karen complain, if you are not giving her an argument for?"
				<< std::endl;
			return 1;
		}
	}
	else
	{
		std::cout	<< "How could Karen complain, if you are not giving her an argument for?"
					<< std::endl;
		return 1;
	}
	return 0;
}
