#include <iostream>
#include <algorithm>
#include "MutantStack.hpp"

int	addTen(int &n) {
	return n += 10;
}

int	main(void)
{
	std::srand(std::time(NULL));
	MutantStack<int> m;

	std::cout	<< "MutantStack size: "	<< m.size()	<< std::endl;
	std::cout	<< "Beginning of pushing the Mutant Stack"	<< std::endl;
	for (int i = -std::rand() % 879; i < 879; i += std::rand() % 42) {
		m.push(i);
		std::cout	<< m.top()	<< std::endl;
	}
	std::cout	<< "MutantStack size: "	<< m.size()	<< std::endl;

	MutantStack<int>::iterator it = m.begin();
	MutantStack<int>::iterator ite = m.end();

	std::cout	<< "Base of the stack: "			<<	*it			<< std::endl;
	std::cout	<< "Top of the stack (ite): "		<<	*(ite - 1)	<< std::endl;
	std::cout	<< "Top of the stack (top): "		<<	m.top()		<< std::endl;

	++it;
	++it;
	--it;
	std::cout	<< "Beginning of reading the Mutant Stack with iterator"	<< std::endl;
	while (it != ite) {
		std::cout	<< *it	<< std::endl;
		++it;
	}

	it = m.begin();
	ite = m.end();
	std::random_shuffle(it, ite);
	it = m.begin();
	ite = m.end();
	std::cout	<< "Beginning of reading the Mutant Stack with shuffling"	<< std::endl;
	while (it != ite) {
		std::cout	<< *it	<< std::endl;
		++it;
	}

	std::stack<int> s(m);
	std::cout	<< "Top of the stack (top of stack s): "		<<	m.top()		<< std::endl;
	std::cout	<< "stack size: "	<< s.size()	<< std::endl;
	
	std::cout	<< "Beginning of popping the Mutant Stack"	<< std::endl;
	while (!m.empty()) {
		std::cout	<< m.top()	<< std::endl;
		m.pop();
	}
	std::cout	<< "MutantStack size: "	<< m.size()	<< std::endl;
	return 0;
}
