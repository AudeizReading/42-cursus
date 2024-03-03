#ifndef STACK_HPP
# define STACK_HPP
# include "vector.hpp"

namespace ft 
{
	template <class T, class Container = ft::vector<T> > 
	class stack
	{
		public:
			typedef T											value_type;
			typedef Container									container_type;
			typedef typename Container::size_type				size_type;

			explicit stack (const container_type& ctnr = container_type()) : c(ctnr) {}

			bool				empty() const					{ return this->c.empty(); }
			size_type			size() const					{ return this->c.size(); }
			value_type&			top()							{ return this->c.back(); }
			const value_type&	top() const						{ return this->c.back(); }
			void				push (const value_type& val)	{ this->c.push_back(val); }
			void				pop()							{ this->c.pop_back(); }

		protected:
			container_type	c;

			template <class T2, class Cont>
			friend	bool operator==(const stack<T2, Cont>& lhs, const stack<T2, Cont>& rhs);

			template <class T2, class Cont>
			friend	bool operator<  (const stack<T2, Cont>& lhs, const stack<T2, Cont>& rhs);
	};

	/*
	 * operator== ainsi que operator< doivent etre declares friend de la classe
	 * stack dans la classe stack. La portee de la declaration a peu
	 * d'importance, elle peut etre privee ou publique cela ne changera pas le
	 * fait que ces operateurs pourront acceder a la partie privee de la classe
	 * stack. On le fera en protected afin de respecter le sujet qui nous impose
	 * la visibilite privee pour toutes fns n'existant pas en public dans les
	 * specifications du langage.
	 * On a besoin que ces operateurs puissent acceder a lhs.c.begin() et
	 * autres,
	 * accessibles seulement dans la partie privees de la class, sinon il sera
	 * impossible de comparer efficacement les elements stack
	 */
	template <class T, class Container>
	inline bool operator== (const stack<T, Container>& lhs, const stack<T, Container>& rhs)
	{ 
		if (lhs.size() == rhs.size())
			return (ft::equal(lhs.c.begin(), lhs.c.end(), rhs.c.begin()));
		return false; 
	}
	template <class T, class Container>
	inline bool operator<  (const stack<T, Container>& lhs, const stack<T, Container>& rhs) { return ft::lexicographical_compare(lhs.c.begin(), lhs.c.end(), rhs.c.begin(), rhs.c.end()); }
	template <class T, class Container>
	inline bool operator!= (const stack<T, Container>& lhs, const stack<T, Container>& rhs) { return !(lhs == rhs); }
	template <class T, class Container>
	inline bool operator<= (const stack<T, Container>& lhs, const stack<T, Container>& rhs) { return !(rhs < lhs); }
	template <class T, class Container>
	inline bool operator>  (const stack<T, Container>& lhs, const stack<T, Container>& rhs) { return (rhs < lhs); }
	template <class T, class Container>
	inline bool operator>= (const stack<T, Container>& lhs, const stack<T, Container>& rhs) { return !(lhs < rhs); }
}
#endif
