#ifndef FRAGTRAP_HPP
# define FRAGTRAP_HPP
# include <iostream>
# include "ClapTrap.hpp"

class FragTrap: public ClapTrap {
	private:
	public:
		FragTrap(std::string const &name = "Default FragTrap", int const &hit = 100, int const &nrg = 100, int const &dmg = 30);
		FragTrap(FragTrap const &src);
		~FragTrap(void);
		FragTrap & operator=(FragTrap const &src);

		void		attack(const std::string& target);
		void		highFiveGuys(void);
};

std::ostream &		operator<<(std::ostream & o, FragTrap const &st);
#endif 
