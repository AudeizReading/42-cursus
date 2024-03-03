#include "Brain.hpp"

/* --- Coplien ------------------------------------------------------------ */
Brain::Brain(std::string const &str, int const &size) : _size(size) {
	this->ideas = new std::string[this->getSize()];
	for (size_t i = 0; i != this->getSize(); i++) {
		this->ideas[i] = str;
	}
	std::cout	<< "[Brain] is ready. ideas too. [Default constructor]"	<< std::endl;
}

Brain::Brain(Brain const &src) : _size(src.getSize()) {
	this->ideas = new std::string[this->getSize()];
	for (size_t i = 0; i != this->getSize(); i++) {
		this->ideas[i] = src.ideas[i];
	}
	std::cout	<< "[Brain] is ready. ideas too. [Copy constructor]"	<< std::endl;
}

Brain::~Brain(void) {
	delete [] this->ideas;
	std::cout	<< "Good Bye My [Brain]... [Default destructor]"	<< std::endl;
}

Brain&		Brain::operator=(Brain const &src) {
	if (this != &src) {
		delete [] this->ideas;
		if (this->getSize() != src.getSize())
			this->setSize(src.getSize());
		this->ideas = new std::string[this->getSize()];
		for (size_t i = 0; i != this->getSize(); i++) {
			this->ideas[i] = src.ideas[i];
		}
	}
	std::cout	<< "That's a great new Brain ! What such an idea for taking it out there! [Assignement operator] "	<< std::endl;
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
size_t			Brain::getSize(void) const {
	return this->_size;
}

void			Brain::setSize(size_t size) {
	this->_size = size;
}

void			Brain::readIdeas(void) const {
	std::cout	<<	"Brain]"	<< std::endl;
	for (size_t i = 0; i != this->getSize(); i++) {
		std::cout	<< "\tideas["	<<	i	<< "]:\t\t"	<< this->ideas[i]	<< std::endl;
	}
}

void			Brain::setIdea(std::string const &idea, size_t index) {
	if (index < this->getSize()) {
		this->ideas[index] = idea;
	}
}

void			Brain::setIdeas(std::string const &idea) {
	for (size_t i = 0; i != this->getSize(); i++) {
		this->setIdea(idea, i);
	}
}
/* --- Getters / Setters -------------------------------------------------- */
