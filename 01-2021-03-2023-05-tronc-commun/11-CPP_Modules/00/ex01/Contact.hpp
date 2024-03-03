#ifndef CONTACT_HPP
# define CONTACT_HPP
# include <string>
# include <iostream>
# include <iomanip>

class Contact {

	std::string 		_firstName;
	std::string 		_lastName;
	std::string 		_nickName;
	std::string			_phoneNumber;
	std::string			_darkestSecret;
	
	static int			_nbContact;

	std::string			getInfo(std::string Contact::*str) const;
	void				getFmtInfo(std::string Contact::*str) const;
	void				setInfo(std::string Contact::*str);
	
	public:
		Contact(void);
		Contact(Contact const &contact);
		Contact &			operator=(Contact &contact);
		~Contact(void);

		void				getInfos(void) const;
		void				getFmtInfos(void) const;
		void				setInfos(void);
		void				clearContact(void);

		static int			getNbContact(void);
};

# endif /* CONTACT_HPP */
