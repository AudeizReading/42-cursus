#pragma once

#include <iostream>
#include <iomanip>
#include <string>
#include <sstream>
#include <ctime>

// --- define ------------------------------------------------------------------
#define CYAN_BIS(x, bg)			"\033[36;"bg"m"x"\033[0m"
#define INIT_TIMER				clock_t				timer;
#define START_TIMER				timer = clock();
#define STOP_TIMER				timer = clock() - timer;
#define CUMUL_TIMER				total_clocks += timer;
#define PRINT_TIMER(x)			print_cmd_clocks((x), timer, NAMESPACE);
#define TIMEFILE_TIMER(x, y)	print_cmd_clocks((x), timer, NAMESPACE, y);
#define PRINT_TIME_TOTAL		print_total_clocks(NAMESPACE);
#define TIMEFILE_TOTAL(x)		print_total_clocks(NAMESPACE, x);
#define RESET_TIMER(x, y)		STOP_TIMER \
								CUMUL_TIMER \
								TIMEFILE_TIMER(x, y) \
								START_TIMER
#define END_TIMER(x, y)			STOP_TIMER \
								CUMUL_TIMER \
								TIMEFILE_TIMER(x, y) 

// --- globals -----------------------------------------------------------------
extern clock_t		total_clocks;

// --- functions ---------------------------------------------------------------
void				print_cmd_clocks(std::string const& str, clock_t start, std::string const& nsp);
std::ostream&		print_cmd_clocks(std::string const& str, clock_t start, std::string const& nsp, std::ostream& o);
void				print_total_clocks(std::string const& nsp);
std::ostream&		print_total_clocks(const std::string &nsp, std::ostream& o);
