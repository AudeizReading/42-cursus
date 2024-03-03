#include "Zombie.hpp"

Zombie* zombieHorde(int N, std::string name) {
	Zombie*	horde = new Zombie[N];

	if (N > 0) {
		for (int i = 0; i != N; i++) {
			horde[i] = Zombie(name);
		}
	} else {
		std::cerr	<< "Parameter N: "	<< N
					<< " is invalid"
					<< std::endl;
	}
	
	return	horde;
}
