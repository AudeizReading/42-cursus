#include "Zombie.hpp"

int	const	nbZombies = 7;

int	main(void) {
	Zombie	*horde = zombieHorde(nbZombies, "Dudule");
	
	for (int i = 0; i != nbZombies; i++) {
		horde[i].announce();	
	}
	delete [] horde;
	return 0;	
}
