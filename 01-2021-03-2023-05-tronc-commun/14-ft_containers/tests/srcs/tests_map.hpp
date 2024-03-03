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

typedef struct s_clrs
{
	const KEY_TYPE	key;
	MAPPED_TYPE		value;
}	t_clrs;


// --- globals -----------------------------------------------------------------
#define OUTFILE				"tests/outputs/logs/"NAMESPACE"_map_compare.out"
#define TIMEFILE			"tests/outputs/logs/"NAMESPACE"_map_time.out"
#define DETAIL_TIMEFILE		"tests/outputs/logs/"NAMESPACE"_map_detail_time.out"

#define TREEFILE			"tests/outputs/logs/"NAMESPACE"_map_red_black_tree.out"

extern std::ofstream treefile;
extern std::ofstream outfile;
extern std::ofstream timefile;
extern std::ofstream detail_timefile;

// --- functions ---------------------------------------------------------------
void			push_back_pair_km(vec_vt& vec, key_type key, mapped_type value);
vec_vt			make_vector_of_pair_clrs_push_back();
vec_vt			make_vector_of_pair_size_n(size_t n, mapped_type& unic_value);
map_km			make_stress_map_km(map_km& m, size_t n, mapped_type mv);
void			make_stress_vec_of_map_km(map_km& m);
void			make_full_stress(map_km& m);
map_km			make_map_clrs_with_operator_brackets();
map_km			map_test_insert_value_type();
map_km			map_test_insert_range();
std::ostream&	map_test_insert_pos(map_km& m, vec_vt& v, std::ostream& o);
void			map_test_erase_range(map_km& m, size_t n);
void			map_test_erase_by_odd_key(map_km& m);
void			map_test_erase_by_position(map_km& m);
map_km			map_test_multi_erase(size_t n, mapped_type& unic_value);
void			test_ope_rel_from_mli_tester();
void			test_erase_from_mli_tester();

// --- templates ---------------------------------------------------------------
//
// lower_bound, upper_bound, equal_range, count, find
template<typename Cont, typename Iter>
std::ostream&	test_lower_upper_bound(Cont& cont, const typename Cont::key_type& key, std::ostream& o)
{
	INIT_TIMER
	START_TIMER
	Iter						low = cont.lower_bound(key);
	RESET_TIMER("lower_bound", detail_timefile);
	Iter						up = cont.upper_bound(key);
	RESET_TIMER("upper_bound", detail_timefile);
	ft::pair<Iter, Iter>		p = cont.equal_range(key);
	RESET_TIMER("equal_range", detail_timefile);
	typename Cont::size_type	s = cont.count(key);
	RESET_TIMER("count", detail_timefile);
	Iter						it = cont.find(key);
	END_TIMER("find", detail_timefile);

	o.precision(10);
	o << std::fixed;

	o << "== START LOW / UP / EQUAL / FIND / COUNT TESTS ==\n[" << key << "]\n";
	o << "LOWER_BOUND\n";
	if (low != cont.end())
	{
		print_associative_iter(low, o);
	}
	else
	{
		o << "lower_bound not found\n";
	}

	o << "UPPER_BOUND\n";
	if (up != cont.end())
	{
		print_associative_iter(up, o);
	}
	else
	{
		o << "upper_bound not found\n";
	}

	o << "EQUAL_RANGE && COUNT [" << s << "]\n";
	if (s != 0 || (p.first != cont.end() && p.second != cont.end()))
	{
		o << "equal_range.first (low): ";
		print_associative_iter(p.first, o);
		o << "equal_range.second (up): ";
		if (p.second != cont.end())
		{
			print_associative_iter(p.second, o);
		}
		else
		{
			o << "not_found\n";
		}
	}
	else
	{
		o << "equal_range not found\n";
	}

	o << "FIND && COUNT [" << s << "]\n";
	if (it != cont.end())
	{
		print_associative_iter(it, o);
	}
	else
	{
		o << "find not found\n";
	}

	o << "== END LOW / UP / EQUAL / FIND / COUNT TESTS ==\n\n";
	return o;
}

template<typename Cont, typename Iter>
std::ostream&	test_update_mapped_type_values(Cont& cont, const typename Cont::mapped_type& value, std::ostream& o = std::cout)
{
	INIT_TIMER
	START_TIMER

	Iter							begin = cont.begin();

	RESET_TIMER("iterator default constructor\ncont.begin()", detail_timefile)

	typename Cont::const_iterator	end = cont.end();

	RESET_TIMER("const iterator default constructor\ncont.end()", detail_timefile)

	Iter							it = begin;

	RESET_TIMER("iterator operator=", detail_timefile)

	for (; it != end; ++it)
	{
		RESET_TIMER("iterator operator!=, operator++", detail_timefile)
		o << "[before it->second = value]: ";
		print_associative_iter(it, o);
		it->second = value;
		RESET_TIMER("iterator operator->, it->second = value", detail_timefile)
		o << "[after  it->second = value]: ";
		print_associative_iter(it, o);
	}
	END_TIMER("iterator operator!=, operator++", detail_timefile)
	return o;
}

template<typename Cont>
std::ostream&	test_add_mapped_type_value(Cont& cont, const typename Cont::key_type& key, const typename Cont::mapped_type& value, std::ostream& o = std::cout)
{
	INIT_TIMER
	START_TIMER

	typename Cont::const_iterator	end = cont.end();

	RESET_TIMER("const iterator default constructor\ncont.end()", detail_timefile)

	typename Cont::iterator			it = cont.find(key);

	RESET_TIMER("iterator default constructor\ncont.find(key)", detail_timefile)

	if (it != end)
	{
		RESET_TIMER("comparing iterator and const iterator, operator !=", detail_timefile)
		o << "[before it->second += value]: ";
		print_associative_iter(it, o);
		it->second += value;
		RESET_TIMER("iterator operator->, it->second += value", detail_timefile)
		o << "[after  it->second += value]: ";
		print_associative_iter(it, o);
	}
	else
	{
		o << "[" << key << "] has not been found inside the container\n";
	}
	END_TIMER("comparing iterator and const iterator, operator !=", detail_timefile)
	return o;
}

//test_add_mapped_type_value(cont, 84, std::string(" You have been jinxed!"));
template<typename Cont>
std::ostream&	test_jinx_mapped_type_values(Cont& cont, const typename Cont::mapped_type& value, std::ostream& o = std::cout)
{
	INIT_TIMER
	START_TIMER

	typedef typename Cont::iterator			iterator;

	RESET_TIMER("iterator default constructor", detail_timefile)

	typedef typename Cont::const_iterator	const_iterator;

	RESET_TIMER("const iterator default constructor", detail_timefile)
	
	const_iterator	end = cont.end();

	RESET_TIMER("const iterator assignation, cont.begin()", detail_timefile)
	
	iterator		it = cont.begin();

	RESET_TIMER("iterator default assignation, cont.end()", detail_timefile)


	for (; it != end; it++)
	{
		RESET_TIMER("comparing iterator and const iterator, operator !=, operator++(int)", detail_timefile)
		test_add_mapped_type_value(cont, it->first, value, o);
	}
	END_TIMER("comparing iterator and const iterator, operator !=, operator++(int)", detail_timefile)
	return o;
}

template<typename Cont>
std::ostream&	map_test_low_up_equal_count_find(Cont& cont, std::ostream& o = std::cout)
{
	/*
	 * What is tested here:
	 * lower_bound iterator && const_iterator
	 * upper_bound iterator && const_iterator
	 * equal_range iterator && const_iterator
	 * find iterator && const_iterator
	 * count size_type
	 * assigning the value of the it->second elt
	 * comparaison between iterator and const_iterator
	 * ++iterator
	 */
	typedef typename Cont::iterator					iterator;
	typedef typename Cont::const_iterator			const_iterator;
	typedef typename Cont::key_type					key_type;

	key_type keys[] = {26, 4, 2, 3, 18, 110, 22, 32, 34, 47};
	int size = get_arr_width(keys);

	o << "\nVersion iterator:\n";
	for (int i = 0; i < size; ++i)
	{
		test_lower_upper_bound<Cont, iterator>(cont, keys[i], o);
	}

	o << "\nVersion const_iterator:\n";
	for (int i = 0; i < size; ++i)
	{
		test_lower_upper_bound<Cont, const_iterator>(cont, keys[i], o);
	}

	return o;
}
// lower_bound, upper_bound, equal_range, count, find
