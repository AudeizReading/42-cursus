#ifndef CLAPTRAP_HPP
# define CLAPTRAP_HPP
# include <iostream>

class ClapTrap {
	protected:
		std::string			_name;
		int					_hitPoints; // health of ClapTrap
		int					_energyPoints;
		int					_attackDamage;

	public:
		ClapTrap(std::string const &name = "Default ClapTrap", int const &hit = 10, int const &nrg = 10, int const &dmg = 0);
		ClapTrap(ClapTrap const &src);
		virtual ~ClapTrap(void);
		ClapTrap & operator=(ClapTrap const &src);

		virtual std::string		getName(void) const;
		int						getHitPoints(void) const;
		int						getEnergyPoints(void) const;
		int						getAttackDamage(void) const;
		bool					isAlive(void) const;
		void					updateEnergyPoints(int const &point);
		void					updateHitPoints(int const &point);

		virtual void			attack(const std::string& target);
		void					takeDamage(unsigned int amount);
		void					beRepaired(unsigned int amount);
};

std::ostream &					operator<<(std::ostream & o, ClapTrap const &ct);

#endif 
