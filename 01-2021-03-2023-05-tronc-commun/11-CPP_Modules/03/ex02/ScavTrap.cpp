#include "ScavTrap.hpp"

/* --- Coplien ------------------------------------------------------------ */
ScavTrap::ScavTrap(std::string const &name, int const &hit, int const &nrg, int const &dmg) : ClapTrap(name, hit, nrg, dmg) {
	std::cout << *this	<< "have been constructed with default ScavTrap constructor."	<< std::endl;
}

ScavTrap::ScavTrap(ScavTrap const &src) : ClapTrap(src.getName(), src.getHitPoints(), src.getEnergyPoints(), src.getAttackDamage()) {
	std::cout << *this	<< "have been constructed with ScavTrap copy constructor."	<< std::endl;
}

ScavTrap::~ScavTrap(void) {
	std::cout << *this	<< "have been destructed with ScavTrap destructor."	<< std::endl;
}

ScavTrap&		ScavTrap::operator=(ScavTrap const &src) {
	if (this != &src) {
		(*this) = src;
	}
	std::cout << *this	<< "have been assigned with ScavTrap assignment operator."	<< std::endl;
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Others-------------------------------------------------------------- */
void			ScavTrap::attack(const std::string& target) {
	if (this->isAlive()) {
		this->updateEnergyPoints(-1);
		std::cout	<< *this << "attacks "	<< target	<< ", causing "	<< this->getAttackDamage()
					<< " points of damage! It costs 1 energy point."	<< std::endl;
	}
}

void			ScavTrap::guardGate(void) {
	if (this->isAlive()) {
		std::cout	<< *this	<< "is now in Gate keeper mode"			<< std::endl;
	}
}
/* --- Others-------------------------------------------------------------- */



/* --- Operators ---------------------------------------------------------- */
std::ostream &	operator<<(std::ostream & o, ScavTrap const &st) {
	o	<< "[ScavTrap] <"	<< st.getName()
		<< "> {"			<< st.getHitPoints()
		<< "; "				<< st.getEnergyPoints()
		<< "; "				<< st.getAttackDamage()
		<< "} ";
	return o;
}
/* --- Operators ---------------------------------------------------------- */
