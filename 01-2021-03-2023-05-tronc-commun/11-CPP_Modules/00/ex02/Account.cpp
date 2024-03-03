#include "Account.hpp"
#include <ctime>
#include <iostream>

/* --- Account non-members ------------------------------------------------ */
int				Account::_nbAccounts = 0;
int				Account::_totalAmount = 0;
int				Account::_totalNbDeposits = 0;
int				Account::_totalNbWithdrawals = 0;

int				Account::getNbAccounts(void) {
	return Account::_nbAccounts;
}

int				Account::getTotalAmount(void) {
	return Account::_totalAmount;
}

int				Account::getNbDeposits(void) {
	return Account::_totalNbDeposits;
}

int				Account::getNbWithdrawals(void) {
	return Account::_totalNbWithdrawals;
}

void			Account::displayAccountsInfos(void) {
	Account::_displayTimestamp();
	std::cout	<< " accounts:"		<< Account::getNbAccounts()
				<< ";total:"		<< Account::getTotalAmount()
				<< ";deposits:"		<< Account::getNbDeposits()
				<< ";withdrawals:"	<< Account::getNbWithdrawals()
				<< std::endl;
}

void			Account::_displayTimestamp(void) {
	char		buf[18];
	time_t		rawtime;
	struct tm	*timeinfo;

	std::time(&rawtime);
	timeinfo = std::localtime(&rawtime);
	std::strftime(buf, 18, "[%Y%m%d_%H%M%S]", timeinfo);
	std::cout	<< buf;
}
/* --- Account non-members ------------------------------------------------ */



/* --- Account constr / destr --------------------------------------------- */
Account::Account(void) : _accountIndex(Account::_nbAccounts), _amount(0), _nbDeposits(0), _nbWithdrawals(0) {
	Account::_nbAccounts++;
	Account::_totalAmount += this->_amount;
	Account::_displayTimestamp();
	std::cout	<< " index:"		<< this->_accountIndex
				<< ";amount:"		<< this->_amount
				<< ";created"
				<< std::endl;
}

Account::Account(int initial_deposit) : _accountIndex(Account::_nbAccounts), _amount(initial_deposit), _nbDeposits(0), _nbWithdrawals(0) {
	Account::_nbAccounts++;
	Account::_totalAmount += this->_amount;
	Account::_displayTimestamp();
	std::cout	<< " index:"		<< this->_accountIndex
				<< ";amount:"		<< this->_amount
				<< ";created"
				<< std::endl;
}

Account::~Account(void) {
	Account::_nbAccounts--;
	Account::_totalAmount -= this->_amount;
	Account::_displayTimestamp();
	std::cout	<< " index:"		<< this->_accountIndex
				<< ";amount:"		<< this->_amount
				<< ";closed"
				<< std::endl;
}
/* --- Account constr / destr --------------------------------------------- */



/* --- Account getter / setter -------------------------------------------- */
void			Account::makeDeposit(int deposit) {
	int	p_amount = this->_amount;

	if (deposit >= 0) {
		this->_amount += deposit;
		this->_nbDeposits++;
		Account::_totalAmount += deposit;
		Account::_totalNbDeposits += this->_nbDeposits;
	}
	Account::_displayTimestamp();
	std::cout	<< " index:"		<< this->_accountIndex
				<< ";p_amount:"		<< p_amount
				<< ";deposit:"		<< deposit
				<< ";amount"		<< this->_amount
				<< ";nb_deposits:"	<< this->_nbDeposits
				<< std::endl;
}

bool			Account::makeWithdrawal(int withdrawal) {
	int	p_amount = this->_amount;

	Account::_displayTimestamp();
	std::cout	<< " index:"		<< this->_accountIndex
				<< ";p_amount:"		<< p_amount
				<< ";withdrawal:";
	if (this->checkAmount() && p_amount - withdrawal >= 0) {
		this->_amount -= withdrawal;
		this->_nbWithdrawals++;
		Account::_totalAmount -= withdrawal;
		Account::_totalNbWithdrawals++;
		std::cout	<< withdrawal
					<< ";amount:"			<< this->_amount
					<< ";nb_withdrawals:"	<< this->_nbWithdrawals
					<< std::endl;

	} else {
		std::cout	<< "refused"
					<< std::endl;
		return false;
	}
	return true;
}

int				Account::checkAmount(void) const {
	if (this->_amount > 0)
		return 1;
	return 0;
}

void			Account::displayStatus(void) const {
	Account::_displayTimestamp();
	std::cout	<< " index:"		<< this->_accountIndex
				<< ";amount:"		<< this->_amount
				<< ";deposits:"		<< this->_nbDeposits
				<< ";withdrawals:"	<< this->_nbWithdrawals
				<< std::endl;
}
/* --- Account getter / setter -------------------------------------------- */
