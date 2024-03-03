#include "MateriaSource.hpp"

/* --- Coplien ------------------------------------------------------------ */
MateriaSource::MateriaSource(void) {
	std::cout	<< __func__	<<	" générée par le constructeur par défaut"
				<< std::endl;
	for (size_t i = 0; i != MAX; i++) {
		std::cout	<< "Wallet "	<< i	<< " initialisé à nul"
		         	<< std::endl;
		this->_wallet[i] = nullptr;
	}
}

MateriaSource::MateriaSource(MateriaSource const &src) {
	std::cout	<< __func__	<<	" générée par le constructeur par recopie"
				<< std::endl;
	for (size_t i = 0; i != MAX; i++) {
		std::cout	<< "Wallet "	<< i	<< " initialisé à ";
		if (src._wallet[i]) {
			this->_wallet[i] = src._wallet[i]->clone();
			std::cout	<< "[AMateria] de type <"	<< this->_wallet[i]->getType()	<< "> par le constructeur par recopie";
		}
		else {
			std::cout	<< "nul";
			this->_wallet[i] = nullptr;
		}
		std::cout	<< std::endl;
	}
}

MateriaSource::~MateriaSource(void) {
	std::cout	<< __func__	<<	" détruite par le destructeur par défaut"
				<< std::endl;
	for (size_t i = 0; i != MAX; i++) {
		if (this->_wallet[i]) {
			std::cout	<< "[AMateria] de type <"	<< this->_wallet[i]->getType()	<< "> détruite par le destructeur par défaut";
			delete this->_wallet[i];
			std::cout	<< std::endl;
		}
	}
}

MateriaSource&		MateriaSource::operator=(MateriaSource const &src) {
	if (this != &src) {
		for (size_t i = 0; i != MAX; i++) {
			if (this->_wallet[i])
				delete this->_wallet[i];
			this->_wallet[i] = src._wallet[i]->clone();
		}
		(*this) = src;
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Others ------------------------------------------------------------- */
void				MateriaSource::learnMateria(AMateria *materia) {
	for (size_t i = 0; i != MAX; i++) {
		if (!this->_wallet[i]) {
			this->_wallet[i] = materia;
			return ;
		}
	}
	std::cout	<< "There is no more place for learning a new Materia"	<< std::endl;
}

AMateria*			MateriaSource::createMateria(std::string const & type) {
	for (size_t i = 0; i != MAX; i++) {
		if (!type.compare(this->_wallet[i]->getType()))
			return this->_wallet[i]->clone();
	}
	return nullptr;
}
/* --- Others ------------------------------------------------------------- */
