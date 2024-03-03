#pragma once

#include <iostream>
#include <ctime>

#include <display_utils.hpp>
#include <timer_utils.hpp>

extern std::ofstream detail_timefile;
extern std::ofstream outfile;

template<typename Cont>
clock_t	test_empty_copy_constructor()
{
	outfile << "   container type: " << typeid(Cont).name() << std::endl;

	INIT_TIMER
	START_TIMER

	Cont				cont1;

	RESET_TIMER("Empty default constructor: Cont cont1", detail_timefile)

	Cont				cont2(cont1);

	RESET_TIMER("Empty copy constructor: Cont cont2(cont1)", detail_timefile)

	Cont				cont3(cont2);

	RESET_TIMER("Empty copy constructor: Cont cont3(cont2)", detail_timefile)

	cont3 = cont1;

	END_TIMER("Empty copy assignment: cont3 = cont1", detail_timefile)

	outfile << "cont1\n";
	display_container(cont1, outfile);
	outfile << "cont2\n";
	display_container(cont2, outfile);
	outfile << "cont3\n";
	display_container(cont3, outfile);
	return timer;
}

template<typename Cont>
clock_t	test_copy_constructor(Cont& cont)
{
	outfile << "   container type: " << typeid(Cont).name() << std::endl;

	INIT_TIMER
	START_TIMER

	Cont				cont1(cont);

	RESET_TIMER("Full copy constructor: Cont cont1(cont)", detail_timefile)

	Cont				cont2;

	RESET_TIMER("Empty default constructor: Cont cont2", detail_timefile)

	Cont				cont3(cont2);

	RESET_TIMER("Empty copy constructor: Cont cont3(cont2)", detail_timefile)

	cont3 = cont1;

	END_TIMER("Empty copy assignment: cont3 = cont1)", detail_timefile)

	outfile << "cont1\n";
	display_container(cont1, outfile);
	outfile << "cont2\n";
	display_container(cont2, outfile);
	outfile << "cont3\n";
	display_container(cont3, outfile);
	return timer;
}

template <typename T1, typename T2>
void test_compare_2_objects(const T1 &first, const T2 &second, const bool redo = 1)
{
	static int i = 0;

	outfile << "[" << i++ << "]   container type: " << typeid(T1).name() << std::endl;
	outfile << "   container type: " << typeid(T1).name() << std::endl;
	outfile << std::boolalpha;

	INIT_TIMER
	START_TIMER

	outfile << "\tfirst == second: " << (first == second) << std::endl;

	RESET_TIMER("Empty copy constructor: first == second", detail_timefile)

	outfile << "\tfirst != second: " << (first != second) << std::endl;

	RESET_TIMER("Empty copy constructor: first != second", detail_timefile)

	outfile << "\tfirst <  second: " << (first < second) << std::endl;

	RESET_TIMER("Empty copy constructor: first <  second", detail_timefile)

	outfile << "\tfirst <= second: " << (first <= second) << std::endl;

	RESET_TIMER("Empty copy constructor: first <= second", detail_timefile)

	outfile << "\tfirst >  second: " << (first > second) << std::endl;

	RESET_TIMER("Empty copy constructor: first >  second", detail_timefile)

	outfile << "\tfirst >= second: " << (first >= second) << std::endl;

	END_TIMER("Empty copy constructor: first >= second", detail_timefile)

//	outfile << "first\n";
//	display_container(first, outfile);
//	outfile << "second\n";
//	display_container(second, outfile);
	outfile << "\n";
	if (redo)
	{
		outfile << "redo";
		--i;
		test_compare_2_objects(second, first, 0);
	}
}

template <typename T1, typename T2>
void test2_compare_2_objects(const T1 &first, const T2 &second, const bool redo = 1)
{
	static int i = 0;

	INIT_TIMER
	START_TIMER
	outfile << "[" << i++ << "]   container type: " << typeid(T1).name() << std::endl;
	outfile << std::boolalpha;
	outfile << "\t" << *first << " == " << *second << ": " << (first == second) << "\n";
	outfile << "\t" << *first << " != " << *second << ": " << (first != second) << "\n";
	outfile << "\t" << *first << " <  " << *second << ": " << (first < second) << "\n";
	outfile << "\t" << *first << " <= " << *second << ": " << (first <= second) << "\n";
	outfile << "\t" << *first << " >  " << *second << ": " << (first > second) << "\n";
	outfile << "\t" << *first << " >= " << *second << ": " << (first >= second) << "\n";
	END_TIMER("Relational operators", detail_timefile)
	if (redo)
	{
		--i;
		test2_compare_2_objects(second, first, 0);
	}
}

// obj: whatever custom class who has operator== and operator< defined for
// is_empty: is the obj argument empty, sometimes we cannot check this by comparing value or adress (without SEGV), you would set an empty obj to a zero value, but what's happened if the value of the non empty obj is to be zero ? and if the obj is empty we cannot have a true answer to the second_eq_test and second_lt_test, btw leaving this a true with a empty obj shall be useful for checking the reverse way
template<typename T>
bool test_rel_ops(T& obj, bool debug = false) // Scream if I set the param as const, unexpected behavior with a non empty std::vector<int> all are equivalent...
{
	INIT_TIMER
	START_TIMER

	T		copy(obj);

	RESET_TIMER("Full copy constructor: T copy(obj)", detail_timefile)

	T		empty;

	RESET_TIMER("empty default constructor: T empty", detail_timefile)

	bool	first_eq_test  = false;
	bool	second_eq_test = false;
	bool	first_lt_test  = false;
	bool	second_lt_test = false;

	first_eq_test = (copy == obj && obj == copy &&
					!(copy != obj) && !(obj != copy));
	RESET_TIMER("relational operators: (copy == obj && obj == copy &&\n!(copy != obj) && !(obj != copy))", detail_timefile)
	if (debug && !first_eq_test)
	{
		PRINT((copy == obj));
		PRINT((obj == copy));
		PRINT((!(copy != obj)));
		PRINT((!(obj != copy)));
	}

	first_lt_test = (!(copy < obj) && !(obj < copy) &&
					(copy <= obj) && (obj <= copy) &&
					(copy >= obj) && (obj >= copy));
	RESET_TIMER("relational operators: (!(copy < obj) && !(obj < copy) &&\n(copy <= obj) && (obj <= copy) &&\n(copy >= obj) && (obj >= copy))", detail_timefile)
	if (debug && !first_lt_test)
	{
		PRINT((!(copy < obj)));
		PRINT((!(obj < copy)));
		PRINT((copy <= obj));
		PRINT((obj <= copy));
		PRINT((copy >= obj));
		PRINT((obj >= copy));
		PRINT((copy < obj));
		PRINT((copy > obj));
		PRINT((obj < copy));
		PRINT((obj > copy));
	}

	second_eq_test = (empty != obj && obj != empty &&
					!(empty == obj) && !(obj == empty));
	RESET_TIMER("relational operators: (empty != obj && obj != empty &&\n!(empty == obj) && !(obj == empty))", detail_timefile)
	if (debug && !second_eq_test)
	{
		PRINT((empty != obj));
		PRINT((obj != empty));
		PRINT((!(empty == obj)));
		PRINT((!(obj == empty)));
	}

	second_lt_test = ((empty < obj) && !(obj < empty) &&
					!(empty > obj) && (obj > empty) &&
					(empty <= obj) && !(obj <= empty) &&
					!(empty >= obj) && (obj >= empty));
	RESET_TIMER("relational operators: ((empty < obj) && !(obj < empty) &&\n!(empty > obj) && (obj > empty) &&\n(empty <= obj) && !(obj <= empty) &&\n!(empty >= obj) && (obj >= empty))", detail_timefile)
	if (debug && !second_lt_test)
	{
		PRINT((empty <= obj));
		PRINT((obj <= empty));
		PRINT((empty >= obj));
		PRINT((obj >= empty));
		PRINT((empty < obj));
		PRINT((empty > obj));
		PRINT((obj < empty));
		PRINT((obj > empty));
		PRINT(!(empty <= obj));
		PRINT(!(obj <= empty));
		PRINT(!(empty >= obj));
		PRINT(!(obj >= empty));
		PRINT(!(empty < obj));
		PRINT(!(empty > obj));
		PRINT(!(obj < empty));
		PRINT(!(obj > empty));
	}

	return (first_eq_test && second_eq_test &&
			first_lt_test && second_lt_test);
}

template <typename T1, typename T2>
void	test_swap(T1 x, T2 y)
{
	INIT_TIMER
	START_TIMER

	x.swap(y);

	END_TIMER("Map x.swap(y)", detail_timefile)

	outfile << "x apres swap:\n";
	display_container(x, outfile);
	outfile << "y apres swap:\n";
	display_container(y, outfile);
}

template<typename Cont, typename Index>
void	test_associative_operator_brackets(Cont& cont, const Index& index, ft::bidirectional_iterator_tag)
{
	INIT_TIMER
	START_TIMER
	typename Cont::iterator	it = cont.find(index);
	if (it != cont.end())
		outfile << "test operator[] cont[" << index << "]: " << cont[index] << "\n";
	else
		outfile << "test operator[] cont[" << index << "]: is not found inside container\n";
	END_TIMER("cont.find(index), cont[index]", detail_timefile)
}
