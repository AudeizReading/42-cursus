#include <iostream>
#include "Animal.hpp"
#include "WrongAnimal.hpp"
#include "Cat.hpp"
#include "WrongCat.hpp"
#include "Dog.hpp"

int	main(void)
{
	const Animal	*meta = new Animal();
	const Animal	*j = new Dog();
	const Animal	*i = new Cat();

	const WrongAnimal	*zeta = new WrongAnimal();
	const WrongAnimal	*k = new WrongCat();

	std::cout	<< *meta	<< std::endl;
	std::cout	<< *j		<< std::endl;
	std::cout	<< *i		<< std::endl;

	std::cout	<< *zeta	<< std::endl;
	std::cout	<< *k		<< std::endl;

	j->makeSound();
	i->makeSound();
	meta->makeSound();

	k->makeSound();
	zeta->makeSound();

	delete i;
	delete j;
	delete meta;

	delete k;
	delete zeta;

	return 0;
}
