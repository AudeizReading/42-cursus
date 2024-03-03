#include <iostream>
#include "ClapTrap.hpp"
#include "FragTrap.hpp"

int	main(void)
{
	ClapTrap	ct1("Razmo");
	FragTrap	ft1("Lily");

	while (ct1.isAlive() && ft1.isAlive()) {
		ct1.attack(ft1.getName());
		ft1.takeDamage(ct1.getAttackDamage());
		ft1.highFiveGuys();
		ft1.attack(ct1.getName());
		ct1.takeDamage(ft1.getAttackDamage());
	}
	return 0;
}
