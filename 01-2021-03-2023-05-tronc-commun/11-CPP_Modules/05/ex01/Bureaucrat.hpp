#ifndef BUREAUCRAT_HPP
# define BUREAUCRAT_HPP
# include <iostream>
# include <exception>
# include "Form.hpp"
class Form;

class Bureaucrat {
	private:
		std::string const	_name;
		size_t				_grade;

	public:
		static size_t const		lowlvl = 150;
		static size_t const		higlvl = 1;

		class GradeTooHighException : public std::exception {
			size_t	grade;

			public:
				GradeTooHighException(size_t grd);
				virtual const char* what(void) const throw();
		};

		class GradeTooLowException : public std::exception {
			size_t	grade;

			public:
				GradeTooLowException(size_t grd);
				virtual const char* what(void) const throw();
		};
		
		Bureaucrat(std::string const &name="low-level bureaucrat", size_t grade=Bureaucrat::lowlvl);
		Bureaucrat(Bureaucrat const &src);
		virtual ~Bureaucrat(void);
		Bureaucrat & operator=(Bureaucrat const &src);

		std::string const&	getName(void) const;
		size_t const&		getGrade(void) const;
		void				setGrade(size_t grade);

		void				incrementGrade(void);
		void				decrementGrade(void);
		void				signForm(Form &f);
};

std::ostream &		operator<<(std::ostream &o, Bureaucrat const &b);
#endif 
