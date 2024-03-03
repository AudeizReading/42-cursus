#ifndef INTERN_HPP
# define INTERN_HPP
# include <iostream>
# include <string>
# include "Form.hpp"
# include "ShrubberyCreationForm.hpp"
# include "RobotomyRequestForm.hpp"
# include "PresidentialPardonForm.hpp"

class Intern {
	public:
		Intern(void);
		Intern(Intern const &src);
		virtual ~Intern(void);
		Intern & operator=(Intern const &src);

		Form*	makeForm(std::string const &formName, std::string const &target);
};
#endif 
