#include "Span.hpp"

/* --- Coplien ------------------------------------------------------------ */
Span::Span(unsigned int N) : _N(N), _span(new std::vector<int>) {}

Span::Span(Span const &src) : _N(src.getN()), _span(new std::vector<int>(*src._span)) {}

Span::~Span(void) { delete this->_span; }

Span&		Span::operator=(Span const &src) {
	if (this != &src) {
		this->_N = src.getN();
		delete this->_span;
		this->_span = new std::vector<int>(*src._span);
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
const unsigned int &			Span::getN(void) const { return this->_N; }

unsigned int					Span::getSpanSize(void) const { return this->_span->size(); }

void							Span::getInfos(void) const {
	std::cout	<< "N: "			<< this->getN()	<< std::endl;
	std::cout	<< "Span size: "	<< this->getSpanSize()	<< std::endl;
	if (this->getSpanSize()) {
		std::cout	<< "Span front: "		<< this->_span->front()	<< std::endl;
		std::cout	<< "Span back: "		<< this->_span->back()	<< std::endl;
		try {
			std::cout	<< "Shortest span: "	<< this->shortestSpan()	<< std::endl;
			std::cout	<< "Longest span: "		<< this->longestSpan()	<< std::endl;
		}
		catch (std::exception &e) {
			std::cout << "\n"	<< e.what()	<< ": trying to use shortest/longestSpan for displaying it but Span has not the required size for"	<< std::endl;
		}
	}
}
/* --- Getters / Setters -------------------------------------------------- */



/* --- Mandatory part ----------------------------------------------------- */
void							Span::addNumber(int n) {
	if (this->getSpanSize() == this->getN())
		throw std::exception();
	this->_span->push_back(n);
}

void							Span::addRangeNumber(std::vector<int>::iterator begin, std::vector<int>::iterator end) {
	unsigned int	availSpan = this->getN() - this->getSpanSize();
	unsigned int	sizeToAdd = std::distance(begin, end);

	if (availSpan < sizeToAdd)
		throw std::exception();

	// copy at the end of the _span container the elements of the vector container that iterators begin and end belong to
	// understand that is a big big this->_span->push_back()
	std::copy(begin, end, std::back_inserter(*this->_span));
}

int								Span::longestSpan(void) const {
	if (this->getSpanSize() < 2)
		throw std::exception();

	std::vector<int>::iterator	it = this->_span->begin();
	std::vector<int>::iterator	ite = this->_span->end();

	return (*std::max_element(it, ite) - *std::min_element(it, ite));
}

int								Span::shortestSpan(void) const {
	if (this->getSpanSize() < 2)
		throw std::exception();

	std::vector<int>			copy = std::vector<int>(*this->_span);
	std::vector<int>::iterator	it = copy.begin();
	std::vector<int>::iterator	ite = copy.end();

	std::sort(it, ite);
	it = copy.begin();
	ite = copy.end();
	
	std::vector<int>			delta = std::vector<int>(*this->_span);
	std::adjacent_difference(it, ite, delta.begin());

	it = delta.begin();
	ite = delta.end();
	return (*std::min_element(it, ite));
}
/* --- Mandatory part ----------------------------------------------------- */
