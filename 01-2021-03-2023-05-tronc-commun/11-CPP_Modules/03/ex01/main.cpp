#include <iostream>
#include "ClapTrap.hpp"
#include "ScavTrap.hpp"

int	main(void)
{
	ClapTrap	ct1("Razmo");
	ScavTrap	st1("Lily");

	while (ct1.isAlive() && st1.isAlive()) {
		ct1.attack(st1.getName());
		st1.takeDamage(ct1.getAttackDamage());
		st1.guardGate();
		st1.attack(ct1.getName());
		ct1.takeDamage(st1.getAttackDamage());
	}
	return 0;
}
