#include "Ice.hpp"

/* --- Coplien ------------------------------------------------------------ */
Ice::Ice(void) : AMateria("ice") {
	std::cout	<< "[Materia Ice] de type <"	<< this->getType()	<< "> générée par le constructeur par défaut."
				<< std::endl;
}

Ice::Ice(Ice const &src) : AMateria(src.getType()) {
	std::cout	<< "[Materia Ice] de type <"	<< this->getType()	<< "> générée par le constructeur par recopie."
				<< std::endl;
}

Ice::~Ice(void) {
	std::cout	<< "[Materia Ice] de type <"	<< this->getType()	<< "> détruite par le destructeur par défaut."
				<< std::endl;
}

Ice&		Ice::operator=(Ice const &src) {
	if (this != &src) {
		this->setType(src.getType());
		(*this) = src;
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Others ------------------------------------------------------------- */
AMateria*					Ice::clone(void) const {
	return (new Ice());
}

void						Ice::use(ICharacter& target) {
	std::cout	<< "* shoots an ice bolt at "	<< target.getName()	<< " *"
				<< std::endl;
}
/* --- Others ------------------------------------------------------------- */
