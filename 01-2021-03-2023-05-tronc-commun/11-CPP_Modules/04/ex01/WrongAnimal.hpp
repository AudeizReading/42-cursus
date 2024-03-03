#ifndef WRONGANIMAL_HPP
# define WRONGANIMAL_HPP
# include <iostream>

class WrongAnimal {
	protected:
		std::string	_type;

	public:
		WrongAnimal(std::string const & name="WrongAnimal");
		WrongAnimal(WrongAnimal const &src);
		virtual ~WrongAnimal(void);
		WrongAnimal & operator=(WrongAnimal const &src);

		std::string		getType(void) const;

		virtual void	makeSound(void)	const;
};

std::ostream &					operator<<(std::ostream &o, WrongAnimal const &animal);
#endif 
