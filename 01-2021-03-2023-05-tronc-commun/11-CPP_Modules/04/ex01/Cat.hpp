#ifndef CAT_HPP
# define CAT_HPP
# include <iostream>
# include "Animal.hpp"
# include "Brain.hpp"

class Cat : public Animal {
	private:
		Brain *_brain;
		
	public:
		Cat(void);
		Cat(Cat const &src);
		~Cat(void);
		Cat & operator=(Cat const &src);

		virtual void			makeSound(void)	const;

		virtual void			displayBrain(void) const;
};
#endif 
