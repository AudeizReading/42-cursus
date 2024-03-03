#ifndef CURE_HPP
# define CURE_HPP
# include <iostream>
# include "AMateria.hpp"

class Cure : public AMateria {
	private:
	public:
		Cure(void);
		Cure(Cure const &src);
		~Cure(void);
		Cure & operator=(Cure const &src);

		virtual AMateria*	clone(void) const;
		virtual void		use(ICharacter& target);
};
#endif 
