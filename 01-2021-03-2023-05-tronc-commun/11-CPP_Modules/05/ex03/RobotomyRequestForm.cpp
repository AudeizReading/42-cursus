#include "RobotomyRequestForm.hpp"

/* --- Coplien ------------------------------------------------------------ */
RobotomyRequestForm::RobotomyRequestForm(std::string const &target) : Form("Robotomy Request", false, 72, 45, target) {
}

RobotomyRequestForm::RobotomyRequestForm(RobotomyRequestForm const &src) : Form(src.getName(), src.isSigned(), src.getSignGrade(), src.getExecGrade(), src.getTarget()) {
}

RobotomyRequestForm::~RobotomyRequestForm(void) {
}

RobotomyRequestForm&		RobotomyRequestForm::operator=(RobotomyRequestForm const &src) {
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
void						RobotomyRequestForm::operate(void) const {
	std::srand(std::time(nullptr));

	if (rand() % 2) {
		std::cout	<< this->getTarget()	<< " has been robotomized successfully"
					<< std::endl;
	}
	else {
		std::cout	<< this->getTarget()	<< " has not been robotomized. The Robotomy has failed"
					<< std::endl;
	}
}

Form*						RobotomyRequestForm::clone(std::string const &target) const {
	return new RobotomyRequestForm(target);
}
/* --- Others ------------------------------------------------------------- */
