#ifndef SET_HPP
# define SET_HPP

# include <iostream>
# include <memory>
# include <map.hpp> // for ft::red_black_tree
# include <RBT.hpp> // for ft::red_black_tree
//# include <utility.hpp> // for ft::pair
# include <algorithm.hpp> // for ft::equal
# include <functional.hpp> // for ft::less
namespace ft
{
	template<class Key, class Compare = NSP::less<Key>, class Allocator = std::allocator<const Key> >
	//template<class Key, class T, class Compare = NSP::less<Key>, class Allocator = std::allocator<NSP::pair<const Key, T> > >
		class set {
			public:
				/* --- typedef ------------------------------------------------------------ */
				typedef			Key																key_type;			// Type de la cle
			//	typedef			T																mapped_type;		// Type de la valeur
				typedef			Key																value_type;
		//		typedef			ft::pair<const key_type, mapped_type>							value_type;			// Type d'elt paire cle / valeur
				typedef			Compare															key_compare;			// Type de la comparaison des cles
				typedef			Compare															value_compare;			// Type de la comparaison des cles

			private:
			/*	typedef select1st<value_type>													keyofvalue;
				typedef red_black_tree<	key_type, 
										value_type, 
										keyofvalue, 
										key_compare,  
										Allocator
									  >															rbt;*/
				typedef	ft::map<key_type, key_type, key_compare, Allocator>						ftmap;

			public:
				// classe nested comparaison key functor
		/*		class value_compare : public ft::binary_function<value_type, value_type, bool>
				{
					friend class set;

					protected:
						key_compare		cmp;

						value_compare(key_compare c) : cmp(c) {}

					public:
						bool			operator()(const value_type& x, const value_type& y) const { return this->cmp(x.first, y.first); }
				};

				typedef			set<Key, T, Compare, Allocator>::value_compare					value_compare;		// Type de la comparaison des values, classe nested*/

				// Ces typename sont utiles pour nous indiquer qu'on utilise un type defini dans la classe Allocator, cad qu'il ne s'agit ni
				// d'une variable, ni d'un objet mais d'un typedef d'un type ou d'autre chose. C'est valable pour tous les templates
				typedef			 Allocator														allocator_type;		// Type de gestionnaire de memoire
				typedef typename Allocator::size_type											size_type;			// Type pour l'indexation du conteneur
				typedef typename Allocator::difference_type										difference_type;	// Type du resultat de la soustraction de 2 iterateurs
				typedef typename Allocator::pointer												pointer;			// Pointeur d'elt;
				typedef typename Allocator::const_pointer										const_pointer;	
				typedef typename Allocator::reference											reference;			// Reference d'elt;
				typedef typename Allocator::const_reference										const_reference;	

			/*	typedef			 
					ft::AssociativeIteratorAdaptator<pointer,
													 typename RedBlackTree<Key, T, Compare, Allocator>::n_iterator>							iterator;					// se comporte comme value_type*
				typedef		 	 
					ft::AssociativeIteratorAdaptator<const_pointer, typename RedBlackTree<Key, T, Compare, Allocator>::n_const_iterator>	const_iterator;				// se comporte comme const value_type**/
			//	typedef	typename rbt::iterator													iterator;
				typedef	typename ftmap::const_iterator											iterator;
				typedef	typename ftmap::const_iterator											const_iterator;
				typedef	typename ftmap::const_reverse_iterator									reverse_iterator;
				typedef	typename ftmap::const_reverse_iterator									const_reverse_iterator;
				/* --- fin typedef--------------------------------------------------------- */
			
				/* --- init --------------------------------------------------------------- */
				explicit set(const key_compare& c = key_compare(), const allocator_type& a = allocator_type()) : _map(c, a) {}

				template<class In>
				set(In first, In last, const key_compare& c = key_compare(), const allocator_type& a = allocator_type()) : _map(c, a) 
				{ this->_map.insert(first, last); }

				set(const set &src)
				: _map(src._map) {}

				~set(void) {}

				set & operator=(const set& src) 
				{
					if (this != &src)
					{
						this->_map = src._map;
					}
					return *this;
				}
				/* --- init --------------------------------------------------------------- */

				/* --- taille et capacite ------------------------------------------------- */
				size_type						size() const									{ return this->_map.size(); }						// nb d'elts
				bool							empty() const									{ return this->_map.empty(); }				// retourne true si _size == 0
				size_type						max_size() const								{ return this->_map.max_size(); }			// Taille du plus grand set possible
				/* --- taille et capacite ------------------------------------------------- */
				
				/* --- iter --------------------------------------------------------------- */
				iterator						begin()											{ return this->_map.begin(); }
				const_iterator					begin() const									{ return this->_map.begin(); }
				iterator						end()											{ return this->_map.end(); }
				const_iterator					end() const										{ return this->_map.end(); }
				reverse_iterator				rbegin() 										{ return this->_map.rbegin(); }
				const_reverse_iterator			rbegin() const 									{ return this->_map.rbegin(); }
				reverse_iterator				rend() 											{ return this->_map.rend(); }
				const_reverse_iterator			rend() const 									{ return this->_map.rend(); }
				/* --- iter --------------------------------------------------------------- */

				/* --- acces aux elts ----------------------------------------------------- */	
	//			mapped_type&					operator[](const key_type& k)					{ return this->_map[k]; } 			// Acces non controle
				/* --- acces aux elts ----------------------------------------------------- */	
				
				/* --- operations de liste ------------------------------------------------ */
				ft::pair<iterator, bool>		insert(const value_type& val)					{ return this->_map.insert(val); }	// Ajoute val
				iterator						insert(iterator pos, const value_type& val)		{ return this->_map.insert(pos, val); }	// Ajoute val avant pos 
				template <class In>
				void							insert(In first, In last)						{ this->_map.insert(first, last); }	// Insere les elts depuis la sequence, In doit etre un iterateur d'entree
																								
				void							erase(iterator pos)								{ this->_map.erase(pos); }	// Supprime l'elt en pos
				size_type						erase(const key_type& k)						{ return this->_map.erase(k); }	// Supprime l'elt de key k
				void							erase(iterator first, iterator last)			{ this->_map.erase(first, last); }	// Supprime la sequence
																									
				void							clear()											{ this->_map.clear(); }	// Efface tous les elts
				/* --- operations de liste ------------------------------------------------ */

				/* --- compare ------------------------------------------------------------ */
				key_compare						key_comp() const								{ return this->_map.key_comp(); } // Return key comparaison object
				value_compare					value_comp() const								{ return value_compare(this->_map.key_comp()); } // Return value comparaison object
				/* --- compare ------------------------------------------------------------ */

				/* --- operations --------------------------------------------------------- */
				iterator						find(const key_type& k)							{ return this->_map.find(k); } // Return iterator to element
				const_iterator					find(const key_type& k) const					{ return this->_map.find(k); }

				size_type						count(const key_type& k) const					{ return this->_map.count(k); } // Searches the container for elts with key equiv and returns the number of match

				iterator						lower_bound(const key_type& k)					{ return this->_map.lower_bound(k); } // Return iterator to first element dont la cle n'est pas consideree comme devant k (soit equivalente, soit apres)
				const_iterator					lower_bound(const key_type& k) const			{ return this->_map.lower_bound(k); }

				iterator						upper_bound(const key_type& k)					{ return this->_map.upper_bound(k); } // Return iterator to first element dont la cle est consideree comme apres k
				const_iterator					upper_bound(const key_type& k) const			{ return this->_map.upper_bound(k); }

				ft::pair<iterator, iterator>	equal_range(const key_type& k)					{ return this->_map.equal_range(k); } // Retourne une plage d'iterators qui ont une cle equiv a k (pour set soit 0 soit 1 iterator dans la plage
				ft::pair<const_iterator, 
						 const_iterator>		equal_range(const key_type& k) const			{ return this->_map.equal_range(k); }
				/* --- operations --------------------------------------------------------- */

				/* --- others members ----------------------------------------------------- */
				void							swap(set& other)								{ this->_map.swap(other._map); }

				allocator_type					get_allocator() const							{ return this->_map.get_allocator(); }
				/* --- others members ----------------------------------------------------- */
			private:
				ftmap				_map;

				template<typename K2, typename Cmp2, typename Alloc2>
				friend bool		operator==(const set<K2, Cmp2, Alloc2>& lhs, const set<K2, Cmp2, Alloc2>& rhs);

				template<typename K2, typename Cmp2, typename Alloc2>
				friend bool		operator<(const set<K2, Cmp2, Alloc2>& lhs, const set<K2, Cmp2, Alloc2>& rhs);

				template<typename Key1, typename Pair1, typename KeyOfValue1, typename Cmp1, typename Alloc1>
				friend std::ostream&	operator<<(std::ostream& o, red_black_tree<Key1, Pair1, KeyOfValue1, Cmp1, Alloc1> tree);

				template<typename K2, typename Cmp2, typename Alloc2>
				friend std::ostream& display_binary_tree_ft_set(std::ostream& o, set<K2, Cmp2, Alloc2>& cont);
		};

	template< typename K, typename Cmp, typename Alloc >
	inline bool		operator==(const set<K, Cmp, Alloc>& lhs, const set<K, Cmp, Alloc>& rhs)
	{
		return (lhs._map == rhs._map);
	}

	template<typename K, typename Cmp, typename Alloc >
	inline bool		operator<(const set<K, Cmp, Alloc>& lhs, const set<K, Cmp, Alloc>& rhs)
	{
		return (lhs._map < rhs._map);
	}

	template< typename K, typename Cmp, typename Alloc >
	inline bool		operator!=(const set<K, Cmp, Alloc>& lhs, const set<K, Cmp, Alloc>& rhs)
	{
		return !(lhs == rhs);
	}

	template< typename K, typename T, typename Cmp, typename Alloc >
	inline bool		operator<=(const set<K, Cmp, Alloc>& lhs, const set<K, Cmp, Alloc>& rhs)
	{
		return !(rhs < lhs);
	}

	template< typename K, typename Cmp, typename Alloc >
	inline bool		operator>(const set<K, Cmp, Alloc>& lhs, const set<K, Cmp, Alloc>& rhs)
	{
		return (rhs < lhs);
	}

	template< typename K, typename Cmp, typename Alloc >
		inline bool		operator>=(const set<K, Cmp, Alloc>& lhs, const set<K, Cmp, Alloc>& rhs)
		{
			return !(lhs < rhs);
		}

	template< typename K, typename Cmp, typename Alloc >
	inline std::ostream&		display_binary_tree_ft_set(std::ostream& o, set<K, Cmp, Alloc>& cont)
	{
		if (cont.size() > 0)
			o << cont._map;
		return o;
	}
}
#endif
