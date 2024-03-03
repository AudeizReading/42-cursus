#include "Form.hpp"

/* --- Coplien ------------------------------------------------------------ */
Form::Form(std::string const &name, bool const &signForm, size_t const &signGrade, size_t const &execGrade)
: _name(name), _signed(signForm), _signedGrade(signGrade), _executedGrade(execGrade) {
	if (signGrade > Form::lowlvl || execGrade > Form::lowlvl) {
		throw Form::GradeTooLowException((signGrade > Form::lowlvl) ? signGrade : execGrade);
	}
	else if (signGrade < Form::higlvl || execGrade < Form::higlvl) {
		throw Form::GradeTooHighException((signGrade < Form::higlvl) ? signGrade : execGrade);
	}
}

Form::Form(Form const &src) : _name(src.getName()), _signed(src.isSigned()), _signedGrade(src.getSignGrade()), _executedGrade(src.getExecGrade()) {
	if (src.getSignGrade() > Form::lowlvl || src.getExecGrade() > Form::lowlvl) {
		throw Form::GradeTooLowException((src.getSignGrade() > Form::lowlvl) ? src.getSignGrade() : src.getExecGrade());
	}
	else if (src.getSignGrade() < Form::higlvl || src.getExecGrade() < Form::higlvl) {
		throw Form::GradeTooHighException((src.getSignGrade() < Form::higlvl) ? src.getSignGrade() : src.getExecGrade());
	}
}

Form::~Form(void) {
}

Form&		Form::operator=(Form const &src) {
	if (this != &src) {
		if (src.getSignGrade() > Form::lowlvl || src.getExecGrade() > Form::lowlvl) {
			throw Form::GradeTooLowException((src.getSignGrade() > Form::lowlvl) ? src.getSignGrade() : src.getExecGrade());
		}
		else if (src.getSignGrade() < Form::higlvl || src.getExecGrade() < Form::higlvl) {
			throw Form::GradeTooHighException((src.getSignGrade() < Form::higlvl) ? src.getSignGrade() : src.getExecGrade());
		}
		else
			(*this) = src;
	}
	return (*this);
}
/* --- Coplien ------------------------------------------------------------ */



/* --- Getters / Setters -------------------------------------------------- */
std::string const &		Form::getName(void) const {
	return this->_name;
}

size_t const &			Form::getSignGrade(void) const {
	return this->_signedGrade;
}

size_t const &			Form::getExecGrade(void) const {
	return this->_executedGrade;
}

bool					Form::isSigned(void) const {
	return this->_signed;
}

bool					Form::setSigned(size_t signGrade) {
	if (!this->isSigned()) {
		if (signGrade > this->getSignGrade()) {
			throw Form::GradeTooLowException(signGrade);
		}
		else if (signGrade > Form::lowlvl) {
			throw Form::GradeTooLowException(signGrade);
		}
		else if (signGrade < Form::higlvl) {
			throw Form::GradeTooHighException(signGrade);
		}
		else {
			this->_signed = true;
			return true;
		}
	}
	return false;
}
/* --- Getters / Setters -------------------------------------------------- */



/* --- Exceptions --------------------------------------------------------- */
Form::GradeTooLowException::GradeTooLowException(size_t grd) : grade(grd) {
}

const char * Form::GradeTooLowException::what(void) const throw() {
	std::cerr	<< this->grade	<< " ";
	return ("[Form] Grade Too Low");
}

Form::GradeTooHighException::GradeTooHighException(size_t grd) : grade(grd) {
}

const char * Form::GradeTooHighException::what(void) const throw() {
	std::cerr	<< this->grade	<< " ";
	return ("[Form] Grade Too High");
}
/* --- Exceptions --------------------------------------------------------- */



/* --- Others ------------------------------------------------------------- */
bool					Form::beSigned(Bureaucrat const &b) {
	if (this->setSigned(b.getGrade()))
		return true;
	return false;
}
/* --- Others ------------------------------------------------------------- */



/* --- Operators ---------------------------------------------------------- */
std::ostream &			operator<<(std::ostream &o, Form const &f) {
	o	<< f.getName()	<< " signed: "	<<	((f.isSigned()) ? "yes" : "no")
		<< "\nGrade needed for signing this kind of form: "		<<	f.getSignGrade()
		<< "\nGrade needed for executing this kind of form: "	<<	f.getExecGrade();
	return o;
}
/* --- Operators ---------------------------------------------------------- */
