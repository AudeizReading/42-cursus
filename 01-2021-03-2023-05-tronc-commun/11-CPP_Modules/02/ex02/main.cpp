#include "Fixed.hpp"
#include <iostream>

int	main(void)
{
	Fixed		a;
	Fixed const	b(10);
	Fixed const	c(42.42f);
	Fixed const	d(b);

	a = Fixed(1234.4321f);

	/* --- Original values ---------------------------------------------------- */
	std::cout	<< "\nWe are starting this simulation with the numbers: 10, 42.42f and 1234.4321f."
				<< std::endl;

	/* --- Test << ----------------------------------------------------------- */
	std::cout	<< "\na is "	<< a	<< std::endl;
	std::cout	<< "b is "		<< b	<< std::endl;
	std::cout	<< "c is "		<< c	<< std::endl;
	std::cout	<< "d is "		<< d	<< std::endl;

	/* --- Test toInt() ------------------------------------------------------ */
	std::cout	<< "\na is "	<< a.toInt()	<< " as integer"	<< std::endl;
	std::cout	<< "b is "		<< b.toInt()	<< " as integer"	<< std::endl;
	std::cout	<< "c is "		<< c.toInt()	<< " as integer"	<< std::endl;
	std::cout	<< "d is "		<< d.toInt()	<< " as integer"	<< std::endl;

	/* --- Test < <= >= > == != ----------------------------------------------- */
	if (a > b)		std::cout	<< "\na is greater than b"				<< std::endl;
	if (d >= b)		std::cout	<< "d is greater than or equal to b"	<< std::endl;
	if (b < c)		std::cout	<< "b is lesser than c"					<< std::endl;
	if (b <= d)		std::cout	<< "b is lesser than or equal to d"		<< std::endl;
	if (d == b)		std::cout	<< "d is equal to b"					<< std::endl;
	if (a != b)		std::cout	<< "a is not equal to b"				<< std::endl;

	/* --- Test + - * / ------------------------------------------------------- */
	Fixed	e = a + b + c;
	Fixed	f = c + d;

	std::cout	<< "\na + b + c = e: "				<< e	<< std::endl;
	std::cout	<< "c + d = f: "					<< f	<< std::endl;

	e = e - f;
	std::cout	<< "e = e - f: "					<< e	<< std::endl;
	e = b * d * c;
	std::cout	<< "e = b * d * c: "				<< e	<< std::endl;
	e = b / a * d * d;
	std::cout	<< "e = b / a * d * d: "			<< e	<< std::endl;
	e = b / a * d * d - b + a;
	std::cout	<< "e = b / a * d * d - b + a: "	<< e	<< std::endl;
	e = 4;
	std::cout	<< "e = 4 / 2: "					<< e / 2	<< std::endl;

	/* --- Test ++ -- --------------------------------------------------------- */
	Fixed	g = 0;

	std::cout	<< "\ng: "
				<< g
				<< std::endl;
	for (int i = 0; i < 5; i++) {
		std::cout	<< "pre incrementation g: "
					<< ++g
					<< std::endl;
	}
	for (int i = 0; i < 10; i++) {
		std::cout	<< "pre decrementation g: "
					<< --g
					<< std::endl;
	}
	for (int i = 0; i < 7; i++) {
		std::cout	<< "post incrementation g: "
					<< g++
					<< std::endl;
	}
	for (int i = 0; i < 10; i++) {
		std::cout	<< "post decrementation g: "
					<< g--
					<< std::endl;
	}

	/* --- Test min max-------------------------------------------------------- */
	std::cout	<< Fixed::min(e, f)	<< std::endl;
	std::cout	<< Fixed::min(a, b)	<< std::endl;
	std::cout	<< Fixed::max(e, f)	<< std::endl;
	std::cout	<< Fixed::max(a, b)	<< std::endl;

	return 0;
}
