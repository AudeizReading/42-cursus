#include <iostream>
#include "Bureaucrat.hpp"
#include "Form.hpp"
#include "PresidentialPardonForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "ShrubberyCreationForm.hpp"

int	main(void)
{
	try {
		Bureaucrat	b = Bureaucrat("Raymonde", 22);

		std::cout	<< b
					<< std::endl;

		Form		*f = new PresidentialPardonForm("Luis");

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

/*		Form		f1 = Form("formulaire administratif", false, 25, 149);

		std::cout	<< f1
					<< std::endl;

		b.signForm(f1);

		std::cout	<< f1
					<< std::endl;*/
		Form	*f1 = new RobotomyRequestForm("Julius");

		b.signForm(*f1);

		std::cout	<< *f1
					<< std::endl;

		b.executeForm(*f1);

		Form	*f2 = new ShrubberyCreationForm("Edmond");

		b.signForm(*f2);

		std::cout	<< *f2
					<< std::endl;

		b.executeForm(*f2);

		delete f2;
		delete f1;
		delete f;
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

	return 0;
}
