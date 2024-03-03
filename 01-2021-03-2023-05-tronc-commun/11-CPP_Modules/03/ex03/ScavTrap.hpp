#ifndef SCAVTRAP_HPP
# define SCAVTRAP_HPP
# include <iostream>
# include "ClapTrap.hpp"

class ScavTrap: public virtual ClapTrap {
	private:
	public:
		ScavTrap(std::string const &name = "Default ScavTrap", int const &hit = 100, int const &nrg = 50, int const &dmg = 20);
		ScavTrap(ScavTrap const &src);
		~ScavTrap(void);
		ScavTrap & operator=(ScavTrap const &src);

		void		attack(const std::string& target);
		void		guardGate(void);
};

std::ostream &		operator<<(std::ostream & o, ScavTrap const &st);
#endif 
