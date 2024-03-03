#include "ClapTrap.hpp"

/* --- Coplien ------------------------------------------------------------ */
ClapTrap::ClapTrap(std::string const &name, int const &hit, int const &nrg, int const &dmg) : _name(name), _hitPoints(hit), _energyPoints(nrg), _attackDamage(dmg) {
	std::cout << *this	<< "have been constructed with default ClapTrap constructor."	<< std::endl;
}

ClapTrap::ClapTrap(ClapTrap const &src) : _name(src.getName()), _hitPoints(src.getHitPoints()), _energyPoints(src.getEnergyPoints()), _attackDamage(src.getAttackDamage()) {
	std::cout << *this	<< "have been constructed with ClapTrap copy constructor."	<< std::endl;
}

ClapTrap::~ClapTrap(void) {
	std::cout << *this	<< "have been destructed with ClapTrap destructor."	<< std::endl;
}

ClapTrap&		ClapTrap::operator=(ClapTrap const &src) {
	if (this != &src) {
		(*this) = src;
	}
	std::cout << *this	<< "have been assigned with ClapTrap assignment operator."	<< std::endl;
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
std::string		ClapTrap::getName(void) const {
	return this->_name;
}

int				ClapTrap::getHitPoints(void) const{
	return this->_hitPoints;
}

int				ClapTrap::getEnergyPoints(void) const{
	return this->_energyPoints;
}

int				ClapTrap::getAttackDamage(void) const{
	return this->_attackDamage;
}

bool			ClapTrap::isAlive(void) const {
	int	hit = this->getHitPoints();
	int	nrg = this->getEnergyPoints();

	if (hit > 0 && nrg > 0 ) {
		std::cout	<< *this	<< "is alive."	<<std::endl;
		return true;
	}
	else if (hit <= 0) {
		std::cout	<< *this	<< "has no more hit points."	<<std::endl;
	}
	else if (nrg <= 0) {
		std::cout	<< *this	<< "has no more energy points."	<<std::endl;
	}
	return false;
}

void			ClapTrap::updateEnergyPoints(int const &point) {
	this->_energyPoints += point;
}

void			ClapTrap::updateHitPoints(int const &point) {
	this->_hitPoints += point;
}
/* --- Getters / Setters -------------------------------------------------- */



/* --- Others-------------------------------------------------------------- */
void			ClapTrap::attack(const std::string& target) {
	if (this->isAlive()) {
		this->updateEnergyPoints(-1);
		std::cout	<< *this << "attacks "	<< target	<< ", causing "	<< this->getAttackDamage()
					<< " points of damage! It costs 1 energy point."	<< std::endl;
	}
}

void			ClapTrap::takeDamage(unsigned int amount) {
	if (this->isAlive()) {
		this->updateHitPoints(-amount);
		std::cout	<< *this << "has taken "	<< amount	<< " life damage point"	<< std::endl;
	}
}

void			ClapTrap::beRepaired(unsigned int amount) {	
	if (this->isAlive()) {
		this->updateEnergyPoints(-1);
		this->updateHitPoints(amount);
		std::cout	<< *this << "has been repaired for "	<< amount	<< " hit points. It costs 1 energy point."	<< std::endl;
	}
}
/* --- Others-------------------------------------------------------------- */



/* --- Operators ---------------------------------------------------------- */
std::ostream &	operator<<(std::ostream & o, ClapTrap const &ct) {
	o	<< "[ClapTrap] <"	<< ct.getName()
		<< "> {"			<< ct.getHitPoints()
		<< "; "				<< ct.getEnergyPoints()
		<< "; "				<< ct.getAttackDamage()
		<< "} ";
	return o;
}
/* --- Operators ---------------------------------------------------------- */
