#include <iostream>
#include <vector>
#include <list>
#include <deque>
#include "easyfind.hpp"

int	main(void)
{
	try {
		std::vector<int>	v(42, 42);

		std::cout	<< "searching for the value 42 inside a vector container: "	<< *easyfind(v, 42)	<< std::endl;
		std::cout	<< "searching for the value 27 inside a vector container: "	<< *easyfind(v, 27)	<< std::endl;
	}
	catch (std::exception &) {
		std::cerr	<< "The value is not found into the container\n"	<< std::endl;
	}

	try {
		std::list<int>		l(42, 42);

		std::cout	<< "searching for the value 42 inside a list container: "	<< *easyfind(l, 42)	<< std::endl;
		std::cout	<< "searching for the value 27 inside a list container: "	<< *easyfind(l, 27)	<< std::endl;
	}
	catch (std::exception &) {
		std::cerr	<< "The value is not found into the container\n"	<< std::endl;
	}

	try {
		std::deque<int>		d(42, 42);

		std::cout	<< "searching for the value 42 inside a deque container: "	<< *easyfind(d, 42)	<< std::endl;
		std::cout	<< "searching for the value 27 inside a deque container: "	<< *easyfind(d, 27)	<< std::endl;
	}
	catch (std::exception &) {
		std::cerr	<< "The value is not found into the container\n"	<< std::endl;
	}
	return 0;
}
