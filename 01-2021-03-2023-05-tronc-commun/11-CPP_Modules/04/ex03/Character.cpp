#include "Character.hpp"

/* --- Coplien ------------------------------------------------------------ */
Character::Character(std::string const &name) : _name(new std::string(name)) {
	std::cout	<< "[Character] <"	<< this->getName()	<< "> est généré par le constructeur par défaut"
				<< std::endl;
	for (size_t i = 0; i != MAX; i++) {
		this->_inventory[i] = nullptr;
		std::cout	<< "inventaire n°"	<< i	<< " initialisé à nul"
					<< std::endl;
	}
}

Character::Character(Character const &src) : _name(new std::string(src.getName())) {
	std::cout	<< "[Character] <"	<< this->getName()	<< "> est généré par le constructeur par recopie"
				<< std::endl;
	for (size_t i = 0; i != MAX; i++) {
		std::cout	<< "inventaire n°"	<< i << " est initialisé à: ";
		if (src._inventory[i]) {
			this->_inventory[i] = src._inventory[i]->clone();
			std::cout	<< this->_inventory[i]->getType()	<< std::endl;
		}
		else {
			this->_inventory[i] = nullptr;
			std::cout	<< "nul"	<< std::endl;
		}
	}
}

Character::~Character(void) {
	std::cout	<< "[Character] <"	<< this->getName()	<< "> est détruit par le destructeur par défaut"
				<< std::endl;
	delete this->_name;
	for (size_t i = 0; i != MAX; i++) {
		std::cout	<< "inventaire n°"	<< i;
		if (this->_inventory[i]) {
			std::cout	<< " <"	<< this->_inventory[i]->getType()	<< "> "	<< this->_inventory[i]	<< " est détruit"	<< std::endl;
			delete this->_inventory[i];
		}
		else {
			std::cout	<< " inutilisé; il n'y a rien à détruire"	<<std::endl;
		}
		std::cout	<< std::endl;
	}
}

Character&		Character::operator=(Character const &src) {
	if (this != &src) {
		this->setName(src.getName());
		for (size_t i = 0; i != MAX; i++) {
			if (this->_inventory[i])
				delete this->_inventory[i];
			this->_inventory[i] = src._inventory[i]->clone();
		}
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
std::string const&		Character::getName(void) const {
	return *this->_name;
}

void					Character::setName(std::string const &name) {
	if (this->_name)
		delete this->_name;
	this->_name = new std::string(name);
}

void					Character::equip(AMateria* m) {
	for (size_t i = 0; i != MAX; i++) {
		if (!this->_inventory[i]) {
			this->_inventory[i] = m;
			std::cout	<< __func__ << " adresse Materia: "	<< this->_inventory[i]
						<< std::endl;
			return ;
		}
	}
	std::cout	<< "[Character] <"	<< this->getName()	<< "> hasn't got anymore place into the inventory. Please unequip it before equiping it"
				<< std::endl;
}

void					Character::unequip(int idx) {
	size_t	newIdx = idx;

	if (newIdx < MAX && this->_inventory[newIdx]) {
		std::cout	<< __func__ << " adresse Materia: "	<< this->_inventory[newIdx]
					<< std::endl;
		this->_inventory[idx] = nullptr;
	}
	else {
	std::cout	<< "[Character] <"	<< this->getName()	<< "> Cannot unequip this index "	<< idx	<<" because it does not exist."
				<< std::endl;
	}
}
/* --- Getters / Setters -------------------------------------------------- */



/* --- Others ------------------------------------------------------------- */
void					Character::use(int idx, ICharacter& target) {
	size_t	newIdx = idx;
	if (newIdx < MAX && this->_inventory[newIdx])
		this->_inventory[idx]->use(target);
	else
		std::cout	<< __func__	<<" [Character] Inventory : Wrong index. Cannot use any materia at this index"
					<< std::endl;
}
/* --- Others ------------------------------------------------------------- */
