#include <iostream>
#include <limits>
#include <algorithm>
#include <vector>
#include "Span.hpp"

int	getRandomInt(void) {
	return rand() % std::numeric_limits<int>::max();
}

void	test1(void) {
	Span	span(2500000);

	std::cout	<< "test1: "	<< std::endl;
	try {
		span.addNumber(777);
		std::vector<int>	v(1000000);
		std::srand(std::time(NULL));
		std::generate(v.begin(), v.end(), getRandomInt);
		span.addRangeNumber(v.begin(), v.end());

		span.getInfos();
	}
	catch (std::exception &e) {
		std::cout << e.what()	<< ": trying to add a number out of limit of Span"	<< std::endl;
		span.getInfos();
	}
	std::cout	<< "................................................................."	<< std::endl;
}

void	test2(void) {
	Span	span(57);

	std::cout	<< "test2: "	<< std::endl;
	try {
		span.shortestSpan();
	}
	catch (std::exception &e) {
		std::cout << e.what()	<< ": trying to know what is the shortest distance, but Span has not got the required size for"	<< std::endl;
		span.getInfos();
	}

	try {
		span.addNumber(777);
		span.longestSpan();
	}
	catch (std::exception &e) {
		std::cout << e.what()	<< ": trying to know what is the longest distance, but Span has not got the required size for"	<< std::endl;
		span.getInfos();
	}
	std::cout	<< "................................................................."	<< std::endl;
}

void	test3(void) {
	Span	span;

	std::cout	<< "test3: "	<< std::endl;
	try {
		span.addNumber(777);
		span.getInfos();
	}
	catch (std::exception &e) {
		std::cout << e.what()	<< ": trying to add a number out of limit of Span"	<< std::endl;
		span.getInfos();
	}

	try {
		std::vector<int>	v(150000);
		std::srand(std::time(NULL));
		std::generate(v.begin(), v.end(), getRandomInt);
		span.addRangeNumber(v.begin(), v.end());

		span.getInfos();
	}
	catch (std::exception &e) {
		std::cout << e.what()	<< ": trying to add a number out of limit of Span"	<< std::endl;
		span.getInfos();
	}
	std::cout	<< "................................................................."	<< std::endl;
}

void	test42(void) {
	Span	sp = Span(5);

	std::cout	<< "test42: "	<< std::endl;
	sp.addNumber(6);
	sp.addNumber(3);
	sp.addNumber(17);
	sp.addNumber(9);
	sp.addNumber(11);

	std::cout	<< sp.shortestSpan()	<< std::endl;
	std::cout	<< sp.longestSpan()	<< std::endl;
	std::cout	<< "................................................................."	<< std::endl;
}

int	main(void)
{
	test1();
	test2();
	test3();
	test42();
	return 0;
}
