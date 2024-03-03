#include "Bureaucrat.hpp"

/* --- Coplien ------------------------------------------------------------ */
Bureaucrat::Bureaucrat(std::string const &name, size_t grade) : _name(name), _grade(grade) {
	if (grade > Bureaucrat::lowlvl) {
		throw Bureaucrat::GradeTooLowException(grade);
	}
	else if (grade < Bureaucrat::higlvl) {
		throw Bureaucrat::GradeTooHighException(grade);
	}
}

Bureaucrat::Bureaucrat(Bureaucrat const &src) : _name(src.getName()), _grade(src.getGrade()) {
	if (this->getGrade() > Bureaucrat::lowlvl) {
		throw Bureaucrat::GradeTooLowException(src.getGrade());
	}
	else if (this->getGrade() < Bureaucrat::higlvl) {
		throw Bureaucrat::GradeTooHighException(src.getGrade());
	}
}

Bureaucrat::~Bureaucrat(void) {
}

Bureaucrat&		Bureaucrat::operator=(Bureaucrat const &src) {
	if (this != &src) {
		if (src.getGrade() > Bureaucrat::lowlvl) {
			throw Bureaucrat::GradeTooLowException(src.getGrade());
		}
		else if (src.getGrade() < Bureaucrat::higlvl) {
			throw Bureaucrat::GradeTooHighException(src.getGrade());
		}
		else
			(*this) = src;
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
std::string const &		Bureaucrat::getName(void) const {
	return this->_name;
}

size_t const&				Bureaucrat::getGrade(void) const {
	return this->_grade;
}

void					Bureaucrat::setGrade(size_t grade) {
	if (grade > Bureaucrat::lowlvl) {
		throw Bureaucrat::GradeTooLowException(grade);
	}
	else if (grade < Bureaucrat::higlvl) {
		throw Bureaucrat::GradeTooHighException(grade);
	}
	else {
		this->_grade = grade;
	}
}
/* --- Getters / Setters -------------------------------------------------- */



/* --- Others ------------------------------------------------------------- */
void					Bureaucrat::incrementGrade(void) {
	this->setGrade(this->getGrade() - 1);
}

void					Bureaucrat::decrementGrade(void) {
	this->setGrade(this->getGrade() + 1);
}
/* --- Others ------------------------------------------------------------- */



/* --- Exceptions --------------------------------------------------------- */
Bureaucrat::GradeTooLowException::GradeTooLowException(size_t grd) : grade(grd) {
}

const char * Bureaucrat::GradeTooLowException::what(void) const throw() {
	std::cerr	<< this->grade	<< " ";
	return ("Grade Too Low");
}

Bureaucrat::GradeTooHighException::GradeTooHighException(size_t grd) : grade(grd) {
}

const char * Bureaucrat::GradeTooHighException::what(void) const throw() {
	std::cerr	<< this->grade	<< " ";
	return ("Grade Too High");
}
/* --- Exceptions --------------------------------------------------------- */



/* --- Operators ---------------------------------------------------------- */
std::ostream &			operator<<(std::ostream &o, Bureaucrat const &b) {
	o	<< b.getName()	<< ", bureaucrat grade "	<<	b.getGrade();
	return o;
}
/* --- Operators ---------------------------------------------------------- */
