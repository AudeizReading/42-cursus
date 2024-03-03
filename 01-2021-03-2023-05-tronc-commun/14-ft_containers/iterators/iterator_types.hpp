#ifndef ITERATOR_TYPES_HPP
# define ITERATOR_TYPES_HPP

namespace ft 
{
	/* --- categories d'iterateurs -------------------------------------------- */
	/*
	* permet la resolution de la surcharge en fonction des categories
	* d'iterateurs. il s'agit d'un mecanisme de selection a la compilation
	* (p.617)
	* En a-t-on vraiment besoin ? possible d'utiliser les version std:: ?
	*/
	struct	output_iterator_tag													{};
	struct	input_iterator_tag													{};
	struct	forward_iterator_tag		: public input_iterator_tag				{};
	struct	bidirectional_iterator_tag	: public forward_iterator_tag			{};
	struct	random_access_iterator_tag	: public bidirectional_iterator_tag		{};

	/* --- iterator_traits ---------------------------------------------------- */
	/*
	 * iterator_traits permet d'exprimer et de faire reference aux types lies a
	 * un iterateur donné . Permet d'ecrire du code dependant des proprietes
	 * d'un parametre d'iterateur; ex selon si l'iterateur est un Input ou
	 * Random_Access iterator -> cf std::count()
	 */
	template<class Iterator>
		struct iterator_traits 
		{
			typedef typename Iterator::iterator_category	iterator_category;		// Type des operations supportees par l'iterateur
			typedef typename Iterator::value_type			value_type;				// Type de l'elt
			typedef typename Iterator::difference_type		difference_type;		// Type de la difference entre deux iterateurs
			typedef typename Iterator::pointer				pointer;				// Type retour de operator->()
			typedef typename Iterator::reference			reference;				// Type retour de operator*()
		};

	template<typename T>														// Specialisation pour les pointeurs
		struct iterator_traits<T*> 
		{
			typedef ft::random_access_iterator_tag			iterator_category;		// Type des operations supportees par l'iterateur
			typedef T										value_type;				// Type de l'elt
			typedef ptrdiff_t								difference_type;		// Type de la difference entre deux iterateurs
			typedef T*										pointer;				// Type retour de operator->()
			typedef T&										reference;				// Type retour de operator*()
		};

	template<typename T>														// Specialisation pour les pointeurs constants
		struct iterator_traits<const T*> 
		{
			typedef ft::random_access_iterator_tag			iterator_category;		// const Type des operations supportees par l'iterateur
			typedef T										value_type;				// const Type de l'elt
			typedef ptrdiff_t								difference_type;		// const Type de la difference entre deux iterateurs
			typedef const T*								pointer;				// const Type retour de operator->()
			typedef const T&								reference;				// const Type retour de operator*()
		}  ;

	/* --- iterator ----------------------------------------------------------- */
	template<class Cat, class T, class Dist = ptrdiff_t, class Ptr = T*, class Ref = T&>
		struct iterator
		{
			typedef Cat										iterator_category;
			typedef T										value_type;
			typedef Dist									difference_type;
			typedef Ptr										pointer;
			typedef Ref										reference;
		};
	/* --- insert_iterator ---------------------------------------------------- */
	template<class Cont>
		class insert_iterator : public iterator<std::output_iterator_tag, void, void, void, void>
		{
			protected:
				Cont&										container;
				typename Cont::iterator						iter;					 // pointe dans le conteneur

			public:
				explicit insert_iterator(Cont& c, typename Cont::iterator i) : container(c), iter(i) {}

				insert_iterator&							operator=(typename Cont::value_type const& src)
				{
					this->iter = container.insert(this->iter, src);
					++this->iter;
					return *this;
				}

				insert_iterator&							operator*()		{ return *this; }
				insert_iterator&							operator++()	{ return *this; }			// Ce type d'iterateur ne bouge pas
				insert_iterator&							operator++(int)	{ return *this; }
		};

	/* --- back_insert_iterator ----------------------------------------------- */
	template<class Cont>
		class back_insert_iterator : public iterator<std::output_iterator_tag, void, void, void, void>
	{
		protected:
			Cont&											container;

		public:
			explicit back_insert_iterator(Cont& c) : container(c) {}

			back_insert_iterator&							operator=(typename Cont::value_type const& src)
			{
				container.push_back(src);
				return *this;
			}

			back_insert_iterator&							operator*()		{ return *this; }
			back_insert_iterator&							operator++()	{ return *this; }			
			back_insert_iterator&							operator++(int)	{ return *this; }
	};

	
}

#endif
