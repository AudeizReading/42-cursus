#ifndef MATERIASOURCE_HPP
# define MATERIASOURCE_HPP
# include <iostream>
# include "IMateriaSource.hpp"

class MateriaSource : public IMateriaSource {
	private:
		AMateria	*_wallet[MAX];
		
	public:
		MateriaSource(void);
		MateriaSource(MateriaSource const &src);
		virtual ~MateriaSource(void);
		MateriaSource & operator=(MateriaSource const &src);

		virtual void		learnMateria(AMateria* materia);
		virtual AMateria*	createMateria(std::string const & type);
};
#endif 
