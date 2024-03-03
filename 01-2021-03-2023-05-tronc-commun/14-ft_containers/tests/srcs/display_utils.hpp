#pragma once

#include <iostream>
#include <sstream>
#include <string>

#ifdef STD
	#include <iterator>
	namespace ft = std;
# define NAMESPACE "STD"
#else
	#include <iterator_types.hpp>
# define NAMESPACE "FT"
#endif

#include <timer_utils.hpp>

#define BG_BLACK		"40"
#define BG_RED			"41"
#define BG_GREEN		"42"
#define BG_YELLOW		"43"
#define BG_BLUE			"44"
#define BG_FUSCHIA		"45"
#define BG_CYAN			"46"
#define BG_WHITE		"47"
#define BLACK(x, bg)	"\033[30;"bg"m"x"\033[0m"
#define RED(x, bg)		"\033[31;"bg"m"x"\033[0m"
#define GREEN(x, bg)	"\033[32;"bg"m"x"\033[0m"
#define YELLOW(x, bg)	"\033[33;"bg"m"x"\033[0m"
#define BLUE(x, bg)		"\033[34;"bg"m"x"\033[0m"
#define FUSCHIA(x, bg)	"\033[35;"bg"m"x"\033[0m"
#define CYAN(x, bg)		"\033[36;"bg"m"x"\033[0m"
#define WHITE(x, bg)	"\033[37;"bg"m"x"\033[0m"
#define RESET(x)		"\033[0m"x"\033[0m"
#define DISPLAY(x)		std::cout << std::boolalpha << x << std::endl;

#define PRINT(x)		std::cout << std::boolalpha << "\nin " << __FILE__ << ":" << __LINE__ << "\n"<< __func__ << ": " << #x << "\n" << x << std::endl;

extern std::ofstream outfile;
extern std::ofstream detail_timefile;

// std::cout version
template<typename Iter>
void	print_iter(Iter& i)
{
	std::cout << "Value: ["<< *i << "]\n";
}

template<typename Iter>
void	print_associative_iter(Iter& it)
{
	std::cout << "Key: [" << it->first << "]\n";
	std::cout << "Value: {" << it->second << "}\033[0m\n";
	std::cout << "================================================================================\n";
}

template<typename Cont>
void	print_container_statistics(Cont& c)
{
	/*
	 * What is tested here:
	 * container type
	 * value type
	 * allocator type
	 * size type
	 * difference type
	 * max_size
	 * size
	 * empty
	 */
	typedef			  Cont								cont;
	std::cout << "=== CONTAINER STATISTICS =======================================================" << std::endl;
	std::cout << std::endl;
	std::cout << "   container type: " << typeid(cont).name() << std::endl;
	std::cout << "       value type: " << typeid(typename cont::value_type).name() << std::endl;
	std::cout << "   allocator type: " << typeid(c.get_allocator()).name() << std::endl;
	std::cout << "        size type: " << typeid(typename cont::size_type).name() << std::endl;
	std::cout << "  difference type: " << typeid(typename cont::difference_type).name() << std::endl;
	std::cout << std::endl;
	std::cout << "         max_size: " << c.max_size() << std::endl;
	std::cout << "             size: " << c.size() << std::endl;
	std::cout << "         is empty: " << std::boolalpha << c.empty() << std::endl;
	std::cout << std::endl;
}

template<typename Cont>
void	print_iterator_traits(Cont&)
{
	/*
	 * What is tested here:
	 * Cont::iterator
	 * iterator::iterator_category
	 * iterator::value_type
	 * iterator::difference_type
	 * iterator::pointer
	 * iterator::reference
	 * Cont::const_iterator
	 * const_iterator::iterator_category
	 * const_iterator::value_type
	 * const_iterator::difference_type
	 * const_iterator::pointer
	 * const_iterator::reference
	 */
	typedef typename Cont::iterator						iterator;
	typedef typename iterator::iterator_category		iterator_category;
	typedef typename iterator::value_type				value_type;
	typedef typename iterator::difference_type			difference_type;
	typedef typename iterator::pointer					pointer;
	typedef typename iterator::reference				reference;

	typedef typename Cont::const_iterator				const_iterator;
	typedef typename const_iterator::iterator_category	const_iterator_category;
	typedef typename const_iterator::value_type			const_value_type;
	typedef typename const_iterator::difference_type	const_difference_type;
	typedef typename const_iterator::pointer			const_pointer;
	typedef typename const_iterator::reference			const_reference;

	std::cout << "=== BEGIN ITERATOR_TRAITS ======================================================" << std::endl;
	std::cout << std::endl;
	std::cout << "         iterator: " << typeid(iterator).name() << std::endl;
	std::cout << "iterator_category: " << typeid(iterator_category).name() << std::endl;
	std::cout << "       value_type: " << typeid(value_type).name() << std::endl;
	std::cout << "  difference_type: " << typeid(difference_type).name() << std::endl;
	std::cout << "          pointer: " << typeid(pointer).name() << std::endl;
	std::cout << "        reference: " << typeid(reference).name() << std::endl;
	std::cout << "--------------------------------------------------------------------------------" << std::endl;
	std::cout << std::endl;

	std::cout << "   const_iterator: " << typeid(const_iterator).name() << std::endl;
	std::cout << "iterator_category: " << typeid(const_iterator_category).name() << std::endl;
	std::cout << "       value_type: " << typeid(const_value_type).name() << std::endl;
	std::cout << "  difference_type: " << typeid(const_difference_type).name() << std::endl;
	std::cout << "          pointer: " << typeid(const_pointer).name() << std::endl;
	std::cout << "        reference: " << typeid(const_reference).name() << std::endl;
	std::cout << std::endl;
	std::cout << "===== END ITERATOR_TRAITS ======================================================" << std::endl;
	std::cout << std::endl;
}

template<typename Cont>
void	print_reverse_iterator_traits(Cont&)
{
	/*
	 * What is tested here:
	 * Cont::reverse_iterator
	 * reverse_iterator::iterator_category
	 * reverse_iterator::value_type
	 * reverse_iterator::difference_type
	 * reverse_iterator::pointer
	 * reverse_iterator::reference
	 * Cont::const_reverse_iterator
	 * const_reverse_iterator::iterator_category
	 * const_reverse_iterator::value_type
	 * const_reverse_iterator::difference_type
	 * const_reverse_iterator::pointer
	 * const_reverse_iterator::reference
	 */
	typedef typename Cont::reverse_iterator						reverse_iterator;
	typedef typename reverse_iterator::iterator_category		reverse_iterator_category;
	typedef typename reverse_iterator::value_type				reverse_value_type;
	typedef typename reverse_iterator::difference_type			reverse_difference_type;
	typedef typename reverse_iterator::pointer					reverse_pointer;
	typedef typename reverse_iterator::reference				reverse_reference;

	typedef typename Cont::const_reverse_iterator				const_reverse_iterator;
	typedef typename const_reverse_iterator::iterator_category	const_reverse_iterator_category;
	typedef typename const_reverse_iterator::value_type			const_reverse_value_type;
	typedef typename const_reverse_iterator::difference_type	const_reverse_difference_type;
	typedef typename const_reverse_iterator::pointer			const_reverse_pointer;
	typedef typename const_reverse_iterator::reference			const_reverse_reference;

	std::cout << "=== BEGIN REVERSE_ITERATOR_TRAITS ==============================================" << std::endl;
	std::cout << std::endl;
	std::cout << "         iterator: " << typeid(reverse_iterator).name() << std::endl;
	std::cout << "iterator_category: " << typeid(reverse_iterator_category).name() << std::endl;
	std::cout << "       value_type: " << typeid(reverse_value_type).name() << std::endl;
	std::cout << "  difference_type: " << typeid(reverse_difference_type).name() << std::endl;
	std::cout << "          pointer: " << typeid(reverse_pointer).name() << std::endl;
	std::cout << "        reference: " << typeid(reverse_reference).name() << std::endl;
	std::cout << "--------------------------------------------------------------------------------" << std::endl;
	std::cout << std::endl;

	std::cout << "   const_iterator: " << typeid(const_reverse_iterator).name() << std::endl;
	std::cout << "iterator_category: " << typeid(const_reverse_iterator_category).name() << std::endl;
	std::cout << "       value_type: " << typeid(const_reverse_value_type).name() << std::endl;
	std::cout << "  difference_type: " << typeid(const_reverse_difference_type).name() << std::endl;
	std::cout << "          pointer: " << typeid(const_reverse_pointer).name() << std::endl;
	std::cout << "        reference: " << typeid(const_reverse_reference).name() << std::endl;
	std::cout << std::endl;
	std::cout << "===== END REVERSE_ITERATOR_TRAITS ==============================================" << std::endl;
	std::cout << std::endl;
}

template<typename Cont, typename Iter>
void	print_range_iterator(Cont& c, Iter first, Iter last, ft::random_access_iterator_tag)
{
	/*
	 * What is tested here:
	 * random_access_iterator_tag
	 * iterator operator=
	 * iterator operator*
	 * iterator operator==
	 * iterator operator!=
	 * iterator operator++
	 * iterator operator--
	 * container.end()
	 */
	Iter it = first;

	if (first == last && last == c.end())
		return;
	std::cout << "NORMAL ITERATORS                                             " << std::endl;
	std::cout << "              - FIRST to LAST -              " << std::endl;

	for (;it != last; ++it)
	{
		std::cout << "Value: [" << *it << "]\t" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << std::endl;
	std::cout << "               - LAST to FIRST -             " << std::endl;
	it = last;
	--it;

	for (;it != first; --it)
	{
		std::cout << "Value: [" << *it << "]\t" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << "Value: [" << *it << "]\t" << std::endl;
	std::cout << std::endl;
}

template<typename Cont, typename RevIter>
void	print_range_reverse_iterator(Cont& c, RevIter first, RevIter last, ft::random_access_iterator_tag)
{
	/*
	 * What is tested here:
	 * random_access_iterator_tag
	 * reverse_iterator operator=
	 * reverse_iterator operator*
	 * reverse_iterator operator==
	 * reverse_iterator operator!=
	 * reverse_iterator operator++
	 * reverse_iterator operator--
	 * container.end()
	 */

	RevIter it = first;

	if (first == last && last == c.rend())
		return;
	std::cout << "REVERSE ITERATORS                                            " << std::endl;
	std::cout << "              - FIRST to LAST -              " << std::endl;
	for (;it != last; ++it)
	{
		std::cout << "Value: [" << *it << "]\t" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << std::endl;
	std::cout << "               - LAST to FIRST -             " << std::endl;
	it = last;
	--it;
	for (;it != first; --it)
	{
		std::cout << "Value: [" << *it << "]\t" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << "Value: [" << *it << "]\t" << std::endl;
	std::cout << std::endl;
}

template<typename Cont, typename Iter>
void	print_range_iterator(Cont& c, Iter first, Iter last, ft::bidirectional_iterator_tag)
{
	/*
	 * What is tested here:
	 * bidirectional_iterator_tag
	 * iterator operator=
	 * iterator operator*
	 * iterator operator==
	 * iterator operator!=
	 * iterator operator++
	 * iterator operator--
	 * container.end()
	 */

	Iter it = first;

	if (first == last && last == c.end())
		return;
	std::cout << "NORMAL ITERATORS                                             " << std::endl;
	std::cout << "              - FIRST to LAST -              " << std::endl;

	for (;it != last; ++it)
	{
		std::cout << "Key: [" << it->first << "]\t";
		std::cout << "Value: {" << it->second << "}\033[0m\n" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << std::endl;
	std::cout << "               - LAST to FIRST -             " << std::endl;
	it = last;
	--it;

	for (;it != first; --it)
	{
		std::cout << "Key: [" << it->first << "]\t";
		std::cout << "Value: {" << it->second << "}\033[0m\n" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << "Key: [" << it->first << "]\t";
	std::cout << "Value: {" << it->second << "}\033[0m\n" << std::endl;
	std::cout << std::endl;
}

template<typename Cont, typename RevIter>
void	print_range_reverse_iterator(Cont& c, RevIter first, RevIter last, ft::bidirectional_iterator_tag)
{
	/*
	 * What is tested here:
	 * bidirectional_iterator_tag
	 * reverse_iterator operator=
	 * reverse_iterator operator*
	 * reverse_iterator operator==
	 * reverse_iterator operator!=
	 * reverse_iterator operator++
	 * reverse_iterator operator--
	 * container.end()
	 */

	RevIter it = first;

	if (first == last && last == c.rend())
		return;
	std::cout << "REVERSE ITERATORS                                            " << std::endl;
	std::cout << "              - FIRST to LAST -              " << std::endl;
	for (;it != last; ++it)
	{
		std::cout << "Key: [" << it->first << "]\t";
		std::cout << "Value: {" << it->second << "}\033[0m" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << std::endl;
	std::cout << "               - LAST to FIRST -             " << std::endl;
	it = last;
	--it;
	for (;it != first; --it)
	{
		std::cout << "Key: [" << it->first << "]\t";
		std::cout << "Value: {" << it->second << "}\033[0m" << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      |                      " << std::endl;
		std::cout << "                      V                      " << std::endl;
	}
	std::cout << "Key: [" << it->first << "]\t";
	std::cout << "Value: {" << it->second << "}\033[0m" << std::endl;
	std::cout << std::endl;
}

// ostream version
template<typename Iter>
std::ostream&	print_iter(Iter& i, std::ostream& o)
{
	o << "Value: ["<< *i << "]\n";
	return o;
}

template<typename Iter>
std::ostream&	print_associative_iter(Iter& it, std::ostream& o)
{
	o << "Key: [" << it->first << "]\t";
	o << "Value: {" << it->second << "}\033[0m\n";
	return o;
}

template<typename Cont> // stack
std::ostream&	print_container_statistics(Cont& c, std::ostream& o)
{
	/*
	 * What is tested here: (stack)
	 * container type
	 * value type
	 * size type
	 * size
	 * empty
	 */
	typedef			  Cont								cont;
	o << "NAMESPACE: " << NAMESPACE << std::endl;
	o << "=== CONTAINER STATISTICS =======================================================" << std::endl;
	o << std::endl;
	o << "   container type: " << typeid(cont).name() << std::endl;
	o << "       value type: " << typeid(typename cont::value_type).name() << std::endl;
	o << "        size type: " << typeid(typename cont::size_type).name() << std::endl;
	o << std::endl;
	INIT_TIMER
	START_TIMER
	o << "             size: " << c.size() << std::endl;
	RESET_TIMER("size", detail_timefile)
	o << "         is empty: " << std::boolalpha << c.empty() << std::endl;
	END_TIMER("empty", detail_timefile)
/*	if (!c.empty() && c.size() > 0)
	{
		o << "       top (back): " << c.top() << std::endl;
		RESET_TIMER("top (back)", detail_timefile)
		o << "       top (back): " << const_cast<const typename cont::value_type>(c.top()) << std::endl;
		END_TIMER("top (back) const_cast", detail_timefile)
	}*/
	o << std::endl;
	return o;
}

template<typename T, typename Alloc>
std::ostream&	print_container_statistics(ft::vector<T, Alloc>& c, std::ostream& o)
{
	/*
	 * What is tested here: (vector)
	 * container type
	 * value type
	 * allocator type
	 * size type
	 * difference type
	 * max_size
	 * capacity
	 * size
	 * empty
	 */
	typedef			  ft::vector<T, Alloc>								cont;
	o << "NAMESPACE: " << NAMESPACE << std::endl;
	o << "=== CONTAINER STATISTICS =======================================================" << std::endl;
	o << std::endl;
	o << "   container type: " << typeid(cont).name() << std::endl;
	o << "       value type: " << typeid(typename cont::value_type).name() << std::endl;
	INIT_TIMER
	START_TIMER
	o << "   allocator type: " << typeid(c.get_allocator()).name() << std::endl;
	RESET_TIMER("get_allocator", detail_timefile)
	o << "        size type: " << typeid(typename cont::size_type).name() << std::endl;
	o << "  difference type: " << typeid(typename cont::difference_type).name() << std::endl;
	o << std::endl;
	o << "         max_size: " << c.max_size() << std::endl;
	RESET_TIMER("max_size", detail_timefile)
	o << "         capacity: " << c.capacity() << std::endl;
	RESET_TIMER("capacity", detail_timefile)
	o << "             size: " << c.size() << std::endl;
	RESET_TIMER("size", detail_timefile)
	o << "         is empty: " << std::boolalpha << c.empty() << std::endl;
	RESET_TIMER("empty", detail_timefile)
	if (!c.empty() && c.size() > 0)
	{
		o << "            front: " << c.front() << std::endl;
		RESET_TIMER("front", detail_timefile)
		o << "             back: " << c.back() << std::endl;
		END_TIMER("back", detail_timefile)
	}
	o << std::endl;
	return o;
}

template<typename Key, typename Mapped, typename Cmp, typename Allocator>
std::ostream&	print_container_statistics(ft::map<Key, Mapped, Cmp, Allocator>& c, std::ostream& o)
{
	/*
	 * What is tested here:
	 * container type
	 * key_type
	 * mapped_type
	 * value type
	 * allocator type
	 * size type
	 * difference type
	 * key_comp
	 * value_comp
	 * max_size
	 * size
	 * empty
	 */
	typedef			  ft::map<Key, Mapped, Cmp, Allocator>								cont;
	o << "NAMESPACE: " << NAMESPACE << std::endl;
	o << "=== CONTAINER STATISTICS =======================================================" << std::endl;
	o << std::endl;
	o << "   container type: " << typeid(cont).name() << std::endl;
	o << "         key type: " << typeid(Key).name() << std::endl;
	o << "      mapped type: " << typeid(Mapped).name() << std::endl;
	o << "       value type: " << typeid(typename cont::value_type).name() << std::endl;
	INIT_TIMER
	START_TIMER
	o << "   allocator type: " << typeid(c.get_allocator()).name() << std::endl;
	RESET_TIMER("get_allocator", detail_timefile)
	o << "        size type: " << typeid(typename cont::size_type).name() << std::endl;
	o << "  difference type: " << typeid(typename cont::difference_type).name() << std::endl;
	o << "     compare type: " << typeid(c.key_comp()).name() << std::endl;
	RESET_TIMER("key_comp", detail_timefile)
	o << "value_compar type: " << typeid(c.value_comp()).name() << std::endl;
	RESET_TIMER("value_comp", detail_timefile)
	o << std::endl;
	o << "         max_size: " << c.max_size() << std::endl;
	RESET_TIMER("max_size", detail_timefile)
	o << "             size: " << c.size() << std::endl;
	RESET_TIMER("size", detail_timefile)
	o << "         is empty: " << std::boolalpha << c.empty() << std::endl;
	END_TIMER("empty", detail_timefile)
	o << std::endl;
	return o;
}

template<typename Cont>
std::ostream&	print_iterator_traits(Cont&, std::ostream& o)
{
	 /*
	 * What is tested here:
	 * Cont::iterator
	 * iterator::iterator_category
	 * iterator::value_type
	 * iterator::difference_type
	 * iterator::pointer
	 * iterator::reference
	 * Cont::const_iterator
	 * const_iterator::iterator_category
	 * const_iterator::value_type
	 * const_iterator::difference_type
	 * const_iterator::pointer
	 * const_iterator::reference
	 */
	typedef typename Cont::iterator						iterator;
	typedef typename iterator::iterator_category		iterator_category;
	typedef typename iterator::value_type				value_type;
	typedef typename iterator::difference_type			difference_type;
	typedef typename iterator::pointer					pointer;
	typedef typename iterator::reference				reference;

	typedef typename Cont::const_iterator				const_iterator;
	typedef typename const_iterator::iterator_category	const_iterator_category;
	typedef typename const_iterator::value_type			const_value_type;
	typedef typename const_iterator::difference_type	const_difference_type;
	typedef typename const_iterator::pointer			const_pointer;
	typedef typename const_iterator::reference			const_reference;

	o << "=== BEGIN ITERATOR_TRAITS ======================================================" << std::endl;
	o << std::endl;
	o << "         iterator: " << typeid(iterator).name() << std::endl;
	o << "iterator_category: " << typeid(iterator_category).name() << std::endl;
	o << "       value_type: " << typeid(value_type).name() << std::endl;
	o << "  difference_type: " << typeid(difference_type).name() << std::endl;
	o << "          pointer: " << typeid(pointer).name() << std::endl;
	o << "        reference: " << typeid(reference).name() << std::endl;
	o << "--------------------------------------------------------------------------------" << std::endl;
	o << std::endl;

	o << "   const_iterator: " << typeid(const_iterator).name() << std::endl;
	o << "iterator_category: " << typeid(const_iterator_category).name() << std::endl;
	o << "       value_type: " << typeid(const_value_type).name() << std::endl;
	o << "  difference_type: " << typeid(const_difference_type).name() << std::endl;
	o << "          pointer: " << typeid(const_pointer).name() << std::endl;
	o << "        reference: " << typeid(const_reference).name() << std::endl;
	o << std::endl;
	o << "===== END ITERATOR_TRAITS ======================================================" << std::endl;
	o << std::endl;
	return o;
}

template<typename Cont>
std::ostream&	print_reverse_iterator_traits(Cont&, std::ostream& o)
{
	 /*
	 * What is tested here:
	 * Cont::reverse_iterator
	 * reverse_iterator::iterator_category
	 * reverse_iterator::value_type
	 * reverse_iterator::difference_type
	 * reverse_iterator::pointer
	 * reverse_iterator::reference
	 * Cont::const_reverse_iterator
	 * const_reverse_iterator::iterator_category
	 * const_reverse_iterator::value_type
	 * const_reverse_iterator::difference_type
	 * const_reverse_iterator::pointer
	 * const_reverse_iterator::reference
	 */
	typedef typename Cont::reverse_iterator						reverse_iterator;
	typedef typename reverse_iterator::iterator_category		reverse_iterator_category;
	typedef typename reverse_iterator::value_type				reverse_value_type;
	typedef typename reverse_iterator::difference_type			reverse_difference_type;
	typedef typename reverse_iterator::pointer					reverse_pointer;
	typedef typename reverse_iterator::reference				reverse_reference;

	typedef typename Cont::const_reverse_iterator				const_reverse_iterator;
	typedef typename const_reverse_iterator::iterator_category	const_reverse_iterator_category;
	typedef typename const_reverse_iterator::value_type			const_reverse_value_type;
	typedef typename const_reverse_iterator::difference_type	const_reverse_difference_type;
	typedef typename const_reverse_iterator::pointer			const_reverse_pointer;
	typedef typename const_reverse_iterator::reference			const_reverse_reference;

	o << "=== BEGIN REVERSE_ITERATOR_TRAITS ==============================================" << std::endl;
	o << std::endl;
	o << "         iterator: " << typeid(reverse_iterator).name() << std::endl;
	o << "iterator_category: " << typeid(reverse_iterator_category).name() << std::endl;
	o << "       value_type: " << typeid(reverse_value_type).name() << std::endl;
	o << "  difference_type: " << typeid(reverse_difference_type).name() << std::endl;
	o << "          pointer: " << typeid(reverse_pointer).name() << std::endl;
	o << "        reference: " << typeid(reverse_reference).name() << std::endl;
	o << "--------------------------------------------------------------------------------" << std::endl;
	o << std::endl;

	o << "   const_iterator: " << typeid(const_reverse_iterator).name() << std::endl;
	o << "iterator_category: " << typeid(const_reverse_iterator_category).name() << std::endl;
	o << "       value_type: " << typeid(const_reverse_value_type).name() << std::endl;
	o << "  difference_type: " << typeid(const_reverse_difference_type).name() << std::endl;
	o << "          pointer: " << typeid(const_reverse_pointer).name() << std::endl;
	o << "        reference: " << typeid(const_reverse_reference).name() << std::endl;
	o << std::endl;
	o << "===== END REVERSE_ITERATOR_TRAITS ==============================================" << std::endl;
	o << std::endl;
	return o;
}

template<typename Cont, typename Iter>
std::ostream&	print_range_iterator(Cont& c, Iter first, Iter last, ft::random_access_iterator_tag, std::ostream& o)
{
	/*
	 * What is tested here:
	 * random_access_iterator_tag
	 * iterator operator=
	 * iterator operator*
	 * iterator operator==
	 * iterator operator!=
	 * iterator operator++
	 * iterator operator--
	 * container.end()
	 */
	INIT_TIMER
	START_TIMER

	Iter it(first);

	RESET_TIMER("iterator copy constructor", detail_timefile)

	if (first == last && last == c.end())
	{
		END_TIMER("iterator error: first == last && last == c.end() ", detail_timefile)
		return o;
	}
	o << "== NORMAL ITERATORS ==\n";
	o << "- FIRST to LAST -\n";
	o << "FIRST: ";
	print_iter(first, o);
	RESET_TIMER("iterator operator*", detail_timefile)
	o << "LAST: ";
	if (last == c.end())
	{
		o << "end\n";
		RESET_TIMER("iterator operator==\nend() ", detail_timefile)
	}
	else
	{
		print_iter(last, o);
		RESET_TIMER("iterator operator*", detail_timefile)
	}

	for (;it != last; ++it)
	{
		print_iter(it, o);
	}
	RESET_TIMER("iterator operator*, operator!=, operator++", detail_timefile)
	o << "- LAST to FIRST -\n";
	it = last;
	RESET_TIMER("iterator operator=", detail_timefile)
	it--;
	RESET_TIMER("iterator operator--(int)", detail_timefile)

	for (;it != first; --it)
	{
		print_iter(it, o);
	}
	RESET_TIMER("iterator operator*, operator!=, operator--", detail_timefile)
	print_iter(it, o);
	END_TIMER("iterator operator*", detail_timefile)
	o << "== END NORMAL ITERATORS ==\n";
	return o;
}

template<typename Cont, typename RevIter>
std::ostream&	print_range_reverse_iterator(Cont& c, RevIter first, RevIter last, ft::random_access_iterator_tag, std::ostream& o)
{
	/*
	 * What is tested here:
	 * random_access_iterator_tag
	 * reverse_iterator operator=
	 * reverse_iterator operator*
	 * reverse_iterator operator==
	 * reverse_iterator operator!=
	 * reverse_iterator operator++
	 * reverse_iterator operator--
	 * container.end()
	 */

	INIT_TIMER
	START_TIMER

	RevIter it(first);

	RESET_TIMER("iterator copy constructor", detail_timefile)

	if (first == last && last == c.rend())
	{
		END_TIMER("iterator error: first == last && last == c.end() ", detail_timefile)
		return o;
	}
	o << "== REVERSE ITERATORS ==\n";
	o << "- FIRST to LAST -\n";
	o << "FIRST: ";
	print_iter(first, o);
	RESET_TIMER("iterator operator*", detail_timefile)
	o << "LAST: ";
	if (last == c.rend())
	{
		o << "rend\n";
		RESET_TIMER("iterator operator==\nrend() ", detail_timefile)
	}
	else
	{
		print_iter(last, o);
		RESET_TIMER("iterator operator*", detail_timefile)
	}

	for (;it != last; ++it)
	{
		print_iter(it, o);
	}
	RESET_TIMER("iterator operator*, operator!=, operator++", detail_timefile)
	o << "- LAST to FIRST -\n";
	it = last;
	RESET_TIMER("iterator operator=", detail_timefile)
	it--;
	RESET_TIMER("iterator operator--(int)", detail_timefile)

	for (;it != first; --it)
	{
		print_iter(it, o);
	}
	RESET_TIMER("iterator operator*, operator!=, operator--", detail_timefile)
	print_iter(it, o);
	END_TIMER("iterator operator*", detail_timefile)
	o << "== END REVERSE ITERATORS ==\n";
	return o;
}

template<typename Cont, typename Iter>
std::ostream&	print_range_iterator(Cont& c, Iter first, Iter last, ft::bidirectional_iterator_tag, std::ostream& o)
{
	/*
	 * What is tested here:
	 * bidirectional_iterator_tag
	 * iterator operator=
	 * iterator operator*
	 * iterator operator==
	 * iterator operator!=
	 * iterator operator++
	 * iterator operator--
	 * container.end()
	 */

	INIT_TIMER
	START_TIMER

	Iter it(first);

	RESET_TIMER("iterator copy constructor", detail_timefile)

	if (first == last && last == c.end())
	{
		END_TIMER("iterator error: first == last && last == c.end() ", detail_timefile)
		return o;
	}
	o << "== ASSOCIATIVE NORMAL ITERATORS ==\n";
	o << "- FIRST to LAST -\n";
	o << "FIRST: ";
	print_associative_iter(first, o);
	RESET_TIMER("iterator operator->\npair first & second element", detail_timefile)
	o << "LAST: ";
	if (last == c.end())
	{
		o << "end\n";
		RESET_TIMER("iterator operator==\nend() ", detail_timefile)
	}
	else
	{
		print_associative_iter(last, o);
		RESET_TIMER("iterator operator->\npair first & second element", detail_timefile)
	}

	for (;it != last; ++it)
	{
		print_associative_iter(it, o);
	}
	RESET_TIMER("iterator operator->, operator!=, operator++\npair first & second element", detail_timefile)
	o << "- LAST to FIRST -\n";
	it = last;
	RESET_TIMER("iterator operator=", detail_timefile)
	it--;
	RESET_TIMER("iterator operator->, operator--(int) ", detail_timefile)

	for (;it != first; --it)
	{
		print_associative_iter(it, o);
	}
	RESET_TIMER("iterator operator->, operator !=, operator--\npair first & second element", detail_timefile)
	print_associative_iter(it, o);
	END_TIMER("iterator operator->\npair first & second element", detail_timefile)
	o << "== END ASSOCIATIVE NORMAL ITERATORS ==\n";
	return o;
}

template<typename Cont, typename RevIter>
std::ostream&	print_range_reverse_iterator(Cont& c, RevIter first, RevIter last, ft::bidirectional_iterator_tag, std::ostream& o)
{
	/*
	 * What is tested here:
	 * bidirectional_iterator_tag
	 * reverse_iterator operator=
	 * reverse_iterator operator*
	 * reverse_iterator operator==
	 * reverse_iterator operator!=
	 * reverse_iterator operator++
	 * reverse_iterator operator--
	 * container.end()
	 */

	INIT_TIMER
	START_TIMER

	RevIter it(first);

	RESET_TIMER("iterator copy constructor", detail_timefile)

	if (first == last && last == c.rend())
	{
		END_TIMER("iterator error: first == last && last == c.rend() ", detail_timefile)
		return o;
	}
	o << "== ASSOCIATIVE REVERSE ITERATORS ==\n";
	o << "- FIRST to LAST -\n";
	o << "FIRST: ";
	print_associative_iter(first, o);
	RESET_TIMER("iterator operator->", detail_timefile)
	o << "LAST: ";
	if (last == c.rend())
	{
		o << "rend\n";
		RESET_TIMER("iterator operator==\nrend() ", detail_timefile)
	}
	else
	{
		print_associative_iter(last, o);
		RESET_TIMER("iterator operator->\npair first & second element", detail_timefile)
	}

	for (;it != last; ++it)
	{
		print_associative_iter(it, o);
	}
	RESET_TIMER("iterator operator->, operator!=, operator++\npair first & second element", detail_timefile)
	o << "- LAST to FIRST -\n";
	it = last;
	RESET_TIMER("iterator operator=", detail_timefile)
	it--;
	RESET_TIMER("iterator operator->, operator--(int) ", detail_timefile)

	for (;it != first; --it)
	{
		print_associative_iter(it, o);
	}
	RESET_TIMER("iterator operator->, operator !=, operator--\npair first & second element", detail_timefile)
	print_associative_iter(it, o);
	END_TIMER("iterator operator->\npair first & second element", detail_timefile)
	o << "== END ASSOCIATIVE REVERSE ITERATORS ==\n";
	return o;
}

template<typename T, typename Cont> // default: stack
std::ostream&	display_container(ft::stack<T, Cont>& c, std::ostream& o)
{
	print_container_statistics(c, o);
	INIT_TIMER
	START_TIMER
	if (!c.empty() && c.size() > 0)
	{
		RESET_TIMER("!c.empty() && c.size() > 0", detail_timefile)
		o << "       top (back): " << &(c.top()) << std::endl;
	//	RESET_TIMER("top (back)", detail_timefile)
	//	o << "       top (back): " << const_cast<const typename ft::stack<T, Cont>::value_type>(c.top()) << std::endl;
		END_TIMER("top (back) const_cast", detail_timefile)
	}

	//print_iterator_traits(cont, o);
	//END_TIMER("size", detail_timefile)
	
	return o;
}

template<typename T, typename Alloc>
std::ostream&	display_container(ft::vector<T, Alloc>& cont, std::ostream& o)
{
	typedef			 ft::vector<T, Alloc>						vec;
	typedef typename vec::const_iterator						const_iterator;
	typedef typename vec::const_reverse_iterator				const_reverse_iterator;
	typedef typename vec::size_type								size_type;

	print_container_statistics(cont, o);
	print_iterator_traits(cont, o);

	INIT_TIMER
	START_TIMER

	size_type		c_sz = cont.size();

	END_TIMER("size", detail_timefile)
	
	if (c_sz > 0)
	{
		INIT_TIMER
		START_TIMER
		const_iterator it_beg = cont.begin();
		RESET_TIMER("const_iterator default constructor\ncont.begin()", detail_timefile)
		const_iterator it_end = cont.end();
		END_TIMER("const_iterator default constructor\ncont.end()", detail_timefile)
		print_range_iterator(cont, it_beg, it_end, ft::random_access_iterator_tag(), o);
	}
	print_reverse_iterator_traits(cont, o);
	if (c_sz > 0)
	{
		INIT_TIMER
		START_TIMER
		const_reverse_iterator rit_beg = cont.rbegin();
		RESET_TIMER("const_reverse_iterator default constructor\ncont.rbegin()", detail_timefile)
		const_reverse_iterator rit_end = cont.rend();
		END_TIMER("const_iterator default constructor\ncont.rend()", detail_timefile)
		print_range_reverse_iterator(cont, rit_beg, rit_end, ft::random_access_iterator_tag(), o);
	}
	return o;
}

template<typename Key, typename Mapped, typename Cmp, typename Allocator>
std::ostream&	display_container(ft::map<Key, Mapped, Cmp, Allocator>& cont, std::ostream& o)
{
	typedef			 ft::map<Key, Mapped, Cmp, Allocator>		map;
	typedef typename map::const_iterator						const_iterator;
	typedef typename map::const_reverse_iterator				const_reverse_iterator;
	typedef typename map::size_type								size_type;

	print_container_statistics(cont, o);
	print_iterator_traits(cont, o);

	INIT_TIMER
	START_TIMER

	size_type		c_sz = cont.size();

	END_TIMER("size", detail_timefile)
	
	if (c_sz > 0)
	{
		INIT_TIMER
		START_TIMER
		const_iterator it_beg = cont.begin();
		RESET_TIMER("const_iterator default constructor\ncont.begin()", detail_timefile)
		const_iterator it_end = cont.end();
		END_TIMER("const_iterator default constructor\ncont.end()", detail_timefile)
		print_range_iterator(cont, it_beg, it_end, ft::bidirectional_iterator_tag(), o);
	}
	print_reverse_iterator_traits(cont, o);
	if (c_sz > 0)
	{
		INIT_TIMER
		START_TIMER
		const_reverse_iterator rit_beg = cont.rbegin();
		RESET_TIMER("const_reverse_iterator default constructor\ncont.rbegin()", detail_timefile)
		const_reverse_iterator rit_end = cont.rend();
		END_TIMER("const_iterator default constructor\ncont.rend()", detail_timefile)
		print_range_reverse_iterator(cont, rit_beg, rit_end, ft::bidirectional_iterator_tag(), o);
	}
	return o;
}
