#ifndef PHONE_BOOK_HPP
# define PHONE_BOOK_HPP
# include <iostream>
# include <limits>
# include <string>
# include "Contact.hpp"

size_t const	size_contacts = 8;

class PhoneBook {

	Contact			_contacts[size_contacts];
	size_t			_size;
	bool			_isEmpty;

	void			printMainPompt(void) const;
	void			addContact(void);
	void			displayContactMenu(void) const;
	void			displayContact(int index) const;
	bool			isEmpty(void) const;
	size_t			getSize(void) const;
	void			setIsEmpty(bool state);
	void			setSize(size_t size);
	
	public:
		PhoneBook(void);
		~PhoneBook(void);

		void			launch(void);
};

void	printSepHor(void);
bool	getUserChoice(int &n, int min, int max);
# endif /* PHONE_BOOK_HPP */
