#include "Zombie.hpp"

/* --- Zombie constr / destr ---------------------------------------------- */
Zombie::Zombie(void) : _name("default") {

	std::cout	<< "Zombie "	<< this->_name
				<< " is created."
				<< std::endl;
}

Zombie::Zombie(std::string & name) : _name(name) {

	std::cout	<< "Zombie "	<< this->_name
				<< " is created."
				<< std::endl;
}

Zombie::Zombie(Zombie const & zombie) : _name(zombie._name) {

	std::cout	<< "Zombie "	<< this->_name
				<< " is created."
				<< std::endl;
}

Zombie::~Zombie(void) {

	std::cout	<< "Zombie "	<< this->_name
				<< " is destructed."
				<< std::endl;
}
/* --- Zombie constr / destr ---------------------------------------------- */



/* --- Zombie others ------------------------------------------------------ */
void				Zombie::announce(void) const {
	std::cout	<< this->_name
				<< ": BraiiiiiiinnnzzzZ"
				<< std::endl;
}
/* --- Zombie others ------------------------------------------------------ */
