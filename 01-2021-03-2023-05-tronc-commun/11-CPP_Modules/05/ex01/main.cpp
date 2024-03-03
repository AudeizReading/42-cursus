#include <iostream>
#include "Bureaucrat.hpp"
#include "Form.hpp"

int	main(void)
{
	try {
		Bureaucrat	b = Bureaucrat("Raymonde", 32);

		std::cout	<< b
					<< std::endl;

		Form		f = Form("formulaire administratif", false, 32, 118);

		std::cout	<< f
					<< std::endl;

		b.signForm(f);

		std::cout	<< f
					<< std::endl;

		Form		f1 = Form("formulaire administratif", false, 25, 149);

		std::cout	<< f1
					<< std::endl;

		b.signForm(f1);

		std::cout	<< f1
					<< std::endl;
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
