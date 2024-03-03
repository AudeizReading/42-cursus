#ifndef UTILITY_HPP
# define UTILITY_HPP

namespace ft
{
	/* ---- ft::pair ---------------------------------------------------------- */
	// Non assignable
	template <typename T1, typename T2>
		struct pair
		{
			typedef T1	first_type;
			typedef T2	second_type;

			T1			first;
			T2			second;

			pair(void) : first(T1()), second(T2()) {}
			pair(const T1& x, const T2& y) : first(x), second(y) {}
			template <typename U, typename V>
				pair(const pair<U, V>& p) : first(p.first), second(p.second) {}
		};
	/* ---- ft::pair ---------------------------------------------------------- */

	/* ---- ft::make_pair ----------------------------------------------------- */
	template <typename T1, typename T2>
		pair<T1, T2>	make_pair(const T1& x, const T2& y) { return ft::pair<T1, T2>(x, y); }
	/* ---- ft::make_pair ----------------------------------------------------- */

	/* ---- ft::swap ---------------------------------------------------------- */
	template <typename T>
		void			swap(T& a, T& b)
		{
			T	tmp = a;
			a = b;
			b = tmp;
		}
	/* ---- ft::swap ---------------------------------------------------------- */
	/* ---- ft::rel_ops ------------------------------------------------------- */
	namespace rel_ops
	{
		template <class Lhs, class Rhs>
		bool	operator!=(Lhs& x, Rhs& y)	{ return !(x == y); }
		template <class Lhs, class Rhs>
		bool	operator<=(Lhs& x, Rhs& y)	{ return !(y < x); }
		template <class Lhs, class Rhs>
		bool	operator>(Lhs& x, Rhs& y)	{ return (y < x); }
		template <class Lhs, class Rhs>
		bool	operator>=(Lhs& x, Rhs& y)	{ return !(x < y); }

		template <class T1, class T2>
		bool	operator==(const pair<T1, T2>& lhs, const pair<T1, T2>& rhs)
		{ return lhs.first == rhs.first && lhs.second == rhs.second; }

		template <class T1, class T2>
		bool	operator!=(const pair<T1, T2>& lhs, const pair<T1, T2>& rhs)
		{ return !(lhs == rhs); }

		template <class T1, class T2>
		bool	operator<(const pair<T1, T2>& lhs, const pair<T1, T2>& rhs)
		{ return lhs.first < rhs.first || (!(rhs.first < lhs.first) && lhs.second < rhs.second); }

		template <class T1, class T2>
		bool	operator<=(const pair<T1, T2>& lhs, const pair<T1, T2>& rhs)
		{ return !(rhs < lhs); }

		template <class T1, class T2>
		bool	operator>(const pair<T1, T2>& lhs, const pair<T1, T2>& rhs)
		{ return rhs < lhs; }

		template <class T1, class T2>
		bool	operator>=(const pair<T1, T2>& lhs, const pair<T1, T2>& rhs)
		{ return !(lhs < rhs); }
	}
	/* ---- ft::rel_ops ------------------------------------------------------- */

}
#endif
