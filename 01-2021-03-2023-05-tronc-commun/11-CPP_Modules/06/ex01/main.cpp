#include <iostream>
#include "Data.hpp"
#include "function.hpp"

int	main(void)
{
	Data		d(42);
	uintptr_t	u;

	std::cout	<< "adresse data:\t"	<< &d	<< "\tsizeof(data): "	<< sizeof(d)	<< std::endl;
	u = serialize(&d);
	std::cout	<< "serialise:\t"	<< std::hex	<< std::showbase	<< u	<< std::endl;
	std::cout	<< "deserialize:\t"	<<	deserialize(u)	<< std::endl;
	return 0;
}
