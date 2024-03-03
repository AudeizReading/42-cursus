#ifndef VECTOR_HPP
# define VECTOR_HPP
# include <memory>
# include <iterator_functions.hpp>
# include <reverse_iterator.hpp>
# include <concrete_iterator.hpp>
# include <type_traits.hpp>
# include <utility.hpp>
# include <algorithm.hpp>
	
#define DEBUG(x) std::cerr << std::boolalpha << "\nin " << __FILE__ << ":" << __LINE__ << "\n"<< __func__ << ": " << #x << "\n" << x << std::endl;
namespace ft 
{
	template<class T, class Allocator = std::allocator<T> >
		class vector {
			public:
				/* --- typedef ------------------------------------------------------------ */
				typedef			vector<T, Allocator>										vector_type;
				typedef			T															value_type;			// Type d'elt
				//typedef			ft::concrete_iterator<typename Allocator::pointer>			iterator;			// se comporte comme T*
				//typedef		 	ft::concrete_iterator<typename Allocator::const_pointer>	const_iterator;		// se comporte comme const T*
				typedef			ft::concrete_iterator<typename Allocator::pointer, vector_type>			iterator;			// se comporte comme T*
				typedef		 	ft::concrete_iterator<typename Allocator::const_pointer, vector_type>	const_iterator;		// se comporte comme const T*
				typedef			ft::reverse_iterator<iterator>								reverse_iterator;
				typedef			ft::reverse_iterator<const_iterator>						const_reverse_iterator;

				// Ces typename sont utiles pour nous indiquer qu'on utilise un type defini dans la classe Allocator, cad qu'il ne s'agit ni
				// d'une variable, ni d'un objet mais d'un typedef d'un type ou d'autre chose. C'est valable pour tous les templates
				typedef			 Allocator													allocator_type;		// Type de gestionnaire de memoire
				typedef typename Allocator::size_type										size_type;			// Type pour l'indexation du conteneur
				typedef typename Allocator::difference_type									difference_type;	// Type du resultat de la soustraction de 2 iterateurs
				typedef typename Allocator::pointer											pointer;			// Pointeur d'elt;
				typedef typename Allocator::const_pointer									const_pointer;	
				typedef typename Allocator::reference										reference;			// Reference d'elt;
				typedef typename Allocator::const_reference									const_reference;	
				/* --- fin typedef--------------------------------------------------------- */

				/* --- init --------------------------------------------------------------- */
				// Les constructeurs de vector pouvant etre apl avec un seul argument sont declares explicit afin d'eviter des conversions accidentelles
				//
				// Quand on utilise vector comme un nom (comme pour les constructeurs et destructeurs), on ne rajoute pas <T> ->
				// vector<T> represente un type - C++ templates the complete guide (Vandevoorde, DavidJosuttis, Nicolai M) (1st edition z-lib.org) -
				explicit vector(const allocator_type& alloc = allocator_type())				: 
					_alloc(alloc), _size(0), _capacity(0), _values(0) {}

				// n copies de val
				explicit vector(size_type n, 
								const value_type val = value_type(), 
								const allocator_type& alloc = allocator_type())				: _alloc(alloc), _size(0), _capacity(0), _values(0) 
				{
					this->normal_assign(n, val);
				}	

				/*
				 * Ce constructeur pose qq soucis: il se sent concerné par les
				 * instanciations suivantes: ft::vector<int> veci(5, 7); et ft::vector<int> veci(it_beg, it_end);
				 * Ce qui evidemment n'arrange pas nos affaires et se pose la
				 * question de l'interet du constructeur explicit
				 * vector(size_type, value_type, allocator_type) puisque c'est
				 * le template qui est instancié -> il est utile pour les types d'instances suivantes : ft::vector<int> veci(5, std::string("Hello World"));
				 * Le template ne devrait pas etre choisi pour ce genre de
				 * construction.
				 *
				 * Pour distinguer si nous avons un iterator ou un type
				 * integral, on va se servir de SFINAE:
				 *
				 * Si In est un type integral, le type declaré avec typedef est
				 * de type true_type (typedef de integral_constant<bool, true>)
				 * et sera reconnu a la compilation; nous pourrons donc apl une fonction template qui prend un parametre
				 * true_type -> cette fonction gerera l'initialisation d'une
				 * instance de conteneur avec les 2 premiers arguments de type
				 * integral (int, etc.)
				 *
				 * Si In n'est pas un type integral, alors nous sommes
				 * probablement face a un iterator, dans ce cas, type sera un
				 * typedef de false_type (egalement un typedef de
				 * integral_constant<bool, false>), et on aplera une surcharge
				 * de la fonction template initiale, qui aura par contre un
				 * parametre de type false_type. Dans cette surcharge, on se
				 * chargera de l'init d'une instance du conteneur avec
				 * iterateurs pour arguments, Cependant ce n'est pas fini, les
				 * iterateurs etant eux-memes des templates, il faudra coder des
				 * fn templates pour initialiser le conteneur en fonction des
				 * iterateurs (input_iterator, forward_iterator, bidirectionnal_iterator et random_access_iterator)
				 * car chacun des iterateurs n'a pas les memes operations a
				 * dispositions, ce qui peut provoquer des complexités
				 * algorithmiques differentes selon les iterateurs et operations
				 * employees pour iterer
				 *
				 * Les templates utilises: dispatch_init
				 */
				template <class In>																	// In doit etre un iterateur en entree, on copie depuis first vers last
				vector(In first, In last, const allocator_type& alloc = allocator_type())	: _alloc(alloc), _size(0), _capacity(0), _values(0) 
				{
					typedef	typename is_integer<In>::_type	type;

					this->dispatch_init(first, last, type());
				}

				// Les operations de copie pouvant etre couteuse on transmet donc les vector par reference
				vector(const vector<T> &src)												: _alloc(allocator_type()), _size(0), _capacity(0), _values(0) 									
				{ 
					if (this != &src) 
						this->iterator_assign(src.begin(), src.end()); 
				}

				~vector(void)
				{
					this->clear();
					if (this->capacity() > 0)
						this->_alloc.deallocate(this->_values, this->capacity());
				}

				// L'affectation modifie completement les elts d'un vector et donc apres une affectation ou assign(), la taille d'un vector
				// correspond au nb d'elts affectes ou assignes
				vector<T>&						operator=(const vector<T>& src)
				{ 
					if (this != &src)
						this->iterator_assign(src.begin(), src.end());
					return *this;
				}

				template <class In>	
				void							assign(In first, In last)
				{
					typedef	typename is_integer<In>::_type	type;

					this->dispatch_assign(first, last, type());
				}

				void							assign(size_type n, const T& val)	{ this->normal_assign(n, val); } // n copies de val (ecrase les donnees si !empty())
				/* --- fin init ----------------------------------------------------------- */

				/* --- taille et capacite ------------------------------------------------- */
				size_type						size() const						{ return this->_size; }						// nb d'elts
				bool							empty() const						{ return this->size() == 0; }				// retourne true si _size == 0
				size_type						max_size() const					{ return this->_alloc.max_size(); }			// Taille du plus grand vector possible
				size_type						capacity() const					{ return this->_capacity; }					// taille de la memoire allouee en nb d'elts

				/*
				 * J'ai constate qq comportements bizarres de la part du
				 * conteneur std lors d'une realloc -> il semble ecraser les
				 * anciennes donnees, j'ai donc verifie la draft c++ qui dit : 
				 *
				 * If sz < size(), erases the last size() - sz elements from the sequence. 
				 * Otherwise, appends sz - size() default-inserted elements to the sequence
				 *
				 * rien au sujet d'un ecrasement des donnees comme pour assign
				 * par ex
				 */
				void							resize(size_type sz, value_type val = value_type())								// elts ajoutes initialises par val
				{
					size_type	size = this->size();
					size_type	cap  = this->capacity();
					size_type	i = 0;

					if (size < sz)
					{
						if (cap < sz)
							this->_capacity = ft::max(cap << 1, sz); 
						this->normal_insert(this->end(), sz - size, val);
					}
					else if (size > sz)
						for (i = sz; i < size; i++) { this->pop_back(); }
					this->_size = sz;
				}

				void							reserve(size_type n)					// reserve de la memoire pour n elts, pas d'init et declenche un length_error si n > max_size() -> realloue de la memoire de n si n sup capacity, sinon ne fait rien
				{
					size_type	cap  = this->capacity();
					
					if (n > this->max_size())
						throw std::length_error("ft::vector::reserve() -> param n is bigger than the type limit");
					if (cap < n)
						this->reserve_alloc(n, cap);
				}
				/* --- fin taille et capacite --------------------------------------------- */

				/* --- iter --------------------------------------------------------------- */
				
				iterator						begin()								{ return iterator				(this->_values); }
				const_iterator					begin() const						{ return const_iterator			(this->_values); }
				iterator						end()								{ return iterator				(this->_values + this->size()); }
				const_iterator					end() const							{ return const_iterator			(this->_values + this->size()); }
				reverse_iterator				rbegin() 							{ return reverse_iterator		(this->end()); } // ne pas retourner this->_values ca fait tout planter au niveau des types
				const_reverse_iterator			rbegin() const 						{ return const_reverse_iterator	(this->end()); }
				reverse_iterator				rend() 								{ return reverse_iterator		(this->begin()); }
				const_reverse_iterator			rend() const 						{ return const_reverse_iterator	(this->begin()); }

				/* --- fin iter------------------------------------------------------------ */

				/* --- acces aux elts ----------------------------------------------------- */	
				reference						operator[](size_type n)				{ return this->_values[n]; } 			// Acces non controle
				const_reference					operator[](size_type n) const		{ return this->_values[n]; } 
				reference						at(size_type n)					// Acces controle -> effectue un controle de la plage des valeurs et declenche une exception out_of_range lorsque l'index est incorrect
				{
					if (n >= this->size())
						throw std::out_of_range("at(): index out of range");
					return this->_values[n];
					//return *(this + n);
				}

				const_reference					at(size_type n) const
				{
					if (n >= this->size())
						throw std::out_of_range("at(): index out of range");
					return this->_values[n];
					//return *(this + n);
				}

				reference						front()								{ return *this->_values; }					// 1er elt -> retourne une reference sur le 1er elt
				const_reference					front() const						{ return *this->_values; }
				reference						back()								{ return this->_values[this->size() - 1]; }// dernier elt -> retourne une ref sur le dernier elt
				const_reference					back() const						{ return this->_values[this->size() - 1]; }
				/* --- fin acces aux elts ------------------------------------------------- */	

				/* --- operations de pile ------------------------------------------------- */
				void							push_back(const T& elt)				{ this->normal_insert(this->end(), 1, elt); } // Ajoute elt a la fin
				void							pop_back(void)						// supprime le dernier elt
				{
					this->_alloc.destroy(this->_values + this->size() - 1);
					this->_size--;
				}
				/* --- fin operations de pile --------------------------------------------- */

				/* --- operations de liste ------------------------------------------------ */

				iterator						insert(iterator pos, const T& elt)					{ return (this->normal_insert(pos, 1, elt)); }	// Ajoute elt avant pos
				void							insert(iterator pos, size_type n, const T& elt)		{ this->normal_insert(pos, n, elt); }			// Ajoute n copies de elt avant pos 

				template <class In>
				void							insert(iterator pos, In first, In last)									// Insere les elts depuis la sequence, In doit etre un iterateur d'entree
				{
					typedef	typename is_integer<In>::_type	type;

					this->dispatch_insert(pos, first, last, type());
				}

				iterator						erase(iterator pos)									// Supprime l'elt en pos
				{
					size_type			size_before = this->get_distance(this->begin(), pos);
					size_type			size_after = 0;

					if (pos == this->end()) { return this->end(); } // ici la stl segfault, moi non mais je n'etais pas obligee d'intercepter ce segfault
					for (iterator it = pos + 1; it != this->end(); ++it) 
					{ 
						this->_alloc.destroy(this->_values + size_before + size_after);
						this->_alloc.construct(this->_values + size_before + size_after, *it);
						++size_after;
					}
					this->_size = size_before + size_after;
					return this->begin() + size_before;
				}

				iterator						erase(iterator first, iterator last)					// Supprime la sequence
				{
					size_type			size_before = this->get_distance(this->begin(), first);
					size_type			size_after = 0;

					if (first == this->end()) { return this->end(); }
					for (iterator it = last; it != this->end(); ++it) 
					{ 
						this->_alloc.destroy(this->_values + size_before + size_after);
						this->_alloc.construct(this->_values + size_before + size_after, *it);
						++size_after;
					}
					this->_size = size_before + size_after;
					return this->begin() + size_before;
				}

				void							clear()												// Efface tous les elts
																									/* bjarne me dit dans l'oreillette que clear = erase(begin(), end()) donc pas de desalloc, mais je ne vais pas faire ca car mon erase reconstruit et c'est bien si je peux eviter des opes superflues */ 
				{
					if (this->size() > 0)
						for (size_type i = 0; i < this->_size; i++) { this->_alloc.destroy(this->_values + i); }
					this->_size = 0;
				}

				/* --- fin operations de liste -------------------------------------------- */

				/* --- others members ----------------------------------------------------- */
				void							swap(vector<T>& other)				
				{ 
					ft::swap(this->_values, other._values);
					ft::swap(this->_size, other._size);
					ft::swap(this->_capacity, other._capacity);
					if (this->get_allocator() != other.get_allocator())
						ft::swap(this->_alloc, other._alloc);
				}
				allocator_type					get_allocator() const				{ return allocator_type(this->_alloc); }
				/* --- fin others members ------------------------------------------------- */


			private:
				allocator_type					_alloc;		// objet allocateur du vector
				size_type						_size;		// nb elts
				size_type						_capacity;	// nb d'elts d'emplacements memoire reserves
				value_type*						_values;	// valeur

				size_type						get_new_capacity(size_type new_size)
				{
					if (new_size == 0) { new_size = 1; }

					return (this->empty() || new_size > (this->capacity() << 1)) ? new_size : this->capacity() << 1;
				}

				/*
				 * Cette fn est une sorte de wrapper pour ft::distance. Pas mal
				 * des valeurs auxquelles je compare cette distance entre
				 * iterateurs sont typees size_type alors que distance retourne
				 * du difference_type. Cela me fait faire de la duplication de
				 * code que de caster du difference_type en size_type, plus faut
				 * verifier si la valeur de type difference_type n'est pas
				 * negative, avant de la caster, si on n'inverse pas le signe on
				 * se risque a violation de l'acces memoire (malloc du nb
				 * negatif, c'est pas bon, malloc du nb negatif castee en type
				 * non signe, ca fait mal aussi a la memoire...
				 */
				template<typename In>
				size_type						get_distance(In first, In last)
				{
					difference_type				dist = ft::distance(first, last);

					if (dist < 0)
						dist = ~dist + 1; // correspond a dist *= -1 en calcul binaire
					return static_cast<size_type>(dist);
				}

				// reserve: realloue de la memoire pour n elt car n sup capacity
				void							reserve_alloc(size_type n, size_type cap)
				{
					pointer		p = this->_alloc.allocate(n);
					size_type	i = 0;

					if (!p)
						throw std::bad_alloc();
					for (i = 0; i < cap; i++)
					{
						this->_alloc.construct(p + i, this->_values[i]);
						this->_alloc.destroy(this->_values + i);
					}
					this->_alloc.deallocate(this->_values, i);
					this->_values = p;
					this->_capacity = n;
				}

				// Realloc utilise par les fn insert
				void							realloc_insert(iterator pos, size_type& index, size_type const& n, value_type const& elt)
				{
					size_type			cap = this->get_new_capacity(this->size() + n);
					pointer				p = this->_alloc.allocate(cap);
					size_type			size_shift = 0;

					for (iterator it = this->begin(); it != pos; ++it, ++index)		{ this->_alloc.construct(p + index, *it); }
					for (size_type i = 0; i < n; i++)								{ this->_alloc.construct(p + index + i, elt); }
					for (iterator it = pos; it != this->end(); ++it, ++size_shift)	{ this->_alloc.construct(p + index + n + size_shift, *it); }
					this->clear();
					this->_alloc.deallocate(this->_values, this->capacity());
					this->_capacity = cap;
					this->_values = p;
				}

				// utilise par dispatch_insert version iterateurs
				template<class In>
				void							realloc_insert(iterator pos, size_type& index, In first, In last)
				{
					size_type			dist = this->get_distance(first, last);
					size_type			cap = get_new_capacity(this->size() + static_cast<size_type>(dist));
					pointer				p = this->_alloc.allocate(cap);
					size_type			size_shift = 0;

					for (iterator it = this->begin(); it != pos; ++it, ++index)		{ this->_alloc.construct(p + index, *it); }
					for (In it = first; it != last; ++it, ++p)						{ this->_alloc.construct(p + index, *it); }
					for (iterator it = pos; it != this->end(); ++it, ++size_shift)	{ this->_alloc.construct(p + index + size_shift, *it); }
					this->clear();
					this->_alloc.deallocate(this->_values, index + dist);
					this->_capacity = cap;
					this->_values = p - dist; // p est avancé de dist sur cette instr: `for (In it = first; it != last; ++it, ++p)` d'ou la soustraction pour retrouver l'adresse du debut
				}

				// utilise par les 2 premieres fn insert pour inserer par la fin
				// du container
				void							reverse_insert(iterator pos, size_type& index, size_type const& n, value_type const& elt)
				{
					/*
					 * n		= nb d'elts a "inserer"
					 * index	= distance entre la pos et begin
					 * elt		= elt a inserer
					 * size		= this->_size + n	=> nouvelle size, doit etre inf ou eg a capacity
					 */
					size_type			size = this->size() - 1 + n;

					index = this->get_distance(this->begin(), pos);
					for (size_type i = size, j = this->size() - 1; i >= index + n && j > 0; --i, --j)
					{
						this->_alloc.construct(this->_values + i, *(this->_values + j));
						this->_alloc.destroy(this->_values + j);
					}
					for (size_type i = index; i < index + n; i++)			{ this->_alloc.construct(this->_values + i, elt); }
				}

				template<class In>
				void							reverse_insert(iterator pos, size_type& index, In first, In last)
				{
				//	DEBUG("ca passe la");
					size_type			dist = this->get_distance(first, last);
					size_type			size = this->size() - 1 + dist;

					index = this->get_distance(this->begin(), pos);
					for (size_type i = size, j = this->size() - 1; i >= index + dist && j > 0; --i, --j)
					{
						this->_alloc.construct(this->_values + i, *(this->_values + j));
						this->_alloc.destroy(this->_values + j);
					}
					for (In it = first; it != last; ++it, ++this->_values)	{ this->_alloc.construct(this->_values + index, *it); }
					this->_values -= dist;
				}

				// utilise pour refactoriser les 2 apls aux fns ci-dessus dans
				// insert() (versions non templates)
				iterator						normal_insert(iterator pos, size_type const& n, value_type const& elt)
				{
					size_type	index = 0;
					size_type	size = this->size() + n;

					if (size >= this->capacity())
						this->realloc_insert(pos, index, n, elt);
					else
						this->reverse_insert(pos, index, n, elt);
					this->_size = size;
					return this->begin() + index;
				}
				
				// version template -> pas en normal_insert car ca me cree des
				// soucis sur les versions non templates des fn insert
				template<class In>
				iterator						iterator_insert(iterator pos, In first, In last)
				{

					size_type			dist = this->get_distance(first, last);
					size_type			index = 0;
					size_type			size = this->size() + dist;

					if (size >= this->capacity())
						this->realloc_insert(pos, index, first, last);
					else
						this->reverse_insert(pos, index, first, last);
					this->_size = size;
					return this->begin() + index;
				}

				// utilisee par assign non template, dispatch_init non template
				// et dispatch_assign non template
				void							normal_assign(size_type const& n, value_type const& val)
				{
					size_type	size = this->size();
					size_type	cap = this->capacity();

					if (size > 0)
						this->clear();
					if (n > cap)
					{
						if (cap > 0)
							this->_alloc.deallocate(this->_values, cap);
						this->_values = this->_alloc.allocate(n);
						this->_capacity = n;
					}
					for (size_type i = 0; i < n; i++) { this->_alloc.construct(this->_values + i, val); }
					this->_size = n;
				}

				// utilisee par assign template, dispatch_init template
				// et dispatch_assign template
				template<class In>
				void							iterator_assign(In first, In last)
				{
					size_type			dist = this->get_distance(first, last);
					size_type			size = this->size();
					size_type			cap = this->capacity();

					if (size > 0)
						this->clear();
					if (static_cast<size_type>(dist) > cap)
					{
						if (cap > 0)
							this->_alloc.deallocate(this->_values, cap);
						this->_values = this->_alloc.allocate(dist);
						this->_capacity = dist;
					}
					/*
					 * Le pourquoi du comment de l'iteration first != last et non first < last
					 * Dans mes essais, je me suis rendue compte que tout cela utilisait la memoire de la stack, cad que le
					 * dernier elt insere a la plus petite adresse memoire. last est donc la plus petite adresse quand first est
					 * la plus grande adresse de notre plage de valeur. Des lors la condition first < last ne pourra jamais se
					 * produire, c'est pour cela qu'on utilise la negation. Car qd on incrementera l'iterateur, celui-ci aura une
					 * adresse plus petite que la precedente et se rapprochera ainsi de plus en plus de l'adresse de last
					 */
					for (In it = first; it != last; ++it, ++this->_values) { this->_alloc.construct(this->_values, *it); }
					this->_values -= dist;
					this->_size = dist;
				}

				// insert pour types integraux
				template<class In>
				void							dispatch_insert(iterator pos, In first, In last, true_type)		{ this->normal_insert(pos, first, last); }

				// insert pour iterateurs
				template<class In>
				void							dispatch_insert(iterator pos, In first, In last, false_type)	{ this->iterator_insert(pos, first, last); } // je n'utilise pas normal_insert ici car ca me cause des soucis sur les insert non templates et flemme

				// utilisees par le constructeur template
				// version integral
				template<class In>
				void							dispatch_init(In first, In last, true_type)						{ this->normal_assign(first, last); }

				// version iterateur
				template<class In>
				void							dispatch_init(In first, In last, false_type)					{ this->iterator_assign(first, last); }
					
				// utilisees par le template assign
				// version integral
				template<class In>
				void							dispatch_assign(In first, In last, true_type)					{ this->normal_assign(first, last); }

				// version iterateur
				template<class In>
				void							dispatch_assign(In first, In last, false_type)					{ this->iterator_assign(first, last); }
		};

	/* --- operateurs relationnels -------------------------------------------- */
	template <class T, class A>
	bool	operator==(const vector<T, A>& x, const vector<T, A>& y)
	{ 
		if (x.size() == y.size())
			return (ft::equal(x.begin(), x.end(), y.begin()));
		return false; 
	}
	template <class T, class A>
	bool	operator<(const vector<T, A>& x, const vector<T, A>& y)		{ return ft::lexicographical_compare(x.begin(), x.end(), y.begin(), y.end()); }

	template <class T, class A>
	bool	operator!=(const vector<T, A>& x, const vector<T, A>& y)	{ return !(x == y); }
	template <class T, class A>
	//bool	operator<=(const vector<T, A>& x, const vector<T, A>& y)	{ return (x < y); } // both works!
	bool	operator<=(const vector<T, A>& x, const vector<T, A>& y)	{ return !(y < x); }
	template <class T, class A>
	//bool	operator>(const vector<T, A>& x, const vector<T, A>& y)		{ return !(x < y); }
	bool	operator>(const vector<T, A>& x, const vector<T, A>& y)		{ return (y < x); }
	template <class T, class A>
	//bool	operator>=(const vector<T, A>& x, const vector<T, A>& y)	{ return (y < x); }
	bool	operator>=(const vector<T, A>& x, const vector<T, A>& y)	{ return !(x < y); }
	/* ---  fin operateurs operationnels -------------------------------------- */

	/* --- others ------------------------------------------------------------- */
	template <class T, class A>
	void	swap(vector<T, A>& x, vector<T, A>& y) { x.swap(y); }

	/* --- fin others --------------------------------------------------------- */
}

#endif
