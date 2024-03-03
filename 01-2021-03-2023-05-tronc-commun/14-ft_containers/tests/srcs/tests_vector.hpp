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

#define	INT						int
#define	CHAR					char
#define STRING					std::string
#define TYPE					STRING

#define VALUE_TYPE				TYPE
#define ALLOCATOR_TYPE			std::allocator<VALUE_TYPE>
#define VEC_VALUE_TYPE			ft::vector<VALUE_TYPE, ALLOCATOR_TYPE>

// --- typedef -----------------------------------------------------------------

typedef	VEC_VALUE_TYPE					vec_vt;
typedef	vec_vt::iterator				iterator;
typedef	vec_vt::const_iterator			const_iterator;
typedef	vec_vt::reverse_iterator		reverse_iterator;
typedef	vec_vt::const_reverse_iterator	const_reverse_iterator;
typedef	vec_vt::value_type				value_type;
typedef	vec_vt::size_type				size_type;
typedef	vec_vt::difference_type			difference_type;
typedef	vec_vt::pointer					pointer;
typedef	vec_vt::const_pointer			const_pointer;
typedef	vec_vt::reference				reference;
typedef	vec_vt::const_reference			const_reference;

// --- globals -----------------------------------------------------------------
#define OUTFILE				"tests/outputs/logs/"NAMESPACE"_vec_compare.out"
#define TIMEFILE			"tests/outputs/logs/"NAMESPACE"_vec_time.out"
#define DETAIL_TIMEFILE		"tests/outputs/logs/"NAMESPACE"_vec_detail_time.out"


extern std::ofstream outfile;
extern std::ofstream timefile;
extern std::ofstream detail_timefile;

// --- functions ---------------------------------------------------------------

void	vector_test_iterators_manip();
void	vector_test_reverse_iterators_manip();

// --- templates ---------------------------------------------------------------
template<typename T>
T	vector_test_push_back(T &t, const typename T::value_type& val, const typename T::size_type& sz)
{
	typedef typename T::size_type	size_type;

	try 
	{
		INIT_TIMER
		START_TIMER
		for (size_type i =  0; i < sz; ++i)
		{
			t.push_back(val);
			RESET_TIMER("t.push_back(val);", detail_timefile)
		}
		END_TIMER("t.push_back(val);", detail_timefile)

		outfile << "==** \033[36mpush_back(" << val << ")\033[0m **==\n";
		display_container(t, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_pop_back(T &t, const typename T::size_type& sz)
{
	typedef typename T::size_type	size_type;

	try 
	{
		size_type	sz_2 = sz;
		INIT_TIMER
		START_TIMER
		if (t.size() < sz)
			sz_2 = t.size();
		for (size_type i =  0; i < sz_2; ++i)
		{
			t.pop_back();
			RESET_TIMER("t.pop_back();", detail_timefile)
		}
		END_TIMER("t.pop_back();", detail_timefile)

		outfile << "==** \033[36mpop_back()\033[0m **==\n";
		display_container(t, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_resize(T &t, const typename T::value_type& val, const typename T::size_type& sz)
{
	try
	{
		INIT_TIMER
		START_TIMER
		t.resize(sz, val);
		END_TIMER("t.resize(sz, val);", detail_timefile)

		outfile << "\n ==** \033[36mresize("<< sz << ", " << val << ")\033[0m **==\n";
		display_container(t, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_reserve(T &t, const typename T::size_type& sz)
{
	try
	{
		INIT_TIMER
		START_TIMER
		t.reserve(sz);
		END_TIMER("t.reserve(sz);", detail_timefile)

		outfile << "\n ==** \033[36mreserve("<< sz << ")\033[0m **==\n";
		display_container(t, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_clear(T &t)
{
	try {
		INIT_TIMER
		START_TIMER
		t.clear();
		END_TIMER("t.clear();", detail_timefile)

		outfile << "==** \033[36mclear()\033[0m **==\n";
		display_container(t, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_constructor(T &t, const typename T::value_type& val, const typename T::size_type& sz)
{
	/*
	 * What is tested?
	 * Vector default constructor
	 * Vector fill constructor
	 * Vector range constructor
	 * Vector copy constructor
	 * Vector copy assignation
	 * Vector iterators with the displaying functions
	 * Vector swap
	 * Vector relationnals operators
	 * Time checking
	 */
	try 
	{
		INIT_TIMER
		display_container(t, outfile);
		START_TIMER
		T copy1(t);
		END_TIMER("Vector, copy constructor: T copy(t)", detail_timefile)
		display_container(copy1, outfile);
		START_TIMER
		T copy2(t.begin(), t.end());
		END_TIMER("Vector, range constructor: T copy2(t.begin(), t.end())", detail_timefile)
		display_container(copy2, outfile);
		START_TIMER
		T	empty;
		END_TIMER("Vector, default constructor: T empty", detail_timefile)
		display_container(empty, outfile);
		START_TIMER
		T	full(sz, val);
		END_TIMER("Vector, fill constructor: T empty", detail_timefile)
		display_container(full, outfile);
		START_TIMER

		empty = full;
		END_TIMER("Vector, copy assignation: empty = full", detail_timefile)
		display_container(empty, outfile);
		START_TIMER
		T().swap(empty);
		END_TIMER("Vector, swap: empty is resetted", detail_timefile)
		display_container(empty, outfile);

		outfile << "\n ==** \033[36mtesting all constructors\033[0m **==\n";
		START_TIMER
		T	tmp = vector_test_push_back(copy1, val, sz);
		copy1 = tmp;
		END_TIMER("copy1 = vector_test_push_back(copy1, val, sz)", detail_timefile)
		display_container(copy1, outfile);
		display_container(t, outfile);
		test_compare_2_objects(t, copy1);
		START_TIMER
		t = copy1;
		END_TIMER("Vector copy assignation, t = copy1", detail_timefile)
		test_compare_2_objects(t, copy1);
		display_container(copy1, outfile);
		display_container(t, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_assign(T &t, const typename T::value_type& val, const typename T::size_type& sz)
{
	typedef typename T::size_type	size_type;
	try
	{
		INIT_TIMER
		START_TIMER
		t.assign(sz, val);
		END_TIMER("Vector fill assign, t.assign(sz, val);", detail_timefile)

		outfile << "\n ==** \033[36massign("<< sz << ", " << val << ")\033[0m **==\n";
		display_container(t, outfile);

		size_type	n = t.size() / 2;
		START_TIMER
		T	t2;
		RESET_TIMER("Vector default constructor", detail_timefile)

		t2.assign(t.begin(), t.begin() + n);
		END_TIMER("Vector range assign, t2.assign(t.begin(), t.begin() + n)", detail_timefile)

		outfile << "\n ==** \033[36massign("<< *(t.begin()) << ", " << *(t.begin() + n) << ")\033[0m **==\n";
		display_container(t2, outfile);
		return t2;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_erase(T &t)
{
	/*
	 * What is tested here
	 * erase(pos)
	 * erase(first, last)
	 * size()
	 * iterator the result of erase
	 * begin()
	 * end()
	 * operator+, operator-
	 * operator *
	 * operator++, operator++(int)
	 * operator--, operator--(int)
	 * operator!=
	 */
	typedef	typename T::iterator	iterator;
	try {
		INIT_TIMER
		START_TIMER
		iterator	it;
		RESET_TIMER("Vector iterator default constructor", detail_timefile)
		it = t.erase(t.begin());
		END_TIMER("Vector erase by position, t.erase(t.begin());", detail_timefile)

		outfile << "==** \033[36mt.erase(t.begin())\033[0m **==\n";
		display_container(t, outfile);
		outfile << "==** \033[36mresult it:\033[0m **==\n";
		if (it != t.end())
			print_iter(it, outfile);
		else
			outfile << "end\n";
		START_TIMER
		it = t.erase(t.begin(), t.begin() + (t.size() / 3));
		END_TIMER("Vector erase by range, t.erase(t.begin(), t.begin() + (t.size() / 3)\n vector iterator operator+)", detail_timefile)

		outfile << "==** \033[36mt.erase(t.begin(), t.begin() + (t.size() / 3))\033[0m **==\n";
		display_container(t, outfile);
		outfile << "==** \033[36mresult it:\033[0m **==\n";
		if (it != t.end())
			print_iter(it, outfile);
		else
			outfile << "end\n";

		START_TIMER
		it = t.erase(t.end() - 1);
		END_TIMER("Vector erase by range, t.erase(t.end() - 1)", detail_timefile)

		outfile << "==** \033[36mVector erase by range, t.erase(t.end() - 1)\033[0m **==\n";
		display_container(t, outfile);
		outfile << "==** \033[36mresult it:\033[0m **==\n";
		if (it != t.end())
			print_iter(it, outfile);
		else
			outfile << "end\n";

		START_TIMER
		it = t.erase((--(--(t.end()--))));
		END_TIMER("Vector erase by range, t.erase((--(--(t.end()--))))", detail_timefile)

		outfile << "==** \033[36mVector erase by range, t.erase((--(--(t.end()--))))\033[0m **==\n";
		display_container(t, outfile);
		outfile << "==** \033[36mresult it:\033[0m **==\n";
		if (it != t.end())
			print_iter(it, outfile);
		else
			outfile << "end\n";

		START_TIMER
		it = t.erase((++(++(t.begin()++))));
		END_TIMER("Vector erase by range, t.erase((++(++(t.begin()++))))", detail_timefile)
		outfile << "==** \033[36mresult it:\033[0m **==\n";
		if (it != t.end())
			print_iter(it, outfile);
		else
			outfile << "end\n";

		outfile << "==** \033[36mVector erase by range, t.erase((++(++(t.begin()++))))\033[0m **==\n";
		display_container(t, outfile);
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
T	vector_test_insert(T &t, const typename T::value_type& val, const typename T::size_type& sz)
{
	typedef typename T::size_type			size_type;
	try
	{
		INIT_TIMER
		START_TIMER
		T	test;
		RESET_TIMER("Vector default constructor", detail_timefile)
		
		test.insert(test.begin(), sz, val);
		END_TIMER("Vector fill insert, test.insert(test.begin(), sz, val)", detail_timefile)

		outfile << "\n ==** \033[36minsert(begin(), "<< sz << ", " << val << ")\033[0m **==\n";
		display_container(test, outfile);

		START_TIMER
		test.insert(test.end(), t.begin(), t.begin() + (t.size() / 3));
		END_TIMER("Vector range insert, test.insert(test.end(), t.begin(), t.begin() + (t.size() / 3))", detail_timefile)

		outfile << "\n ==** \033[36mtest.insert(test.end(), t.begin(), t.begin() + (t.size() / 3))\033[0m **==\n";
		display_container(test, outfile);

		START_TIMER

		for (size_type i = 0; i < sz; ++i)
		{
			if ((t.end() - i) < t.begin())
			{
				t.insert(t.begin(), val);
				RESET_TIMER("Vector insert, t.insert(t.end() - i, val)", detail_timefile)
			}
			else
			{
				t.insert(t.end() - i, val);
				RESET_TIMER("Vector insert, t.insert(t.end() - i, val)", detail_timefile)
			}
		}

		outfile << "\n ==** \033[36mt.insert(t.end() - i, val)\033[0m **==\n";
		display_container(t, outfile);

		return test;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
	return t;
}

template<typename T>
void	test_comp_reverse_iter(T& vec, const typename T::value_type& val)
{
	INIT_TIMER
	START_TIMER
	typename T::reverse_iterator			_it = vec.rbegin();
	RESET_TIMER("_it = vec.rbegin()", detail_timefile)
	typename T::reverse_iterator			_ft_sentinel = _it + 3;
	END_TIMER("_ft_sentinel = _it + 3", detail_timefile)
	
	try
	{
		if (_ft_sentinel != vec.rend())
		{
			outfile << "ft::vector<T>::reverse_iterator compare vec.rbegin() and vec.rbegin() + 3\n";
			test2_compare_2_objects(_it, _ft_sentinel, 1);

			*_ft_sentinel += val;
			test2_compare_2_objects(_it, _ft_sentinel, 1);
		}
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}

}


template<typename T>
void	vector_test_at(T& vec, const typename T::value_type& val)
{
	typedef typename T::size_type	size_type;

	try
	{
		INIT_TIMER
		START_TIMER
		size_type	sz = vec.size();
		RESET_TIMER("vec.size()", detail_timefile)
		for (size_type i = 0; i < sz; ++i)
		{
			vec.at(i) += val;
			RESET_TIMER("vec.at(i) += val", detail_timefile)
		}
		STOP_TIMER

		display_container(vec, outfile);

		START_TIMER
		vec.at(sz + 12); // -> Have to throw an error!
		END_TIMER("vec.at(sz + 12) // -> Have to throw an error!", detail_timefile)
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
}

template<typename T>
void	vector_test_swap(T& lhs, T& rhs)
{

	try
	{
		INIT_TIMER
		START_TIMER
		T	copy(lhs);
		RESET_TIMER("Vector copy constructor - (copy of lhs)", detail_timefile)

		lhs.swap(rhs);	
		END_TIMER("lhs.swap(rhs) - (lhs have the value of rhs and vice versa)", detail_timefile)
		display_container(copy, outfile);
		display_container(lhs, outfile);
		display_container(rhs, outfile);
		START_TIMER
		T().swap(rhs);
		END_TIMER("T().swap(rhs) - (rhs is reset, lhs keeps its value);", detail_timefile)
		display_container(copy, outfile);
		display_container(lhs, outfile);
		display_container(rhs, outfile);
		START_TIMER
		ft::swap(rhs, copy);
		END_TIMER("ft::swap(rhs, copy) - use of the extern swap with vector class, rhs hold the lhs value", detail_timefile)
		display_container(copy, outfile);
		display_container(lhs, outfile);
		display_container(rhs, outfile);
		START_TIMER
		rhs.swap(lhs);
		END_TIMER("rhs.swap(lhs) - everyone retrieves its value", detail_timefile)
		display_container(copy, outfile);
		display_container(lhs, outfile);
		display_container(rhs, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
}
