#include "Fixed.hpp"

const int	Fixed::nbBits = 8;

Fixed::Fixed(void) : _rawBits(0) {
	std::cout	<< "Default constructor called"	<< std::endl;
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

int			Fixed::getRawBits(void) const {
	std::cout	<< "getRawBits member function called"	<< std::endl;
	return this->_rawBits;
}

void		Fixed::setRawBits(int const raw) {
	this->_rawBits = raw;
}
