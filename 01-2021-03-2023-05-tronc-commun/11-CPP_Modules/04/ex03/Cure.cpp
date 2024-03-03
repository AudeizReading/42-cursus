#include "Cure.hpp"

/* --- Coplien ------------------------------------------------------------ */
Cure::Cure(void) : AMateria("cure") {
	std::cout	<< "[Materia Cure] de type <"	<< this->getType()	<< "> générée par le constructeur par défaut."
				<< std::endl;
}

Cure::Cure(Cure const &src) : AMateria(src.getType()) {
	std::cout	<< "[Materia Cure] de type <"	<< this->getType()	<< "> générée par le constructeur par recopie."
				<< std::endl;
}

Cure::~Cure(void) {
	std::cout	<< "[Materia Cure] de type <"	<< this->getType()	<< "> détruite par le destructeur par défaut."
				<< std::endl;
}

Cure&		Cure::operator=(Cure const &src) {
	if (this != &src) {
		this->setType(src.getType());
		(*this) = src;
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Others ------------------------------------------------------------- */
AMateria*					Cure::clone(void) const {
	return (new Cure());
}

void						Cure::use(ICharacter& target) {
	std::cout	<< "* heals "	<< target.getName()	<< "'s wounds *"
				<< std::endl;
}
/* --- Others ------------------------------------------------------------- */
