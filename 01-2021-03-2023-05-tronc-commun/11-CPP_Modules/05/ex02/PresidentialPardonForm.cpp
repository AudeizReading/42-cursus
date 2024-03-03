#include "PresidentialPardonForm.hpp"

/* --- Coplien ------------------------------------------------------------ */
PresidentialPardonForm::PresidentialPardonForm(std::string const &target) : Form("Presidential Pardon", false, 25, 5, target) {
}

PresidentialPardonForm::PresidentialPardonForm(PresidentialPardonForm const &src) : Form(src.getName(), src.isSigned(), src.getSignGrade(), src.getExecGrade(), src.getTarget()) {
}

PresidentialPardonForm::~PresidentialPardonForm(void) {
}

PresidentialPardonForm&		PresidentialPardonForm::operator=(PresidentialPardonForm const &src) {
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



/* --- Others ------------------------------------------------------------- */
void						PresidentialPardonForm::operate(void) const {
	std::cout	<< this->getTarget()	<< " has been pardoned by Zaphod Beeblebrox"
				<< std::endl;
}
/* --- Others ------------------------------------------------------------- */
