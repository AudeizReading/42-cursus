#ifndef AMATERIA_HPP
# define AMATERIA_HPP
# include <iostream>
# include "ICharacter.hpp"

const size_t	MAX = 4;		 
class ICharacter;

class AMateria {
	protected:
		std::string	_type;
		
	public:
		AMateria(std::string const &type="amateria");
		AMateria(AMateria const &src);
		virtual ~AMateria(void);
		AMateria & operator=(AMateria const &src);

		std::string const &	getType(void) const;
		void				setType(std::string const &type);

		virtual AMateria*	clone(void) const = 0;
		virtual void		use(ICharacter& target);
};
#endif 
