#include <timer_utils.hpp>

clock_t		total_clocks = 0;

void		print_cmd_clocks(std::string const& str, clock_t start, std::string const& nsp)
{
	double							cps		= static_cast<double>(CLOCKS_PER_SEC);
	double							timer	= static_cast<double>(start);

	std::stringstream	ss;

	ss.precision(7);
	ss << std::fixed;

	ss << "[";

	ss << str;

	ss << "]\n\n==** ";
	ss << CYAN_BIS("TIME ELAPSED", "40");
	ss << " **== \033[36m";

	ss << nsp;

	ss << CYAN_BIS(": nb clocks ", "40");

	ss << std::setfill(' ') << std::setw(7) << start;

	ss << CYAN_BIS(", ", "40");

	ss << std::setfill('0') << std::setw(7) << timer / cps;
	
	ss << CYAN_BIS(" s", "40");

	ss << "\n|-------------------------------------------------------------------------------------------------|\n";

	std::cout << ss.str() << std::endl;
}

std::ostream&		print_cmd_clocks(std::string const& str, clock_t start, std::string const& nsp, std::ostream& o)
{
	double							cps		= static_cast<double>(CLOCKS_PER_SEC);
	double							timer	= static_cast<double>(start);

	std::stringstream	ss;

	ss.precision(7);
	ss << std::fixed;

	ss << "[";

	ss << str;

	ss << "]\n\n==** ";
	ss << CYAN_BIS("TIME ELAPSED", "40");
	ss << " **== \033[36m";

	ss << nsp;

	ss << CYAN_BIS(": nb clocks ", "40");

	ss << std::setfill(' ') << std::setw(7) << start;

	ss << CYAN_BIS(", ", "40");

	ss << std::setfill('0') << std::setw(7) << timer / cps;
	
	ss << CYAN_BIS(" s", "40");

	ss << "\n|-------------------------------------------------------------------------------------------------|\n";

	o << ss.str() << std::endl;
	return o;
}

void		print_total_clocks(const std::string &nsp)
{
	double	cps = static_cast<double>(CLOCKS_PER_SEC);
	double	timer = static_cast<double>(total_clocks);

	std::cout.precision(7);
	std::cout << std::fixed;
	std::cout << "\n==** \033[36mTIME ELAPSED\033[0m **== \033[36m"<< nsp <<": nb clocks\033[0m " << total_clocks << "\033[36m, \033[0m " << timer / cps << "\033[36m s\033[0m" << std::endl;
}

std::ostream&	print_total_clocks(const std::string &nsp, std::ostream& o)
{
	double	cps = static_cast<double>(CLOCKS_PER_SEC);
	double	timer = static_cast<double>(total_clocks);

	o.precision(10);
	o << std::fixed;
	o << nsp << "\n";
	o << total_clocks << "\n";
	o << timer / cps << " s\n";
	o << "=== END TIME CHECKING ==========================================================\n";

	return o;
}
