#include <iostream>
#include "Base.hpp"
#include "A.hpp"
#include "B.hpp"
#include "C.hpp"

Base	*generate(void) {
	int	random = std::rand() % 3;

	switch (random) {
		case 0:
			std::cout	<< "Class A generated...\r"	<< std::endl;
			return new A();
		case 1:
			std::cout	<< "Class B generated...\r"	<< std::endl;
			return new B();
		case 2:
			std::cout	<< "Class C generated...\r"	<< std::endl;
			return new C();
	}
	return nullptr;
}

void	identify(Base *p) {
	if (dynamic_cast<A *>(p)) {
		std::cout	<< "This Base is a A (pointer). "	<< &p	<< std::endl;
	}
	else if (dynamic_cast<B *>(p)) {
		std::cout	<< "This Base is a B (pointer). "	<< &p	<< std::endl;
	}
	else if (dynamic_cast<C *>(p)) {
		std::cout	<< "This Base is a C (pointer). "	<< &p	<< std::endl;
	}
	else
		std::cout	<< "This Base is an unknown base."	<< std::endl;
}

void	identify(Base &p) {
	try {
		Base & base= dynamic_cast<A &>(p);
		std::cout	<< "This Base is a A (reference) "	<< &p	<< " / "	<< &base	<< std::endl;
		return;
	}
	catch (std::bad_cast &e) {
		(void)e;
	}
	try {
		Base & base= dynamic_cast<B &>(p);
		std::cout	<< "This Base is a B (reference) "	<< &p	<< " / "	<< &base	<< std::endl;
		return ;
	}
	catch (std::bad_cast &e) {
		(void)e;
	}
	try {
		Base & base= dynamic_cast<C &>(p);
		std::cout	<< "This Base is a C (reference) "	<< &p	<< " / "	<< &base	<< std::endl;
		return;
	}
	catch (std::bad_cast &e) {
		(void)e;
	}
}

int	main(void)
{
	std::srand(std::time(NULL));

	Base *p = generate();
	Base *q = generate();
	Base *r = generate();
	Base *s = nullptr;

	Base &p_r = *p;
	Base &q_r = *q;
	Base &r_r = *r;

	identify(p);
	identify(q);
	identify(r);

	identify(p_r);
	identify(q_r);
	identify(r_r);

	identify(s);
	identify(NULL);

	delete p;
	delete q;
	delete r;

	return 0;
}
