#ifndef HUMANA_HPP
# define HUMANA_HPP
# include <iostream>
# include "Weapon.hpp"

class HumanA {
	private:
		std::string		_name;
		Weapon const &	_weapon;

	public:
		HumanA(void);
		HumanA(HumanA const & humanA);
		HumanA(std::string const & name, Weapon const & weapon);
		~HumanA(void);

		void	attack(void) const;
};
#endif
