#include "Zombie.hpp"

int	main(void) {
	Zombie*	zombie1 = newZombie("petiteP**e");
	Zombie*	zombie2 = newZombie("grosseP**e");

	zombie1->announce();
	zombie2->announce();
	randomChump("Razmoket");
	randomChump("Lily");

	delete zombie1;
	delete zombie2;

	return 0;	
}
