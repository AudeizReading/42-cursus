#ifndef DOG_HPP
# define DOG_HPP
# include <iostream>
# include "Animal.hpp"
# include "Brain.hpp"

class Dog : public Animal {
	private:
		Brain *_brain;
		
	public:
		Dog(void);
		Dog(Dog const &src);
		~Dog(void);
		Dog & operator=(Dog const &src);

		virtual void			makeSound(void)	const;

		virtual void			displayBrain(void) const;
};
#endif 
