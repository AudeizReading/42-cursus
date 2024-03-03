#include "Converter.hpp"

Converter::Converter(std::string const &arg) : _arg(arg), _value(0) {
	this->convert();
}

Converter::Converter(Converter const &src) {
	(*this) = src;
}

Converter::~Converter(void) {
}

Converter&		Converter::operator=(Converter const &src) {
	if (this != &src) {
		(*this) = src;
	}
	return (*this);
}

void			Converter::convert(void) {
	char					*endptr;
	double					convert = std::strtod(this->_arg.c_str(), &endptr);

	this->_value = convert;
	if (!this->_arg.compare("nanf") || !this->_arg.compare("nan"))
		throw Converter::OutOfRange();
	if (endptr && *endptr) {
		if (*endptr == 'f' && std::strlen(endptr) == 1 && convert) {
			this->setFloatValue(convert);
			this->printFloatCasts();
		}
		else if (*endptr && std::strlen(endptr) <= 2) {
			if (*endptr != '\\')
				this->setCharValue(*endptr);
			else {
				this->setSpecialCharValue(*(endptr + 1));
			}
			this->printCharCasts();
		}
		else {
			throw Converter::OutOfRange();
		}
	}
	else {
		if (std::numeric_limits<int>::min() > convert || std::numeric_limits<int>::max() < convert || this->_arg.find('.') != std::string::npos) {
			this->setDoubleValue(convert);
			this->printDoubleCasts();
		}
		else
		{
			this->setIntValue(convert);
			this->printIntCasts();
		}
	}
}

char			Converter::getCharValue(void) const {
	return this->_char;
}

int			Converter::getIntValue(void) const {
	return this->_int;
}

float			Converter::getFloatValue(void) const {
	return this->_float;
}

double			Converter::getDoubleValue(void) const {
	return this->_double;
}

void			Converter::setCharValue(char const &c) {
	this->_char = static_cast<char>(c);
}

void			Converter::setSpecialCharValue(char const &special) {
	char	c;
	switch (special) {
		case 'n':
			c = static_cast<char>('\n');
			break;
		case 'r':
			c = static_cast<char>('\r');
			break;
		case 't':
			c = static_cast<char>('\t');
			break;
		case 'v':
			c = static_cast<char>('\v');
			break;
		case 'b':
			c = static_cast<char>('\b');
			break;
		case 'a':
			c = static_cast<char>('\a');
			break;
		case 0:
		default:
			c = static_cast<char>('\0');
			break;
	}
	this->setCharValue(c);
}

void			Converter::setIntValue(double const &value) {
	this->_int = static_cast<int>(value);
}

void			Converter::setFloatValue(double const &value) {
	this->_float = static_cast<float>(value);
}

void			Converter::setDoubleValue(double const &value) {
	this->_double = static_cast<double>(value);
}

void			Converter::printChar(char const &c) const {
	if (std::isprint(c))
		std::cout	<< "char: "	<< c	<< std::endl;
	else
		std::cout	<< "char: Non displayable"	<< std::endl;
}

void			Converter::printCharCasts(void) const {
	char	value = this->getCharValue();

	printChar(static_cast<char>(value));
	std::cout	<< "int: "		<< static_cast<int>(value)	<< std::endl;
	std::cout	<< "float: "	<< static_cast<float>(value)	<< ".0f"	<< std::endl;
	std::cout	<< "double: "	<< static_cast<double>(value)	<< ".0"		<< std::endl;
}

void			Converter::printIntCasts(void) const {
	int		value = this->getIntValue();

	if (std::numeric_limits<char>::min() > value || std::numeric_limits<char>::max() < value)
		std::cout	<< "char: impossible -> [Over|Under]flow"	<< std::endl;
	else
		printChar(static_cast<char>(value));
	if (!this->isIntPrintable())
		std::cout	<< "int: impossible -> [Over|Under]flow"	<< std::endl;
	else
		std::cout	<< "int: "		<< static_cast<int>(value)	<< std::endl;
	std::cout	<< "float: "	<< static_cast<float>(value)	<< ".0f"	<< std::endl;
	std::cout	<< "double: "	<< static_cast<double>(value)	<< ".0"		<< std::endl;
}

void			Converter::printFloatCasts(void) const {
	float		value = this->getFloatValue();

	if (std::numeric_limits<char>::min() > value || std::numeric_limits<char>::max() < value)
		std::cout	<< "char: impossible -> [Over|Under]flow"	<< std::endl;
	else
		printChar(static_cast<char>(value));
	if (!this->isIntPrintable())
		std::cout	<< "int: impossible -> [Over|Under]flow"	<< std::endl;
	else
		std::cout	<< "int: "		<< static_cast<int>(value)	<< std::endl;

	if (!this->isFloatPrintable()) {
		std::cout	<< "float: impossible -> [Over|Under]flow"	<< std::endl;
	}
	else if (this->hasDecimalPoint() || value == std::numeric_limits<float>::infinity() || value <= -std::numeric_limits<float>::infinity() || value / 1000000 > 1) {
		std::cout	<< "float: "		<< static_cast<float>(value)	<< "f"	<< std::endl;
	}
	else {
		std::cout	<< "on cherche: "	<< value / 1000000	<< std::endl;
		std::cout	<< "float: "		<< static_cast<float>(value)	<< ".0f"	<< std::endl;
	}
	if (this->hasDecimalPoint() || value == std::numeric_limits<double>::infinity() || value <= -std::numeric_limits<double>::infinity() || value / 1000000 > 1) {
		std::cout	<< "double: "		<< static_cast<double>(value)	<< std::endl;
	}
	else {
		std::cout	<< "double: "		<< static_cast<double>(value)	<< ".0"		<< std::endl;
	}
}

void			Converter::printDoubleCasts(void) const {
	double		value = this->getDoubleValue();

	if (std::numeric_limits<char>::min() > value || std::numeric_limits<char>::max() < value)
		std::cout	<< "char: impossible -> [Over|Under]flow"	<< std::endl;
	else
		printChar(static_cast<char>(value));
	if (!this->isIntPrintable())
		std::cout	<< "int: impossible -> [Over|Under]flow"	<< std::endl;
	else
		std::cout	<< "int: "		<< static_cast<int>(value)	<< std::endl;

	if (!this->isFloatPrintable()) {
		std::cout	<< "float: impossible -> [Over|Under]flow"	<< std::endl;
	}
	else if (this->hasDecimalPoint() || value == std::numeric_limits<float>::infinity() || value <= -std::numeric_limits<float>::infinity() || value / 1000000 > 1) {
		std::cout	<< "float: "		<< static_cast<float>(value)	<< "f"	<< std::endl;
	}
	else {
		std::cout	<< "float: "		<< static_cast<float>(value)	<< ".0f"	<< std::endl;
	}
	if (this->hasDecimalPoint() || value == std::numeric_limits<double>::infinity() || value <= -std::numeric_limits<double>::infinity() || value / 1000000 > 1) {
		std::cout	<< "double: "		<< static_cast<double>(value)	<< std::endl;
	}
	else {
		std::cout	<< "double: "		<< static_cast<double>(value)	<< ".0"		<< std::endl;
	}
}

bool				Converter::isIntPrintable(void) const {
	double	value = this->_value;

	if (std::numeric_limits<int>::min() <= value && std::numeric_limits<int>::max() >= value)
		return true;
	return false;
}

bool				Converter::isFloatPrintable(void) const {
	double	value = this->_value;

	if (-std::numeric_limits<float>::infinity() <= value && std::numeric_limits<float>::infinity() >= value)
		return true;
	return false;
}

bool				Converter::hasSevenDigitsOrMore(void) const {
	double	value = this->_value;

	if (value / 1000000 > 1)
		return true;
	return false;
}

bool				Converter::hasDecimalPoint(void) const {
	double	value = this->_value;

	if (value - floor(value) > 0.0)
		return true;
	return false;
}
