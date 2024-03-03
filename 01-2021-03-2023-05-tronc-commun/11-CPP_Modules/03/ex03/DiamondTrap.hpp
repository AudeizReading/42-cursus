#ifndef DIAMONDTRAP_HPP
# define DIAMONDTRAP_HPP
# include <iostream>
# include "ClapTrap.hpp"
# include "ScavTrap.hpp"
# include "FragTrap.hpp"

class DiamondTrap : public ScavTrap, public FragTrap {
	private:
		std::string	_name;
	public:
		DiamondTrap(std::string const &name = "Default DiamondTrap", int const &hit = 100, int const &nrg = 50, int const &dmg = 30);
		DiamondTrap(DiamondTrap const &src);
		~DiamondTrap(void);
		DiamondTrap & operator=(DiamondTrap const &src);

		std::string		getName(void) const;

		void			attack(const std::string& target);
		void			whoAmI(void);
};

std::ostream &		operator<<(std::ostream & o, DiamondTrap const &dt);
#endif 
