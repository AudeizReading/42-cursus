#include "HumanA.hpp"

HumanA::HumanA(void) : _name("default"), _weapon(*(new Weapon())) {}
HumanA::HumanA(std::string const & name, Weapon const & weapon) : _name(name), _weapon(weapon) {}

HumanA::HumanA(HumanA const &humanA) : _name(humanA._name), _weapon(humanA._weapon) {}

HumanA::~HumanA(void) {}

void			HumanA::attack(void) const {
	std::cout	<< this->_name
				<< " attacks with their "	<< this->_weapon.getType()
				<< std::endl;
}
