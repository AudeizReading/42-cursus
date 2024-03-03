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
		std::string const	_target;

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
		
		class NotSignedException : public std::exception {

			public:
				NotSignedException(void);
				virtual const char* what(void) const throw();
		};
		
		class InexistantFormException : public std::exception {

			public:
				InexistantFormException(void);
				virtual const char* what(void) const throw();
		};
		
		Form(std::string const &name="Basic Form", bool const &signForm=false, size_t const &signGrade=Form::higlvl, size_t const &execGrade=Form::lowlvl, std::string const &target="No one");
		Form(Form const &src);
		virtual ~Form(void);
		Form & operator=(Form const &src);

		std::string const&	getName(void) const;
		std::string const&	getTarget(void) const;
		size_t const&		getSignGrade(void) const;
		size_t const&		getExecGrade(void) const;
		bool				isSigned(void) const;
		bool				setSigned(size_t signGrade);

		bool				beSigned(Bureaucrat const &b);
		virtual void		operate(void) const = 0;
		virtual Form*		clone(std::string const &target) const = 0;
		virtual void		execute(Bureaucrat const &executor) const;
};

std::ostream &		operator<<(std::ostream &o, Form const &f);
#endif 
