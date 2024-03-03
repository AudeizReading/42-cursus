#include "Fixed.hpp"

const int	Fixed::nbBits = 8;

/* --- Coplien ------------------------------------------------------------ */
Fixed::Fixed(void) : _rawBits(0) {
	std::cout	<< "Default constructor called"	<< std::endl;
}

Fixed::Fixed(int const &i) : _rawBits(i << Fixed::nbBits) {
	std::cout	<< "Int constructor called"	<< std::endl;
}

Fixed::Fixed(float const &f) : _rawBits(round(f * (1 << Fixed::nbBits))) {
	std::cout	<< "Float constructor called"	<< std::endl;
}

Fixed::Fixed(Fixed const &src) : _rawBits(src._rawBits) {
	std::cout	<< "Copy constructor called"	<< std::endl;
}

Fixed::~Fixed(void) {
	std::cout	<< "Destructor called"	<< std::endl;
}

Fixed&		Fixed::operator=(Fixed const &src) {
	std::cout	<< "Copy assignement operator called"	<< std::endl;
	if (this != &src) {
		(this->_rawBits) = src._rawBits;
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
int			Fixed::getRawBits(void) const {
	std::cout	<< "getRawBits member function called"	<< std::endl;
	return this->_rawBits;
}

void		Fixed::setRawBits(int const raw) {
	this->_rawBits = raw;
}

int			Fixed::toInt(void) const {
	return this->_rawBits >> Fixed::nbBits;
}

float		Fixed::toFloat(void) const {
	return ((float)this->_rawBits / (float)(1 << Fixed::nbBits));
}
/* --- Getters / Setters -------------------------------------------------- */


/* --- Operators ---------------------------------------------------------- */
std::ostream &	operator<<(std::ostream &o, Fixed const &fixed) {
	o	<< fixed.toFloat();
	return o;
}
/* --- Operators ---------------------------------------------------------- */
