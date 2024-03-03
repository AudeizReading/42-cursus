
#include "Contact.hpp"

/* --- Start - Constructors / Destructor ----------------------------------- */

Contact::Contact(void) 
	: _firstName(""), _lastName(""), _nickName(""), _phoneNumber(""), _darkestSecret("") {

	Contact::_nbContact++;
}

Contact::Contact(Contact const &contact) 
	: _firstName(contact._firstName), _lastName(contact._lastName), _nickName(contact._nickName), _phoneNumber(contact._phoneNumber), _darkestSecret(contact._darkestSecret) {

	Contact::_nbContact++;
}

Contact::~Contact(void) {
	
	Contact::_nbContact--;
}

/* --- End - Constructors / Destructor ------------------------------------- */



/* --- Start - Static Members ---------------------------------------------- */

int	Contact::_nbContact = 0;

int					Contact::getNbContact(void) {

	return Contact::_nbContact;
}

/* --- End - Static Members ------------------------------------------------ */



/* --- Start - Getters ----------------------------------------------------- */

std::string			Contact::getInfo(std::string Contact::*str) const {
	
	return this->*str;
}

void				Contact::getFmtInfo(std::string Contact::*str) const {
	
	std::string	fmt(this->getInfo(str));

	if (fmt.size() > 10) {
		fmt = fmt.substr(0, 9);
		fmt.append(".");
	}
	std::cout	<< std::right
				<< std::setw(10)
				<< fmt
				<< "|";
}

void				Contact::getFmtInfos(void) const {

	std::cout	<< "|";
	this->getFmtInfo(&Contact::_firstName);
	this->getFmtInfo(&Contact::_lastName);
	this->getFmtInfo(&Contact::_nickName);
	std::cout	<< std::endl;
}

void				Contact::getInfos(void) const {

	std::cout	<< "First Name: "
				<< this->getInfo(&Contact::_firstName)
				<< "\nLast Name: "
				<< this->getInfo(&Contact::_lastName)
				<< "\nNick Name: "
				<< this->getInfo(&Contact::_nickName)
				<< "\nPhone Number: "
				<< this->getInfo(&Contact::_phoneNumber)
				<< "\nDarkest Secret: "
				<< this->getInfo(&Contact::_darkestSecret)
				<< std::endl;
}

/* --- End - Getters ------------------------------------------------------- */



/* --- Start - Setters ----------------------------------------------------- */

void				Contact::setInfo(std::string Contact::*str) {
	
	do {
		
		std::cin >> std::ws;
		std::getline(std::cin, this->*str);
		if (std::cin.eof())
			break;
	} while ((this->*str).empty() || std::cin.bad());
}

void				Contact::setInfos(void) {

	std::cout	<< "Please, enter your first name:"
				<< std::endl; 
	this->setInfo(&Contact::_firstName);
	std::cout	<< "Please, enter your last name:"
				<< std::endl; 
	this->setInfo(&Contact::_lastName);
	std::cout	<< "Please, enter your nick name:"
				<< std::endl; 
	this->setInfo(&Contact::_nickName);
	std::cout	<< "Please, enter your phone number:"
				<< std::endl; 
	this->setInfo(&Contact::_phoneNumber);
	std::cout	<< "Please, enter your darkest secret:"
				<< std::endl; 
	this->setInfo(&Contact::_darkestSecret);
}

/* --- End - Setters ------------------------------------------------------- */



/* --- Start - Operators --------------------------------------------------- */
Contact	&			Contact::operator=(Contact &contact) {
	
	if (this != &contact) {
		
		this->_firstName = contact._firstName;
		this->_lastName = contact._lastName;
		this->_nickName = contact._nickName;
		this->_phoneNumber = contact._phoneNumber;
		this->_darkestSecret = contact._darkestSecret;
	}
	return *this;
}
/* --- End - Operators ----------------------------------------------------- */



/* --- Start - Others ------------------------------------------------------ */
void				Contact::clearContact(void) {
	
	this->_firstName.clear();
	this->_lastName.clear();
	this->_nickName.clear();
	this->_phoneNumber.clear();
	this->_darkestSecret.clear();
}
/* --- End - Others -------------------------------------------------------- */
