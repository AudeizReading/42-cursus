#ifndef ANIMAL_HPP
# define ANIMAL_HPP
# include <iostream>

class Animal {
	protected:
		std::string	_type;

	public:
		Animal(std::string const & name="Animal");
		Animal(Animal const &src);
		virtual ~Animal(void);
		Animal & operator=(Animal const &src);

		std::string		getType(void) const;

		virtual void	makeSound(void)	const;
};

std::ostream &					operator<<(std::ostream &o, Animal const &animal);
#endif 
