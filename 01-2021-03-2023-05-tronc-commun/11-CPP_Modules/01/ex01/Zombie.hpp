#ifndef ZOMBIE_HPP
# define ZOMBIE_HPP
# include <iostream>

class Zombie {

	private:
		std::string	_name;

	public:
		Zombie(void);
		Zombie(std::string & name);
		Zombie(Zombie const & zombie);
		~Zombie(void);

		void	announce(void) const;
};

Zombie*	zombieHorde(int N, std::string name);

#endif
