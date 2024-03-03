#include "AMateria.hpp"

AMateria* AMateria::*unequiped[4096] = {nullptr};
/* --- Coplien ------------------------------------------------------------ */
AMateria::AMateria(std::string const &type) : _type(type) {
	std::cout	<< "[AMateria] de type <"	<< this->getType()	<< "> générée par le constructeur par défaut."
				<< std::endl;
}

AMateria::AMateria(AMateria const &src) : _type(src.getType()) {
	std::cout	<< "[AMateria] de type <"	<< this->getType()	<< "> générée par le constructeur par recopie."
				<< std::endl;
}

AMateria::~AMateria(void) {
	std::cout	<< "[AMateria] de type <"	<< this->getType()	<< "> "	<< this	<< " détruite par le destructeur par défaut."
				<< std::endl;
}

AMateria&		AMateria::operator=(AMateria const &src) {
	if (this != &src) {
		this->setType(src.getType());
		(*this) = src;
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
std::string const&			AMateria::getType(void) const {
	return this->_type;
}

void						AMateria::setType(std::string const &type) {
	this->_type = type;
}
/* --- Getters / Setters -------------------------------------------------- */



/* --- Others ------------------------------------------------------------- */
void						AMateria::use(ICharacter& target) {
	(void)target;
	std::cout	<< "This is AMateria::use, you should not use it directly."
				<< std::endl;
}
/* --- Others ------------------------------------------------------------- */
