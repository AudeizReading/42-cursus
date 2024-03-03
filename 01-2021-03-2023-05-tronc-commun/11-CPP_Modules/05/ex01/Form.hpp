#ifndef FORM_HPP
# define FORM_HPP
# include <iostream>
# include <exception>
# include "Bureaucrat.hpp"

class Bureaucrat;

class Form {
	private:
		std::string const	_name;
		bool				_signed;
		size_t const		_signedGrade;
		size_t const		_executedGrade;

	public:
		static size_t const		lowlvl = 150;
		static size_t const		higlvl = 1;

		class GradeTooLowException : public std::exception {
			size_t	grade;

			public:
				GradeTooLowException(size_t grd);
				virtual const char* what(void) const throw();
		};

		class GradeTooHighException : public std::exception {
			size_t	grade;

			public:
				GradeTooHighException(size_t grd);
				virtual const char* what(void) const throw();
		};
		
		Form(std::string const &name="Basic Form", bool const &signForm=false, size_t const &signGrade=Form::higlvl, size_t const &execGrade=Form::lowlvl);
		Form(Form const &src);
		virtual ~Form(void);
		Form & operator=(Form const &src);

		std::string const&	getName(void) const;
		size_t const&		getSignGrade(void) const;
		size_t const&		getExecGrade(void) const;
		bool				isSigned(void) const;
		bool				setSigned(size_t signGrade);

		bool				beSigned(Bureaucrat const &b);
};

std::ostream &		operator<<(std::ostream &o, Form const &f);
#endif 
