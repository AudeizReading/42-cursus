#include "Data.hpp"

Data::Data(uintptr_t val) : value(val) {
	std::cout	<< "Data value: "	<< this->value	<< std::endl;
}

Data::Data(Data const &src) {
	(*this) = src;
}

Data::~Data(void) {
}

Data&		Data::operator=(Data const &src) {
	if (this != &src) {
		(*this) = src;
	}
	return (*this);
}
