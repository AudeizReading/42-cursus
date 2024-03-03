#ifndef CONCRETE_ITERATOR_HPP
# define CONCRETE_ITERATOR_HPP
# include <iterator_functions.hpp>
# include <type_traits.hpp>

namespace ft
{
	/* --- concrete_iterator --------------------------------------------------- */
	template<typename Iter, typename Cont>
	class concrete_iterator : public iterator<	typename iterator_traits<Iter>::iterator_category,
												typename iterator_traits<Iter>::value_type,
												typename iterator_traits<Iter>::difference_type,
												typename iterator_traits<Iter>::pointer,
												typename iterator_traits<Iter>::reference
											 >
	{
		protected:
			Iter	iter;

		public:
			typedef Iter												iterator_type;
			typedef typename iterator_traits<Iter>::iterator_category	iterator_category;
			typedef typename iterator_traits<Iter>::value_type			value_type;
			typedef typename iterator_traits<Iter>::difference_type		difference_type;
			typedef typename iterator_traits<Iter>::pointer				pointer;
			typedef typename iterator_traits<Iter>::reference			reference;


			concrete_iterator() : iter(Iter()) {}
			explicit
				concrete_iterator(const Iter& i) : iter(i) {}

			// Allow iter to const_iterator conversion
			template<typename OIter>
				inline concrete_iterator(const concrete_iterator<OIter, Cont>& i) : iter(i.base()) {}

			// Copy constructor
			template<class U>
				concrete_iterator&		operator=(concrete_iterator<typename remove_const<U>::type, Cont>& src)
			{
				if (this != &src)
				{
					*this = src;
				}
				return *this;
			}

			// Forward requirements
			reference					operator*()								const									{ return *iter; }
			pointer						operator->()							const									{ return iter; }
			concrete_iterator&			operator++()
			{
				++iter;
				return *this;
			}
			concrete_iterator			operator++(int)																	{ return concrete_iterator(iter++); }

			// Bidirectionnal requirements
			concrete_iterator&			operator--()
			{
				--iter;
				return *this;
			}
			concrete_iterator			operator--(int)																	{ return concrete_iterator(iter--); }

			//Random access iter requirements
			reference					operator[](const difference_type& n)	const									{ return iter[n]; }
			concrete_iterator&			operator+=(const difference_type& n)
			{
				iter += n;
				return *this;
			}
			concrete_iterator			operator+(const difference_type& n)		const									{ return concrete_iterator(iter + n); }
			concrete_iterator&			operator-=(const difference_type& n)
			{
				iter -= n;
				return *this;
			}
			concrete_iterator			operator-(const difference_type& n)		const									{ return concrete_iterator(iter - n); }
			const Iter&					base() const { return iter; }
	};

	/* --- operateurs relationnels -------------------------------------------- */
	// Forward requirements
	template<typename Lhs, typename Rhs, typename Cont>
		inline bool
		operator==(const concrete_iterator<Lhs, Cont>& lhs, const concrete_iterator<Rhs, Cont>& rhs)					{ return(lhs.base() == rhs.base()); }
	template<typename Lhs, typename Rhs, typename Cont>
		inline bool
		operator!=(const concrete_iterator<Lhs, Cont>& lhs, const concrete_iterator<Rhs, Cont>& rhs)					{ return!(lhs == rhs); }
	
	// Random access requirements
	template<typename Lhs, typename Rhs, typename Cont>
		inline bool
		operator<(const concrete_iterator<Lhs, Cont>& lhs, const concrete_iterator<Rhs, Cont>& rhs)						{ return(lhs.base() < rhs.base()); }
	template<typename Lhs, typename Rhs, typename Cont>
		inline bool
		operator>(const concrete_iterator<Lhs, Cont>& lhs, const concrete_iterator<Rhs, Cont>& rhs)						{ return(rhs < lhs); }
	template<typename Lhs, typename Rhs, typename Cont>
		inline bool
		operator<=(const concrete_iterator<Lhs, Cont>& lhs, const concrete_iterator<Rhs, Cont>& rhs)					{ return!(rhs < lhs); }
	template<typename Lhs, typename Rhs, typename Cont>
		inline bool
		operator>=(const concrete_iterator<Lhs, Cont>& lhs, const concrete_iterator<Rhs, Cont>& rhs)					{ return!(lhs < rhs); }

	template<typename Lhs, typename Rhs, typename Cont>
		inline typename concrete_iterator<Lhs, Cont>::difference_type
		operator-(const concrete_iterator<Lhs, Cont>& lhs, const concrete_iterator<Rhs, Cont>& rhs)						{ return lhs.base() - rhs.base(); }
	template<typename Iter, typename Cont>
		inline concrete_iterator<Iter, Cont>
		operator+(typename concrete_iterator<Iter, Cont>::difference_type n, const concrete_iterator<Iter, Cont>& i)	{ return concrete_iterator<Iter, Cont>(i.base() + n); } 
}

#endif
