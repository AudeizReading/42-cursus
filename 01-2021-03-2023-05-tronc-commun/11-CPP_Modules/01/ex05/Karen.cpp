#include "Karen.hpp"

Karen::Karen(void) {}

Karen::~Karen(void) {}

void				Karen::debug(void)
{
	std::string	output("I love having extra bacon for my 7XL-double-cheese-triple-pickle-special-ketchup burger. I really do!");

	std::cout	<< output
				<< std::endl;
}

void				Karen::info(void)
{
	std::string	output("I cannot believe adding extra bacon costs more oney. You didn't put enough bacon in my burger ! If you did, I wouldn't be asking for more !");

	std::cout	<< output
				<< std::endl;
}

void				Karen::warning(void)
{
	std::string	output("I think I deserve to have some extra bacon for free. I've been coming for years whereas you started working here since last month.");

	std::cout	<< output
				<< std::endl;
}

void				Karen::error(void)
{
	std::string	output("This is unacceptable ! I want to speak to the manager now.");

	std::cout	<< output
				<< std::endl;
}

void				Karen::complain(std::string level)
{
	struct	s {
		std::string	s_level;
		void (Karen::*s_func)(void);
	};
	struct s infos[] = {
		{"DEBUG", &Karen::debug},
		{"INFO", &Karen::info},
		{"WARNING", &Karen::warning},
		{"ERROR", &Karen::error}
	};
	
	for (int i = 0; i < 4; i++)
	{
		if (!level.compare(infos[i].s_level))
			(this->*infos[i].s_func)();
	}
}
