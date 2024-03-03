#ifndef HUMANB_HPP
# define HUMANB_HPP
# include <iostream>
# include "Weapon.hpp"

class HumanB {
	private:
		std::string		_name;
		Weapon const	*_weapon;

	public:
		HumanB(std::string const & name);
		~HumanB(void);

		void	setWeapon(Weapon const & weapon);
		void	attack(void) const;
};
#endif
