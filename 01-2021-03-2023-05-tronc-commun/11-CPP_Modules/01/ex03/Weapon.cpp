#include "Weapon.hpp"

/* --- Weapon constr / destr ---------------------------------------------- */
Weapon::Weapon(void) : _type("no one") {}

Weapon::Weapon(std::string const & type) : _type(type) {}

Weapon::Weapon(Weapon const &weapon) : _type(weapon._type) {}

Weapon::~Weapon(void) {}

/* --- Weapon constr / destr ---------------------------------------------- */



/* --- Weapon getter / setter --------------------------------------------- */
std::string const			&Weapon::getType(void) const {
	return this->_type;	
}

void					Weapon::setType(std::string const &type) {
	this->_type = type;
}
/* --- Weapon getter / setter --------------------------------------------- */
