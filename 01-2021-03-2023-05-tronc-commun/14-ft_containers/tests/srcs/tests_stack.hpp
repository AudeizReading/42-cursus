#pragma once
// --- headers -----------------------------------------------------------------
#include <iostream>
#include <sstream>
#include <fstream>
#include <iomanip>
#include <string>
#include <sstream>
#include <deque>

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

#define KEY_TYPE				int
#define MAPPED_TYPE				std::string
#define VALUE_TYPE				ft::pair<const KEY_TYPE, MAPPED_TYPE>
#define KEY_COMPARE				ft::less<KEY_TYPE>
#define ALLOCATOR_TYPE			std::allocator<VALUE_TYPE>
#define MAKE_VALUE_TYPE(x, y)	ft::make_pair<const KEY_TYPE, MAPPED_TYPE>(x, y)

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

// --- globals -----------------------------------------------------------------
#define OUTFILE				"tests/outputs/logs/"NAMESPACE"_stk_compare.out"
#define TIMEFILE			"tests/outputs/logs/"NAMESPACE"_stk_time.out"
#define DETAIL_TIMEFILE		"tests/outputs/logs/"NAMESPACE"_stk_detail_time.out"
#define TREEFILE			"tests/outputs/logs/"NAMESPACE"_stk_red_black_tree.out"


extern std::ofstream outfile;
extern std::ofstream timefile;
extern std::ofstream detail_timefile;

// --- functions ---------------------------------------------------------------
map_km			make_map_clrs_with_operator_brackets();
// --- templates ---------------------------------------------------------------
template<typename T>
class MutantStack : public ft::stack<T>
{
public:
	MutantStack() {}
	MutantStack(const MutantStack<T>& src) { *this = src; }
	MutantStack<T>& operator=(const MutantStack<T>& rhs) 
	{
		this->c = rhs.c;
		return *this;
	}
	~MutantStack() {}

	typedef typename ft::stack<T>::container_type::iterator			iterator;
	typedef typename ft::stack<T>::container_type::const_iterator	const_iterator;
	typedef typename ft::stack<T>::container_type::reverse_iterator	reverse_iterator;
	typedef typename ft::stack<T>::container_type::const_reverse_iterator	const_reverse_iterator;

	iterator begin() { return this->c.begin(); }
	iterator end() { return this->c.end(); }
	reverse_iterator rbegin() { return this->c.rbegin(); }
	reverse_iterator rend() { return this->c.rend(); }

	const_iterator begin() const { return this->c.begin(); }
	const_iterator end() const { return this->c.end(); }
	const_reverse_iterator rbegin() const { return this->c.rbegin(); }
	const_reverse_iterator rend() const { return this->c.rend(); }

};

