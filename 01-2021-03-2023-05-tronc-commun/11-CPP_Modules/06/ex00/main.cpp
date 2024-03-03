#include <iostream>
#include <limits>
# include <stdexcept>
#include "Converter.hpp"

int	main(int argc, char **argv)
{
	try {
		if (argc == 2) {
			std::string	arg(argv[1]);
			Converter	c(arg);
			return 0;
		}
		else {
			throw Converter::InvalidArgument();
		}
	}
	catch (Converter::OutOfRange) {
		std:: cout	<< "char: impossible\n"
					<< "int: impossible\n"
					<< "float: nanf\n"
					<< "double: nan"
					<< std::endl;
	}
	catch (Converter::RangeError &e) {
	//catch (std::range_error &e) {
		(void)e;
		std::cerr	<< "Nan, mais les gars, on a dit un double max! Je ne sais pas ce que tu tentes, mais ça passera pas!"	<< std::endl;
	}
	catch (Converter::InvalidArgument) {
		std::cerr	<< "Error: invalid argument\n"
					<< "Usage: ./convert [arg to convert]"
					<< std::endl;
	}
	return 1;
}
