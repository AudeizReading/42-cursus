#ifndef REVERSE_ITERATOR_HPP
# define REVERSE_ITERATOR_HPP
# include <iterator_functions.hpp>
# include <type_traits.hpp>

namespace ft
{
	/* --- reverse_iterator --------------------------------------------------- */
	template<class Iter>
		class reverse_iterator: public iterator<typename iterator_traits<Iter>::iterator_category,
												typename iterator_traits<Iter>::value_type,
												typename iterator_traits<Iter>::difference_type,
												typename iterator_traits<Iter>::pointer,
												typename iterator_traits<Iter>::reference>
	{
		protected:
			Iter											current;

		public:
			typedef Iter												iterator_type;
			typedef typename iterator_traits<Iter>::iterator_category	iterator_category;
			typedef typename iterator_traits<Iter>::value_type			value_type;
			typedef typename iterator_traits<Iter>::difference_type		difference_type;
			typedef typename iterator_traits<Iter>::pointer				pointer;
			typedef typename iterator_traits<Iter>::reference			reference;

			/* --- constructeurs par defaut / de recopie ------------------------------ */
			reverse_iterator()									: current()							{} // Default constructor
			explicit reverse_iterator(iterator_type i)			: current(i)						{}
			template<class U> // Copy constructor
			reverse_iterator(const reverse_iterator<U>& src)	: current(src.base())				{}

			template<class U> // Copy constructor permet la copie entre iterator et const iterator
			reverse_iterator&								operator=(reverse_iterator<typename remove_const<U>::type>& src)
			{
				if (this != &src)
				{
					*this = src;
				}
				return *this;
			}

			iterator_type									base()					const			{ return this->current; } // return l'iterateur courant

			/* --- operateurs indirection / dereferencement / acces-------------------- */
			reference										operator*() const	// C'est ca qui se passe qd on vector.rend ou rbegin aucun souci puisque on retourne le pointeur avant
			{ 
				Iter tmp = this->current;
				return *--tmp;
			}

			pointer											operator->() const						{ return &(this->operator*()); }

			reference										operator[](difference_type n) const		{ return (*(*this + n)); }

			reverse_iterator&								operator++()
			{
				--this->current; 
				return *this; 
			}

			reverse_iterator								operator++(int)
			{
				reverse_iterator tmp = *this;
				++(*this);
				return tmp;
			}

			reverse_iterator&								operator--()
			{
				++this->current; 
				return *this; 
			}

			reverse_iterator								operator--(int)
			{
				reverse_iterator tmp = *this;
				--(*this);				 
				return tmp;
			}

			/* --- operateurs addition / soustraction --------------------------------- */
			reverse_iterator								operator+(difference_type n)	const		{ return reverse_iterator(this->base() - n); }

			reverse_iterator&								operator+=(difference_type n)
			{
				this->current = this->current - n;				 
				return *this;
			}

			reverse_iterator								operator-(difference_type n)	const		{ return reverse_iterator(this->base() + n); }
			reverse_iterator&								operator-=(difference_type n)
			{
				this->current = this->current + n;				 
				return *this;
			}
	};

	/* --- operateurs relationnels -------------------------------------------- */
	template<class Lhs, class Rhs>
	bool												
	operator==(const reverse_iterator<Lhs>& lhs, const reverse_iterator<Rhs>& rhs)						{ return (lhs.base() == rhs.base()); }

	template<class Lhs, class Rhs>
	bool												
	operator!=(const reverse_iterator<Lhs>& lhs, const reverse_iterator<Rhs>& rhs)						{ return !(lhs == rhs); } // On utilise reverse_iterator<Iter>::operateur==()

	template<class Lhs, class Rhs>
	bool												
	operator<(const reverse_iterator<Lhs>& lhs, const reverse_iterator<Rhs>& rhs)						{ return (rhs.base() < lhs.base()); }

	template<class Lhs, class Rhs>
	bool												
	operator<=(const reverse_iterator<Lhs>& lhs, const reverse_iterator<Rhs>& rhs)						{ return !(rhs < lhs); }

	template<class Lhs, class Rhs>
	bool												
	operator>(const reverse_iterator<Lhs>& lhs, const reverse_iterator<Rhs>& rhs)						{ return (rhs < lhs); } // On utilise reverse_iterator<Iter>::operateur<()

	template<class Lhs, class Rhs>
	bool												
	operator>=(const reverse_iterator<Lhs>& lhs, const reverse_iterator<Rhs>& rhs)						{ return !(lhs < rhs); }// On utilise reverse_iterator<Iter>::operateur<() 

	template<class Iter>
	reverse_iterator<Iter>									
	operator+(typename reverse_iterator<Iter>::difference_type n, const reverse_iterator<Iter>& it)		{ return (it + n); }

	template<class Iter>
	reverse_iterator<Iter>								
	operator-(typename reverse_iterator<Iter>::difference_type n, const reverse_iterator<Iter>& it)		{ return reverse_iterator<Iter>(it - n); }

	template<class Lhs, class Rhs>
	typename reverse_iterator<Lhs>::difference_type			
	operator-(const reverse_iterator<Lhs>& lhs, const reverse_iterator<Rhs>& rhs)						{ return rhs.base() - lhs.base(); }
}

#endif
