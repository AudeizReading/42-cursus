#pragma once

// --- headers -----------------------------------------------------------------
#include <iostream>
#include <sstream>
#include <fstream>
#include <iomanip>
#include <string>
#include <sstream>
#include <deque>

#ifdef STD //CREATE A REAL STL EXAMPLE
	#include <map>
	#include <stack>
	#include <vector>
	namespace ft = std;
#else
	#include <map.hpp>
	#include <stack.hpp>
	#include <vector.hpp>
#endif

#include <stdlib.h>

#include <tests_containers_utils.hpp>
#include <display_utils.hpp>
#include <timer_utils.hpp>
#include <utils.hpp>

// --- define ------------------------------------------------------------------
#define MAX_RAM 4294967296
#define BUFFER_SIZE 4096
#define COUNT (MAX_RAM / (int)sizeof(Buffer))

#define KEY_TYPE				int
#define MAPPED_TYPE				std::string
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
typedef VEC_VALUE_TYPE		vec_vt; // (vector of value_type)
typedef	VEC_KEY_TYPE		vec_key;
typedef	map_km::const_iterator						mci;

typedef struct Buffer
{
	int idx;
	char buff[BUFFER_SIZE];
}	t_Buffer;

// --- globals -----------------------------------------------------------------
#define OUTFILE				"tests/outputs/logs/"NAMESPACE"_t42_compare.out"
#define TIMEFILE			"tests/outputs/logs/"NAMESPACE"_t42_time.out"
#define DETAIL_TIMEFILE		"tests/outputs/logs/"NAMESPACE"_t42_detail_time.out"

#define TREEFILE			"tests/outputs/logs/"NAMESPACE"_map_red_black_tree.out"
extern std::ofstream outfile;
extern std::ofstream timefile;
extern std::ofstream detail_timefile;
extern std::ofstream treefile;

// --- functions ---------------------------------------------------------------
void			make_stress_vec_of_map_km(map_km& m);
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
	typedef typename ft::stack<T>::container_type::const_iterator	const_reverse_iterator;

	iterator begin() { return this->c.begin(); }
	iterator end() { return this->c.end(); }
};

