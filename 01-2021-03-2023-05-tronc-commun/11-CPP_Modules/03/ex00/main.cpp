#include <iostream>
#include "ClapTrap.hpp"

int	main(void)
{
	ClapTrap	ct1("Razmo");
	ClapTrap	ct2("Lily");
	ClapTrap	ct3;

	while (ct1.isAlive() && ct2.isAlive()) {
		ct1.attack(ct2.getName());
		ct2.takeDamage(ct1.getAttackDamage());
		ct2.attack(ct1.getName());
		ct1.takeDamage(ct2.getAttackDamage());
	}
	return 0;
}
