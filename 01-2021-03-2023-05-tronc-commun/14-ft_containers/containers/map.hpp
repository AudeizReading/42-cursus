#ifndef MAP_HPP
# define MAP_HPP

# define NSP ft

# include <iostream>
# include <memory>
# include <RBT.hpp> // for ft::red_black_tree
# include <utility.hpp> // for ft::pair
# include <algorithm.hpp> // for ft::equal
# include <functional.hpp> // for ft::less

namespace ft
{
	template<class Key, class T, class Compare = NSP::less<Key>, class Allocator = std::allocator<NSP::pair<const Key, T> > >
		class map {
			public:
				/* --- typedef ------------------------------------------------------------ */
				typedef			Key																key_type;			// Type de la cle
				typedef			T																mapped_type;		// Type de la valeur
				typedef			ft::pair<const key_type, mapped_type>							value_type;			// Type d'elt paire cle / valeur
				typedef			Compare															key_compare;			// Type de la comparaison des cles

			private:
				typedef select1st<value_type>													keyofvalue;
				typedef red_black_tree<	key_type, 
										value_type, 
										keyofvalue, 
										key_compare,  
										Allocator
									  >															rbt;

			public:
				// classe nested comparaison key functor
				class value_compare : public NSP::binary_function<value_type, value_type, bool>
				{
					friend class map;

					protected:
						key_compare		cmp;

						value_compare(key_compare c) : cmp(c) {}

					public:
						bool			operator()(const value_type& x, const value_type& y) const { return this->cmp(x.first, y.first); }
				};

				typedef			map<Key, T, Compare, Allocator>::value_compare					value_compare;		// Type de la comparaison des values, classe nested

				// Ces typename sont utiles pour nous indiquer qu'on utilise un type defini dans la classe Allocator, cad qu'il ne s'agit ni
				// d'une variable, ni d'un objet mais d'un typedef d'un type ou d'autre chose. C'est valable pour tous les templates
				typedef			 Allocator														allocator_type;		// Type de gestionnaire de memoire
				typedef typename Allocator::size_type											size_type;			// Type pour l'indexation du conteneur
				typedef typename Allocator::difference_type										difference_type;	// Type du resultat de la soustraction de 2 iterateurs
				typedef typename Allocator::pointer												pointer;			// Pointeur d'elt;
				typedef typename Allocator::const_pointer										const_pointer;	
				typedef typename Allocator::reference											reference;			// Reference d'elt;
				typedef typename Allocator::const_reference										const_reference;	

				typedef	typename rbt::iterator													iterator;
				typedef	typename rbt::const_iterator											const_iterator;
				typedef			 ft::reverse_iterator<iterator>									reverse_iterator;
				typedef			 ft::reverse_iterator<const_iterator>							const_reverse_iterator;
				/* --- fin typedef--------------------------------------------------------- */
			
				/* --- init --------------------------------------------------------------- */
				explicit map(const key_compare& c = key_compare(), const allocator_type& a = allocator_type()) : _rbt(c, a) {}

				template<class In>
				map(In first, In last, const key_compare& c = key_compare(), const allocator_type& a = allocator_type()) : _rbt(c, a) 
				{ this->_rbt.insert(first, last); }

				map(const map &src) : _rbt(src._rbt) {}

				~map(void) {}

				map & operator=(const map& src) 
				{
					if (this != &src)
					{
						this->_rbt = src._rbt;
					}
					return *this;
				}
				/* --- init --------------------------------------------------------------- */

				/* --- taille et capacite ------------------------------------------------- */
				size_type						size() const									{ return this->_rbt.size(); }						// nb d'elts
				bool							empty() const									{ return this->_rbt.empty(); }				// retourne true si _size == 0
				size_type						max_size() const								{ return this->_rbt.max_size(); }			// Taille du plus grand map possible
				/* --- taille et capacite ------------------------------------------------- */
				
				/* --- iter --------------------------------------------------------------- */
				iterator						begin()											{ return this->_rbt.begin(); }
				const_iterator					begin() const									{ return this->_rbt.begin(); }
				iterator						end()											{ return this->_rbt.end(); }
				const_iterator					end() const										{ return this->_rbt.end(); }
				reverse_iterator				rbegin() 										{ return this->_rbt.rbegin(); }
				const_reverse_iterator			rbegin() const 									{ return this->_rbt.rbegin(); }
				reverse_iterator				rend() 											{ return this->_rbt.rend(); }
				const_reverse_iterator			rend() const 									{ return this->_rbt.rend(); }
				/* --- iter --------------------------------------------------------------- */

				/* --- acces aux elts ----------------------------------------------------- */	
				mapped_type&					operator[](const key_type& k)					{ return this->_rbt[k]; } 			// Acces non controle
				/* --- acces aux elts ----------------------------------------------------- */	
				
				/* --- operations de liste ------------------------------------------------ */
				ft::pair<iterator, bool>		insert(const value_type& val)					{ return this->_rbt.insert(val); }	// Ajoute val
				iterator						insert(iterator pos, const value_type& val)		{ return this->_rbt.insert(pos, val); }	// Ajoute val avant pos 
				template <class In>
				void							insert(In first, In last)						{ this->_rbt.insert(first, last); }	// Insere les elts depuis la sequence, In doit etre un iterateur d'entree
																								
				void							erase(iterator pos)								{ this->_rbt.erase(pos); }	// Supprime l'elt en pos
				size_type						erase(const key_type& k)						{ return this->_rbt.erase(k); }	// Supprime l'elt de key k
				void							erase(iterator first, iterator last)			{ this->_rbt.erase(first, last); }	// Supprime la sequence
																									
				void							clear()											{ this->_rbt.clear(); }	// Efface tous les elts
				/* --- operations de liste ------------------------------------------------ */

				/* --- compare ------------------------------------------------------------ */
				key_compare						key_comp() const								{ return this->_rbt.key_comp(); } // Return key comparaison object
				value_compare					value_comp() const								{ return value_compare(this->_rbt.key_comp()); } // Return value comparaison object
				/* --- compare ------------------------------------------------------------ */

				/* --- operations --------------------------------------------------------- */
				iterator						find(const key_type& k)							{ return this->_rbt.find(k); } // Return iterator to element
				const_iterator					find(const key_type& k) const					{ return this->_rbt.find(k); }

				size_type						count(const key_type& k) const					{ return this->_rbt.count(k); } // Searches the container for elts with key equiv and returns the number of match

				iterator						lower_bound(const key_type& k)					{ return this->_rbt.lower_bound(k); } // Return iterator to first element dont la cle n'est pas consideree comme devant k (soit equivalente, soit apres)
				const_iterator					lower_bound(const key_type& k) const			{ return this->_rbt.lower_bound(k); }

				iterator						upper_bound(const key_type& k)					{ return this->_rbt.upper_bound(k); } // Return iterator to first element dont la cle est consideree comme apres k
				const_iterator					upper_bound(const key_type& k) const			{ return this->_rbt.upper_bound(k); }

				ft::pair<iterator, iterator>	equal_range(const key_type& k)					{ return this->_rbt.equal_range(k); } // Retourne une plage d'iterators qui ont une cle equiv a k (pour map soit 0 soit 1 iterator dans la plage
				ft::pair<const_iterator, 
						 const_iterator>		equal_range(const key_type& k) const			{ return this->_rbt.equal_range(k); }
				/* --- operations --------------------------------------------------------- */

				/* --- others members ----------------------------------------------------- */
				void							swap(map& other)								{ this->_rbt.swap(other._rbt); }

				allocator_type					get_allocator() const							{ return this->_rbt.get_allocator(); }
				/* --- others members ----------------------------------------------------- */
			private:
				rbt				_rbt;

				template<typename K2, typename T2, typename Cmp2, typename Alloc2>
				friend bool		operator==(const map<K2, T2, Cmp2, Alloc2>& lhs, const map<K2, T2, Cmp2, Alloc2>& rhs);

				template<typename K2, typename T2, typename Cmp2, typename Alloc2>
				friend bool		operator<(const map<K2, T2, Cmp2, Alloc2>& lhs, const map<K2, T2, Cmp2, Alloc2>& rhs);

				template<typename K2, typename T2, typename Cmp2, typename Alloc2>
				friend std::ostream& display_binary_tree_ft_map(std::ostream& o, map<K2, T2, Cmp2, Alloc2>& cont); // only for displaying the tree at the demo
		};

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline bool		operator==(const map<K, T, Cmp, Alloc>& lhs, const map<K, T, Cmp, Alloc>& rhs)
	{
		return (lhs._rbt == rhs._rbt);
	}

	template<typename K, typename T, typename Cmp, typename Alloc >
	inline bool		operator<(const map<K, T, Cmp, Alloc>& lhs, const map<K, T, Cmp, Alloc>& rhs)
	{
		return (lhs._rbt < rhs._rbt);
	}

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline bool		operator!=(const map<K, T, Cmp, Alloc>& lhs, const map<K, T, Cmp, Alloc>& rhs)
	{
		return !(lhs == rhs);
	}

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline bool		operator<=(const map<K, T, Cmp, Alloc>& lhs, const map<K, T, Cmp, Alloc>& rhs)
	{
		return !(rhs < lhs);
	}

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline bool		operator>(const map<K, T, Cmp, Alloc>& lhs, const map<K, T, Cmp, Alloc>& rhs)
	{
		return (rhs < lhs);
	}

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline bool		operator>=(const map<K, T, Cmp, Alloc>& lhs, const map<K, T, Cmp, Alloc>& rhs)
	{
		return !(lhs < rhs);
	}

	template< typename K, typename T, typename Cmp, typename Alloc >
	void	swap(map<K, T, Cmp, Alloc>& lhs, map<K, T, Cmp, Alloc>& rhs) { lhs.swap(rhs); }

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline std::ostream&		display_binary_tree_ft_map(std::ostream& o, map<K, T, Cmp, Alloc>& cont)
	{
		o << cont._rbt;
		return o;
	}

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline std::ostream&		operator<<(std::ostream& o, map<K, T, Cmp, Alloc>& cont)
	{
		return display_binary_tree_ft_map(o, cont);
	}
}
#endif
