#include <iostream>
#include <iomanip>
#include <string>

std::string		getToUpper(std::string str)
{
	for (std::string::iterator it = str.begin(); it != str.end(); it++)
		*it = std::toupper(*it);	

	return str;
}

int	main(int argc, char **argv)
{
	std::string		noise;

	if (argc > 1)
	{
		for (int i = 0; ++i < argc;)
		{
			std::string		arg(argv[i]);

			noise += getToUpper(arg);
		}
	}
	else
		noise = "* LOUD AND UNBEARABLE FEEDBACK NOISE *";

	std::cout	<< noise
				<< std::endl;

	return (0);
}
