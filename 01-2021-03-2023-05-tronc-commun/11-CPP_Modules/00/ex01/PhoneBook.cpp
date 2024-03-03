#include "PhoneBook.hpp"

/* --- Others utils -------------------------------------------------------- */
void	printSepHor(void) {
	
	std::cout	<< std::setfill('-')
				<< std::setw(46)
				<< " " << std::endl;
}

bool	getUserChoice(int &n, int min, int max) {

	while (!(std::cin >> n) || (n < min || n > max - 1)) {
		if (std::cin.eof()) {
			
			return false;
		}
		else if (std::cin.fail()) {
			std::cout	<< "Invalid input! please retry: "
						<< std::endl;
			std::cin.clear();
			std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
		} else {
			std::cout	<< "Incorrect input! please retry: "
						<< std::endl;
		}
	}
	return true;
}
/* --- Others utils -------------------------------------------------------- */



/* --- Constr / Destr ------------------------------------------------------ */
PhoneBook::PhoneBook(void) : _size(0), _isEmpty(true) {
		
}

PhoneBook::~PhoneBook(void) {
	
}

/* --- Constr / Destr ------------------------------------------------------ */



/* --- Start - Getters ----------------------------------------------------- */
bool			PhoneBook::isEmpty(void) const {
	
	return (this->_isEmpty);
}

size_t			PhoneBook::getSize(void) const {
	
	return (this->_size);
}
/* --- End - Getters ------------------------------------------------------- */



/* --- Start - Setters ----------------------------------------------------- */
void			PhoneBook::setIsEmpty(bool state) {
	this->_isEmpty = state;	
}

void			PhoneBook::setSize(size_t size) {
	
	this->_size = size;
}
/* --- End - Setters ------------------------------------------------------- */
void			PhoneBook::printMainPompt(void) const {

	std::cout	<< "Please, make your choice:\n"
				<< "ADD    - add a new contact\n"
				<< "SEARCH - search contact\n"
				<< "EXIT   - exit programm"
				<< std::endl;
}

void			PhoneBook::addContact(void) {
	
	if (this->_size < size_contacts) {
		
		this->_contacts[this->_size].setInfos();
		this->setSize(this->getSize() + 1);
		this->setIsEmpty(false);
	} else {
		int	i = 0;

		for (; i < (int)size_contacts - 1; i++) {
			
			this->_contacts[i].clearContact();
			this->_contacts[i] = this->_contacts[i + 1];
		}
		this->_contacts[i].clearContact();
		this->_contacts[i].setInfos();
	}
}

void			PhoneBook::displayContactMenu(void) const {

	static std::string tab[] = {
		"Index",
		"First Name",
		"Last Name",
		"Nick Name"
	};

	for (int i = 0; i < 4; i++) {
		std::cout	<< "|" << std::setw(10) << std::right << tab[i];
	}
	std::cout	<< "|\n";
	printSepHor();
	for (int i = 0; i < (int)this->_size; i++) {
		std::cout	<< "|" << std::setw(10) << std::setfill(' ') << i;
		this->_contacts[i].getFmtInfos();
	}
	printSepHor();
}

void			PhoneBook::displayContact(int index) const {

	this->_contacts[index].getInfos();
	std::cout	<< getSize()
				<< std::endl; 
}

void			PhoneBook::launch(void) {

	std::string	input;

	while (1) {
		
		this->printMainPompt();
		std::cin >> input;
		if (std::cin.eof() || !input.compare("EXIT"))
			break;
		std::cin.clear();
		std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
		if (!input.compare("ADD"))
			this->addContact();
		else if (!input.compare("SEARCH")) {

			if (this->_isEmpty) {
				std::cout	<< "There is no entry into phonebook"
							<< std::endl;
			} else {
				this->displayContactMenu();
				int i;
				std::cout	<< "Please, select a position to show:"
							<< std::endl;
				if (getUserChoice(i, 0, (int)this->getSize())) {
					if (!this->isEmpty()) {
						this->displayContact(i);
					}
				} else {
					break;
				}
			}
		}
	}
}
