#ifndef MUTANTSTACK_HPP
# define MUTANTSTACK_HPP
# include <stack>

template <typename T>
class MutantStack : public std::stack<T> {
	public:
		// we get back the type of the container that stack derived (deque by default)
		typedef typename std::stack<T>::container_type::iterator				iterator;
		typedef typename std::stack<T>::container_type::const_iterator			const_iterator;
		typedef typename std::stack<T>::container_type::reverse_iterator		reverse_iterator;
		typedef typename std::stack<T>::container_type::const_reverse_iterator	const_reverse_iterator;
		
		MutantStack<T>(void) {};
		MutantStack<T>(MutantStack<T> const &src) { *this = src; };
		~MutantStack<T>(void) {};
		MutantStack<T> & operator=(MutantStack<T> const &src) { 
			if (*this != src)
				*this = src;
			return *this;
		};

		iterator				begin()			{ return this->c.begin(); };
		const_iterator			begin() const	{ return this->c.begin(); };
		iterator				end()			{ return this->c.end(); };
		const_iterator			end() const		{ return this->c.end(); };
		reverse_iterator		rbegin()		{ return this->c.rbegin(); };
		const_reverse_iterator	rbegin() const	{ return this->c.rbegin(); };
		reverse_iterator		rend()			{ return this->c.rend(); };
		const_reverse_iterator	rend() const	{ return this->c.rend(); };
};
#endif 
