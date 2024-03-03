#include <iostream>
#include "Bureaucrat.hpp"
#include "Form.hpp"
#include "PresidentialPardonForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "ShrubberyCreationForm.hpp"
#include "Intern.hpp"

int	main(void)
{
	try {
		Intern		someintern;
		Bureaucrat	b = Bureaucrat("Raymonde", 22);

		std::cout	<< b
					<< std::endl;

		try {
			Form		*f = someintern.makeForm("presidential pardon", "Luis");

			std::cout	<< *f
						<< std::endl;

			b.signForm(*f);

			std::cout	<< *f
						<< std::endl;

			b.executeForm(*f);

			while (b.getGrade() > f->getExecGrade())
				b.incrementGrade();

			b.executeForm(*f);

			std::cout	<< b
						<< std::endl;
			delete f;
		}
		catch (Form::InexistantFormException &e) {
			std::cerr	<< e.what()	<< std::endl;
			std::cerr	<< "Tss tss... Some intern is trying to make an inexistant form"	<< std::endl;
		}

		try {
			Form		*f1 = someintern.makeForm("robotomy Request", "Julius");

			b.signForm(*f1);

			std::cout	<< *f1
						<< std::endl;

			b.executeForm(*f1);
			delete f1;
		}
		catch (Form::InexistantFormException &e) {
			std::cerr	<< e.what()	<< std::endl;
			std::cerr	<< "Tss tss... Some intern is trying to make an inexistant form"	<< std::endl;
		}

		try {
			Form		*f2 = someintern.makeForm("shrubbery creation", "Edmond");

			b.signForm(*f2);

			std::cout	<< *f2
				<< std::endl;

			b.executeForm(*f2);
			delete f2;
		}
		catch (Form::InexistantFormException &e) {
			std::cerr	<< e.what()	<< std::endl;
			std::cerr	<< "Tss tss... Some intern is trying to make an inexistant form"	<< std::endl;
		}

	}
	catch (Bureaucrat::GradeTooLowException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Bureaucrat::GradeTooHighException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Form::GradeTooLowException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Form::GradeTooHighException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Form::InexistantFormException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}

	return 0;
}
