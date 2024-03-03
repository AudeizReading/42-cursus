#include <iostream>
#include "Animal.hpp"
#include "WrongAnimal.hpp"
#include "Cat.hpp"
#include "WrongCat.hpp"
#include "Dog.hpp"
#include "Brain.hpp"

int	main(void)
{
	Animal	*spa[10];

	for (size_t i = 0; i != 10; i++) {
		if (i < 5)
			spa[i] = new Cat();
		else
			spa[i] = new Dog();
		std::cout	<< std::endl;
	}
	std::cout	<< std::endl;
	for (size_t i = 0; i != 10; i++) {
		std::cout	<<"Animal["	<< i	<< "] "	<< spa[i]	<< " "	<< *spa[i]	<< std::endl;
		spa[i]->makeSound();
		std::cout	<< std::endl;
	}
	std::cout	<< std::endl;
	for (size_t i = 0; i != 10; i++) {
		delete spa[i];
		std::cout	<< std::endl;
	}
	std::cout	<< std::endl;
	const Animal	*meta = new Animal();
	std::cout	<< std::endl;
	const Animal	*j = new Dog();
	std::cout	<< std::endl;
	const Animal	*i = new Cat();
	std::cout	<< std::endl;

	const WrongAnimal	*zeta = new WrongAnimal();
	std::cout	<< std::endl;
	const WrongAnimal	*k = new WrongCat();
	std::cout	<< std::endl;

	const Cat	*a = new Cat();
	std::cout	<< std::endl;
	const Cat	*b = new Cat(*a);
	std::cout	<< std::endl;
	const Cat	*c = b;
	std::cout	<< std::endl;
	a->displayBrain();
	c->displayBrain();
	std::cout	<< std::endl;

	const Dog	*d = new Dog();
	std::cout	<< std::endl;
	const Dog	*e = new Dog(*d);
	std::cout	<< std::endl;
	const Dog	*f = e;
	std::cout	<< std::endl;
	d->displayBrain();
	f->displayBrain();
	std::cout	<< std::endl;

	std::cout	<< *meta	<< std::endl;
	std::cout	<< *j		<< std::endl;
	std::cout	<< *i		<< std::endl;
	std::cout	<< std::endl;

	std::cout	<< *zeta	<< std::endl;
	std::cout	<< *k		<< std::endl;
	std::cout	<< std::endl;

	std::cout	<< *a		<< std::endl;
	std::cout	<< *b		<< std::endl;
	std::cout	<< *c		<< std::endl;
	std::cout	<< std::endl;

	std::cout	<< *d		<< std::endl;
	std::cout	<< *e		<< std::endl;
	std::cout	<< *f		<< std::endl;
	std::cout	<< std::endl;

	j->makeSound();
	i->makeSound();
	meta->makeSound();
	std::cout	<< std::endl;

	k->makeSound();
	zeta->makeSound();
	std::cout	<< std::endl;

	delete i;
	std::cout	<< std::endl;
	delete j;
	std::cout	<< std::endl;
	delete meta;
	std::cout	<< std::endl;

	delete k;
	std::cout	<< std::endl;
	delete zeta;
	std::cout	<< std::endl;

	delete a;
	std::cout	<< std::endl;
	delete b;
	std::cout	<< std::endl;

	delete d;
	std::cout	<< std::endl;
	delete e;
	std::cout	<< std::endl;

	return 0;
}
