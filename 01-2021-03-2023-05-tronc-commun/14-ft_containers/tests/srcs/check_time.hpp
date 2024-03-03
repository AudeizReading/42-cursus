#pragma once
// --- headers -----------------------------------------------------------------
#include <iostream>
#include <sstream>
#include <fstream>
#include <iomanip>
#include <string>
#include <sstream>
#include <deque>
#include <cmath>

#ifdef STD
	#include <map>
	#include <stack>
	#include <vector>
	#include <utility>
	#include <display_std_map.hpp>
	namespace ft = std;
# define NAMESPACE "STD"
#else
	#include <map.hpp>
	#include <stack.hpp>
	#include <vector.hpp>
	#include <utility.hpp>
# define NAMESPACE "FT"
#endif

#include <stdlib.h>

#include <tests_containers_utils.hpp>
#include <display_utils.hpp>
#include <timer_utils.hpp>
#include <utils.hpp>

// --- define ------------------------------------------------------------------
#define KEY_TYPE				std::string
#define MAPPED_TYPE				double
#define VALUE_TYPE				ft::pair<const KEY_TYPE, MAPPED_TYPE>
#define KEY_COMPARE				ft::less<KEY_TYPE>
#define ALLOCATOR_TYPE			std::allocator<VALUE_TYPE>
#define MAKE_VALUE_TYPE(x, y)	ft::make_pair<const KEY_TYPE, MAPPED_TYPE>(x, y)
#define VEC_VALUE_TYPE			ft::vector<VALUE_TYPE, ALLOCATOR_TYPE>
#define VEC_KEY_TYPE			ft::vector<KEY_TYPE>

// --- typedef -----------------------------------------------------------------
typedef	KEY_TYPE			key_type;
typedef MAPPED_TYPE			mapped_type;
typedef VALUE_TYPE			value_type;
typedef	KEY_COMPARE			key_compare;
typedef ALLOCATOR_TYPE		allocator_type;

typedef	ft::map<			key_type, 
							mapped_type, 
							key_compare, 
							allocator_type
				>								map_km;
typedef map_km::size_type		size_type;
typedef map_km::iterator		iterator;
typedef map_km::const_iterator	const_iterator;
				
// --- globals -----------------------------------------------------------------
#define TIMEFILE			"tests/outputs/deepthought/deepthought._tmflog_general_.out"

extern std::ifstream timefile;
extern std::string	ft_nmspc;
extern std::string	std_nmspc;
extern std::string	key_map_tested;
extern std::string	key_vec_tested;
extern std::string	key_stk_tested;
extern std::string	key_t42_tested;
extern std::string	times_tested;
extern std::string	total;
extern std::string	total_nb_tests;
extern std::string	average_str;
extern std::string	rate_str;
extern std::string	key_nmspc[];
extern std::string	key_tests[];
extern std::string	av_tests[];


// --- functions ---------------------------------------------------------------
void	fill_map_with_file_values(map_km& m, const key_type& key, const mapped_type& value);
void	collect_datas_from_timefile(map_km& ft_values, map_km& std_values);
void	display_datas(const map_km& m_rate, const map_km& m_aver);
void	display_datas(const map_km& m);
void	display_datas(const map_km& m, const std::string& nmsp_key, const std::string& test_key, const std::string& cmp_key);
map_km	get_average(map_km& m, const std::string& key_nmsp, const std::string& key_test, const std::string& key_times);
void	set_average(map_km& m, const std::string& key_nmspc);
double	get_rate(double ref_value, double value_to_rate);
double	get_percent_evolving(double value);
map_km	send_average(map_km& ft_values, map_km& std_values);
map_km	set_rate(map_km& ft_values, map_km& std_values);
double	convert_clocks_to_seconds(const double& clocks);
