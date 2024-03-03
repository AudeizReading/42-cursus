#ifndef CLAPTRAP_HPP
# define CLAPTRAP_HPP
# include <iostream>

class ClapTrap {
	private:
		std::string	_name;
		int			_hitPoints; // health of ClapTrap
		int			_energyPoints;
		int			_attackDamage;

	public:
		ClapTrap(std::string const &name = "Default ClapTrap");
		ClapTrap(ClapTrap const &src);
		~ClapTrap(void);
		ClapTrap & operator=(ClapTrap const &src);

		std::string	getName(void) const;
		int			getHitPoints(void) const;
		int			getEnergyPoints(void) const;
		int			getAttackDamage(void) const;
		bool		isAlive(void) const;
		void		updateEnergyPoints(int const &point);
		void		updateHitPoints(int const &point);

		void		attack(const std::string& target);
		void		takeDamage(unsigned int amount);
		void		beRepaired(unsigned int amount);
};

std::ostream &		operator<<(std::ostream & o, ClapTrap const &ct);

#endif 
