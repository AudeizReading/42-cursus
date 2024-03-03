#include <iostream>
#include "ClapTrap.hpp"
#include "ScavTrap.hpp"
#include "FragTrap.hpp"
#include "DiamondTrap.hpp"

int	main(void)
{
	DiamondTrap	dt1("Lily");
	DiamondTrap	ct1("Razmo");

	while (ct1.isAlive() && dt1.isAlive()) {
		ct1.attack(dt1.getName());
		dt1.takeDamage(ct1.getAttackDamage());
		dt1.guardGate();
		dt1.highFiveGuys();
		dt1.attack(ct1.getName());
		ct1.takeDamage(dt1.getAttackDamage());
		ct1.guardGate();
		ct1.highFiveGuys();
	}
	return 0;
}
