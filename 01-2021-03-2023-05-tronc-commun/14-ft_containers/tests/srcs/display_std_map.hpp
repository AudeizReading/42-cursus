#pragma once

#ifdef STD
	#include <map>
	namespace ft = std;
# define NAMESPACE "STD"
#else
	#include <map.hpp>
# define NAMESPACE "FT"
#endif
#include <display_utils.hpp>

template<typename Key, typename Mapped, typename Cmp, typename Allocator>
std::ostream&	operator<<(std::ostream& o, ft::map<Key, Mapped, Cmp, Allocator> src)
{
	//map_km = map with Key and Mapped values
	typedef			 ft::map<Key, Mapped, Cmp, Allocator>		map_km;
	typedef typename map_km::const_iterator						const_iterator;
	typedef typename map_km::const_reverse_iterator				const_reverse_iterator;


	print_container_statistics(src, o);
	o << std::endl;
	print_iterator_traits(src, o);
	if (src.size() > 0)
	{
		const_iterator it_beg = src.begin();
		const_iterator it_end = src.end();
		print_range_iterator(src, it_beg, it_end, ft::bidirectional_iterator_tag());
	}
	o << std::endl;
	print_reverse_iterator_traits(src, o);
	if (src.size() > 0)
	{
		const_reverse_iterator rit_beg = src.rbegin();
		const_reverse_iterator rit_end = src.rend();
		print_range_reverse_iterator(src, rit_beg, rit_end, ft::bidirectional_iterator_tag());
	}
	o << std::endl;
	return o;
}
