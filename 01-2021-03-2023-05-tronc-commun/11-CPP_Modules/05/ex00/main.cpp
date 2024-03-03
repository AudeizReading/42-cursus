#include <iostream>
#include "Bureaucrat.hpp"

int	main(void)
{
	try {
		Bureaucrat	b = Bureaucrat("Gustave", 151);

		std::cout	<< b
					<< std::endl;

		for (size_t i = 0; i != 30; i++) {
			b.incrementGrade();
		}

		std::cout	<< b
					<< std::endl;
	}
	catch (Bureaucrat::GradeTooLowException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Bureaucrat::GradeTooHighException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}

	try {
		Bureaucrat	b = Bureaucrat("Maurice", 1);

		std::cout	<< b
					<< std::endl;

		for (size_t i = 0; i != 30; i++) {
			b.incrementGrade();
			for (size_t j = 0; j != 2; j++) {
				b.decrementGrade();
			}
		}

		std::cout	<< b
					<< std::endl;
	}
	catch (Bureaucrat::GradeTooLowException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Bureaucrat::GradeTooHighException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}

	try {
		Bureaucrat	b = Bureaucrat("Suzette", -7);

		std::cout	<< b
					<< std::endl;

		for (size_t i = 0; i != 30; i++) {
			b.incrementGrade();
		}

		std::cout	<< b
					<< std::endl;
	}
	catch (Bureaucrat::GradeTooLowException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Bureaucrat::GradeTooHighException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}

	try {
		Bureaucrat	b = Bureaucrat("Raymonde", 32);

		std::cout	<< b
					<< std::endl;

		for (size_t i = 0; i != 30; i++) {
			b.incrementGrade();
		}

		std::cout	<< b
					<< std::endl;
	}
	catch (Bureaucrat::GradeTooLowException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Bureaucrat::GradeTooHighException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}

	try {
		Bureaucrat	b = Bureaucrat("Josiane", 127);

		std::cout	<< b
					<< std::endl;

		for (size_t i = 0; i != 30; i++) {
			b.incrementGrade();
			for (size_t j = 0; j != 2; j++) {
				b.decrementGrade();
			}
		}

		std::cout	<< b
					<< std::endl;
	}
	catch (Bureaucrat::GradeTooLowException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}
	catch (Bureaucrat::GradeTooHighException &e) {
		std::cerr	<< e.what()	<< std::endl;
	}

	return 0;
}
