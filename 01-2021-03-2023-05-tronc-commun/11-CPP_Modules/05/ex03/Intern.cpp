#include "Intern.hpp"

Intern::Intern(void) {
}

Intern::Intern(Intern const &src) {
	(*this) = src;
}

Intern::~Intern(void) {
}

Intern&		Intern::operator=(Intern const &src) {
	if (this != &src) {
		(*this) = src;
	}
	return (*this);
}

Form*		Intern::makeForm(std::string const &formName, std::string const &target) {
	Form	*formToReturn = nullptr;
	struct s {
		std::string const	&name;
		Form				*form;
	} infos[] = {
		{"shrubbery creation", new ShrubberyCreationForm(target)},
		{"robotomy request", new RobotomyRequestForm(target)},
		{"presidential pardon", new PresidentialPardonForm(target)}
	};

	for (size_t i = 0; i != 3; i++) {
		if (!formName.compare(infos[i].name)) {
			formToReturn = infos[i].form->clone(target);
		}
	}
	for (size_t i = 0; i != 3; i++) {
		delete infos[i].form;
	}
	if (!formToReturn)
		throw Form::InexistantFormException();
	return formToReturn;
}
