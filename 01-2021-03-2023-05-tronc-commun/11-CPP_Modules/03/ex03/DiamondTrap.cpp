#include "DiamondTrap.hpp"

/* --- Coplien ------------------------------------------------------------ */
DiamondTrap::DiamondTrap(std::string const &name, int const &hit, int const &nrg, int const &dmg) : ClapTrap(name, hit, nrg, dmg),_name(name) {
	this->whoAmI();
	std::cout	<< "have been constructed with default DiamondTrap constructor."	<< std::endl;
}

DiamondTrap::DiamondTrap(DiamondTrap const &src) : ClapTrap(src.ClapTrap::_name, src.FragTrap::_hitPoints, src.ScavTrap::_energyPoints, src.FragTrap::_attackDamage), _name(src._name) {
	this->whoAmI();
	std::cout	<< "have been constructed with DiamondTrap copy constructor."	<< std::endl;
}

DiamondTrap::~DiamondTrap(void) {
	this->whoAmI();
	std::cout	<< "have been destructed with DiamondTrap destructor."	<< std::endl;
}

DiamondTrap&		DiamondTrap::operator=(DiamondTrap const &src) {
	if (this != &src) {
		(*this) = src;
	}
	this->whoAmI();
	std::cout	<< "have been assigned with DiamondTrap assignment operator."	<< std::endl;
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
std::string		DiamondTrap::getName(void) const {
	return this->_name;
}
/* --- Getters / Setters -------------------------------------------------- */



/* --- Others-------------------------------------------------------------- */
void			DiamondTrap::attack(const std::string& target) {
	this->whoAmI();
	std::cout	<< std::endl;
	ScavTrap::attack(target);
}

void			DiamondTrap::whoAmI(void) {
	std::cout	<< *this;
}
/* --- Others-------------------------------------------------------------- */



/* --- Operators ---------------------------------------------------------- */
std::ostream &	operator<<(std::ostream & o, DiamondTrap const &dt) {
	o	<< "[DiamondTrap] <"	<< dt.getName()
		<< "> (ClapTrap Name: "	<< dt.ClapTrap::getName()
		<< ") {"				<< dt.getHitPoints()
		<< "; "					<< dt.getEnergyPoints()
		<< "; "					<< dt.getAttackDamage()
		<< "} ";
	return o;
}
/* --- Operators ---------------------------------------------------------- */
