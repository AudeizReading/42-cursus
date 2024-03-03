#ifndef ALGORITHM_HPP
# define ALGORITHM_HPP

namespace ft
{
	/* --- std::equal --------------------------------------------------------- */
	template <class InputIterator1, class InputIterator2>
		bool equal (InputIterator1 first1, InputIterator1 last1, InputIterator2 first2)
		{
			for (; first1 != last1; ++first1, ++first2)
			{
				if (*first1 != *first2)
					return false;
			}
			return true;
		}

	template <class InputIterator1, class InputIterator2, class BinaryPredicate>
		bool equal (InputIterator1 first1, InputIterator1 last1, InputIterator2 first2, BinaryPredicate pred)
		{
			for (; first1 != last1; ++first1, ++first2)
			{
				if (!pred(*first1, *first2))
					return false;
			}
			return true;
		}
	/* --- std::equal --------------------------------------------------------- */

	/* --- std::lexicographical_compare --------------------------------------- */
	// retourne true si la seq 1 est inferieur lexico a la seq 2
	template <class InputIterator1, class InputIterator2>
		bool lexicographical_compare (InputIterator1 first1, InputIterator1 last1, InputIterator2 first2, InputIterator2 last2)
		{
			for (; first1 != last1; ++first1, ++first2)
			{
				if (first2 == last2 || *first2 < *first1)
					return false;
				else if (*first1 < *first2)
					return true;
			}
			return (first2 != last2);
		}

	template <class InputIterator1, class InputIterator2, class Compare>
		bool lexicographical_compare (InputIterator1 first1, InputIterator1 last1, InputIterator2 first2, InputIterator2 last2, Compare comp)
		{
			for (; first1 != last1; ++first1, ++first2)
			{
				if (first2 == last2 || comp(*first2, *first1))
					return false;
				else if (comp(*first1, *first2))
					return true;
			}
			return (first2 != last2);
		}
	/* --- std::lexicographical_compare --------------------------------------- */

	/* --- std::max ----------------------------------------------------------- */
	template<class T>
	const T&	max(const T& a, const T& b)			{ return (a < b ? b : a); }

	template<class T, class Cmp>
	const T&	max(const T&a, const T& b, Cmp cmp)	{ return (cmp(a, b) ? b : a); }
	/* --- std::max ----------------------------------------------------------- */
}
	
#endif
