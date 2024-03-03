#include "FragTrap.hpp"

/* --- Coplien ------------------------------------------------------------ */
FragTrap::FragTrap(std::string const &name, int const &hit, int const &nrg, int const &dmg) : ClapTrap(name, hit, nrg, dmg) {
	std::cout << *this	<< "have been constructed with default FragTrap constructor."	<< std::endl;
}

FragTrap::FragTrap(FragTrap const &src) : ClapTrap(src.getName(), src.getHitPoints(), src.getEnergyPoints(), src.getAttackDamage()) {
	std::cout << *this	<< "have been constructed with FragTrap copy constructor."	<< std::endl;
}

FragTrap::~FragTrap(void) {
	std::cout << *this	<< "have been destructed with FragTrap destructor."	<< std::endl;
}

FragTrap&		FragTrap::operator=(FragTrap const &src) {
	if (this != &src) {
		(*this) = src;
	}
	std::cout << *this	<< "have been assigned with FragTrap assignment operator."	<< std::endl;
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Others-------------------------------------------------------------- */
void			FragTrap::attack(const std::string& target) {
	if (this->isAlive()) {
		this->updateEnergyPoints(-1);
		std::cout	<< *this << "attacks "	<< target	<< ", causing "	<< this->getAttackDamage()
					<< " points of damage! It costs 1 energy point."	<< std::endl;
	}
}

void			FragTrap::highFiveGuys(void) {
	if (this->isAlive()) {
		std::cout	<< *this
					<< "would like you hit the keyboard for giving it a High Five : (Please, press the enter key when this is done)"
					<< std::endl;

		std::string	highFive;
		std::cin	>> highFive;
		std::cout	<< "Hey! HighFivesGuys you too mate!"	<< std::endl;
	}
}
/* --- Others-------------------------------------------------------------- */



/* --- Operators ---------------------------------------------------------- */
std::ostream &	operator<<(std::ostream & o, FragTrap const &st) {
	o	<< "[FragTrap] <"	<< st.getName()
		<< "> {"			<< st.getHitPoints()
		<< "; "				<< st.getEnergyPoints()
		<< "; "				<< st.getAttackDamage()
		<< "} ";
	return o;
}
/* --- Operators ---------------------------------------------------------- */
