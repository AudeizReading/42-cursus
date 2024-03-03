#ifndef CHARACTER_HPP
# define CHARACTER_HPP
# include <iostream>
# include "AMateria.hpp"
# include "ICharacter.hpp"

//const size_t	MAX = 4;		 

class Character : public ICharacter {
	private:
		std::string			*_name;
		AMateria			*_inventory[MAX];

	public:
		Character(std::string const &name="Unknown Soldier");
		Character(Character const &src);
		~Character(void);
		Character & operator=(Character const &src);

		virtual std::string const&	getName(void) const;
		virtual void				setName(std::string const &name);
		virtual void				equip(AMateria* m);
		virtual void				unequip(int idx);
		virtual void				use(int idx, ICharacter& target);
};
#endif 
