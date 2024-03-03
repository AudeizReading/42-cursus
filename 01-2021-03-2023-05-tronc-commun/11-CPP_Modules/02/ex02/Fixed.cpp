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
		this->setRawBits(src.getRawBits());
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
int			Fixed::getRawBits(void) const {
	return this->_rawBits;
}

void		Fixed::setRawBits(int const raw) {
	this->_rawBits = raw;
}

int			Fixed::toInt(void) const {
	return this->getRawBits() >> Fixed::nbBits;
}

float		Fixed::toFloat(void) const {
	return ((float)this->getRawBits() / (float)(1 << Fixed::nbBits));
}
/* --- Getters / Setters -------------------------------------------------- */


/* --- Operators ---------------------------------------------------------- */
std::ostream &	operator<<(std::ostream &o, Fixed const &fixed) { // Output stream
	o	<< fixed.toFloat();
	return o;
}


/* --- Comparaisons ------------------------------------------------------- */
bool		Fixed::operator<(Fixed const & fp) const { // Lesser than
	if (this->getRawBits() < fp.getRawBits())
		return true;
	return false;
}

bool		Fixed::operator<=(Fixed const & fp) const { // Lesser or equal than
	if (this->getRawBits() <= fp.getRawBits())
		return true;
	return false;
}

bool		Fixed::operator>(Fixed const & fp) const { // Greater than
	if (this->getRawBits() > fp.getRawBits())
		return true;
	return false;
}

bool		Fixed::operator>=(Fixed const & fp) const { // Greater or equal than
	if (this->getRawBits() >= fp.getRawBits())
		return true;
	return false;
}

bool		Fixed::operator==(Fixed const & fp) const { // Equal
	if (this->getRawBits() == fp.getRawBits())
		return true;
	return false;
}

bool		Fixed::operator!=(Fixed const & fp) const { // Not equal
	if (this->getRawBits() != fp.getRawBits())
		return true;
	return false;
}


/* --- Arithmetics -------------------------------------------------------- */
Fixed		Fixed::operator+(Fixed const & fp) const { // Addition
	Fixed	res;

	res.setRawBits(this->getRawBits() + fp.getRawBits());
	return res;
}

Fixed		Fixed::operator-(Fixed const & fp) const { // Substraction
	Fixed	res;

	res.setRawBits(this->getRawBits() - fp.getRawBits());
	return res;
}

Fixed		Fixed::operator*(Fixed const & fp) const { // Multiplication
	Fixed	res;

	res.setRawBits(this->getRawBits() * fp.getRawBits() >> Fixed::nbBits);
	return res;
}

Fixed		Fixed::operator/(Fixed const & fp) const { // Division
	Fixed	res;

	res.setRawBits((this->getRawBits() << Fixed::nbBits) / fp.getRawBits());
	return res;
}


/* --- In / Decrementation ------------------------------------------------ */
Fixed &		Fixed::operator++(void) {
	this->setRawBits(this->getRawBits() + 1);
	return (*this);
}

Fixed 		Fixed::operator++(int x) {
	Fixed	tmp = *this;
	(void)x;
	++*this;
	return tmp;
}

Fixed &		Fixed::operator--(void) {
	this->setRawBits(this->getRawBits() - 1);
	return (*this);
}

Fixed 		Fixed::operator--(int x) {
	Fixed	tmp = *this;
	(void)x;
	--*this;
	return tmp;
}
/* --- Operators ---------------------------------------------------------- */



/* --- Others ------------------------------------------------------------- */
Fixed		Fixed::min(Fixed &a, Fixed &b) {
	return (a < b) ? a : b;
}

Fixed		Fixed::min(Fixed const &a, Fixed const &b) {
	return (a < b) ? a : b;
}

Fixed		Fixed::max(Fixed &a, Fixed &b) {
	return (a > b) ? a : b;
}

Fixed		Fixed::max(Fixed const &a, Fixed const &b) {
	return (a > b) ? a : b;
}
/* --- Others ------------------------------------------------------------- */
