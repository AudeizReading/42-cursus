#ifndef TYPE_TRAITS_HPP
# define TYPE_TRAITS_HPP
# include <cwchar>

namespace ft {
	/* --- std::integral_constant --------------------------------------------- */
	template<typename T, T v>
		struct integral_constant
		{
			static const T				value = v;
			typedef T					value_type;
			typedef integral_constant	type;
			operator	value_type() const { return value; }
		};

	// Ca va surtout etre les deux facons dont on va se servir de
	// integral_constant, is_integral herite de ces typedef
	typedef	integral_constant<bool, true>	true_type; // value = true, value_type = bool, 
	typedef	integral_constant<bool, false>	false_type; // value = false, value_type
	/* --- std::integral_constant --------------------------------------------- */

	/* --- isClass ------------------------------------------------------------ */
	template<typename T>
		class IsClass {
			private:
				typedef char					one;
				typedef struct { char a[2]; }	two;
				template<typename C> static one test(int C::*);
				template<typename C> static two test(...);
			public:
				enum { Yes = sizeof(IsClass<T>::test<T>(0)) == 1 };
				enum { No = !Yes };
		};
	
	/* --- isClass ------------------------------------------------------------ */
	/* --- std::is_integral --------------------------------------------------- */
	// It inherits from integral_constant as being either true_type or false_type,
	// depending on whether T is an integral type:
	//
	// Par defaut, on va definir tous les types comme n'etant pas des types
	// integraux et on laisse la classe telle quelle, les membres de
	// integral_constant suffisent a nous dire si vrai ou faux car on les recup
	// dans la classe de par l'heritage.
	//
	// Toutes les specialisations serviront a definir les types, int char double
	// etc comme descrits dans la section 3.9.1 Fundamental types de la norme iso
	// c++, comme integraux qui retourneront du vrai partout ou on lui demandera
	template <typename T>
		struct is_integral										: public false_type {};
	template <typename T>
		struct is_integral<T const>								: public is_integral<T> {}; 

	template<>		struct is_integral<bool>					: public true_type {};

	template<>		struct is_integral<char>					: public true_type {};
	template<>		struct is_integral<signed char>				: public true_type {};
	template<>		struct is_integral<unsigned char>			: public true_type {};

	template<>		struct is_integral<short>					: public true_type {};
//	template<>		struct is_integral<signed short>			: public true_type {}; //C++11
	template<>		struct is_integral<unsigned short>			: public true_type {};

	//template<>		struct is_integral<short int>				: public true_type {}; //C++11
	//template<>		struct is_integral<unsigned short int>		: public true_type {}; //C++11

	template<>		struct is_integral<int>						: public true_type {};
	template<>		struct is_integral<unsigned int>			: public true_type {};

	template<>		struct is_integral<long int>				: public true_type {};
	template<>		struct is_integral<unsigned long int>		: public true_type {};

//	template<>		struct is_integral<long long int>			: public true_type {}; //C++11
//	template<>		struct is_integral<unsigned long long int>	: public true_type {}; //C++11

	template<>		struct is_integral<wchar_t>					: public true_type {};
//	template<>		struct is_integral<char16_t>				: public true_type {}; //C++11
//	template<>		struct is_integral<char32_t>				: public true_type {}; //C++11

	// Alors ces types ne sont pas consideres comme integraux par le std, par
	// contre pour des soucis de logistique et de tps je vais reutiliser ce
	// template pour enlever toute ambuiguité au sujet de ces types, car en
	// fait, si on nous refait faire toussa, c'est parce qu'on cherche les
	// iterateurs (et donc les pointeurs) dans nos constructeurs pour apl les
	// bons constructeurs au compile time, sinon faudrait que je recree exactement le meme type de
	// mecanisme, y'aura que le nom qui changerait....
	template<>		struct is_integral<void>					: public true_type {};
	template<>		struct is_integral<float>					: public true_type {};
	template<>		struct is_integral<double>					: public true_type {};
	template<>		struct is_integral<long double>				: public true_type {};
	/* --- std::is_integral --------------------------------------------------- */	
	/* --- std::is_integer --------------------------------------------------- */	
	template<typename T>
		struct	is_integer
		{
			typedef false_type	_type;
		};

	template<typename T>
		struct is_integer<T const>								: public is_integer<T> {};

	template<>		struct is_integer<bool>						{ typedef true_type _type; };
	template<>		struct is_integer<char>						{ typedef true_type _type; };
	template<>		struct is_integer<signed char>				{ typedef true_type _type; };
	template<>		struct is_integer<unsigned char>			{ typedef true_type _type; };
	template<>		struct is_integer<short>					{ typedef true_type _type; };
	template<>		struct is_integer<unsigned short>			{ typedef true_type _type; };
	template<>		struct is_integer<int>						{ typedef true_type _type; };
	template<>		struct is_integer<unsigned int>				{ typedef true_type _type; };
	template<>		struct is_integer<long int>					{ typedef true_type _type; };
	template<>		struct is_integer<unsigned long int>		{ typedef true_type _type; };
	template<>		struct is_integer<wchar_t>					{ typedef true_type _type; };
	template<>		struct is_integer<float>					{ typedef true_type _type; };
	template<>		struct is_integer<double>					{ typedef true_type _type; };
	template<>		struct is_integer<long double>				{ typedef true_type _type; };
	template<>		struct is_integer<void>						{ typedef true_type _type; };
	/* --- std::is_integer --------------------------------------------------- */	

	/* --- std::enable_if ----------------------------------------------------- */
	/*
	 The c++ std lib provides a helper template std::enable_if<> to ignore
	 function templates under certain compile-time conditions
	 for ex:
	
	 template<typename T>
	 typename std::enable_if<(sizeof(T) > 4)>::type foo() {}
	
	 La definition de foo<>() sera ignoree si (sizeof(T) > 4) yields / retourne
	 faux / false. Si le resultat est vrai, l'instance de la fonction template sera developpee a : void foo()
	
	 enable_if<> is un type trait qui evalue a given compile-time expression
	 passed as its first template argument and behaves as follows:
	
	 * si l'expression Cond retourne true, son membre type "type" retourne un
	 type; type qui est void si pas de 2nd arg de template passer, sinon prend le
	 type du second argument passer
	
	 * si l'expression Cond retourne false, le membre type n'est pas defini.
	 Du fait de SFINAE (substitution failure is not an error), cette
	 expression est ignoree.

	 Si un second param est passer on peut envisager une nv fn foo:

	 template<typename T>
	 typename std::enable_if<sizeof(T) > 4, T>::type foo() { return T(); }

	 C++ templates the complete guide (Vandevoorde, DavidJosuttis, Nicolai M) (1st edition z-lib.org)
	 */
	template <bool Cond, typename T = void>
		struct enable_if {};

	// si Cond vaut true alors la struct declare un type "type", sinon ce type
	// n'est pas declare
	template <typename T>
		struct enable_if<true, T>
		{
			typedef T	type;
		};
	/* --- std::enable_if ----------------------------------------------------- */	

	/* --- std::remove_const -------------------------------------------------- */	
	// J'utilise ce template avec concrete_iterator et reverse_iterator pour enlever la const et pouvoir manipuler des iterateurs et des const_iterators en meme tps
	template<typename T>
		struct remove_const {
			enum { value = 0 };
			typedef T type;
		};

	template<typename T>
		struct remove_const<const T>
		{
			enum { value = 1 };
			typedef T type;
		};
	/* --- std::remove_const -------------------------------------------------- */	
	/* --- std::is_pointer ---------------------------------------------------- */	
	template<class T>	struct	is_pointer_helper			: public false_type {};
	template<class T>	struct	is_pointer_helper<T *>		: public true_type	{};

	template<class T>	struct	is_pointer					: is_pointer_helper<typename remove_const<T>::type> {};
	/* --- std::is_pointer ---------------------------------------------------- */	
}

#endif
