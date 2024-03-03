#ifndef FUNCTIONAL_HPP
# define FUNCTIONAL_HPP
# include <iostream>

namespace ft
{
	/* ---  ft::unary_function ------------------------------------------------ */
	template<class Arg, class Result>
		struct unary_function
		{
			typedef Arg			argument_type;
			typedef Result		result_type;
		};
	/* ---  ft::unary_function ------------------------------------------------ */

	/* ---  ft::pointer_to_unary_function ------------------------------------- */
	// Genere une classe d'objet de fonction unaire a partir d'un pointeur de
	// fonction ne prenant qu'un argument Arg et retournant une valeur de
	// retour Result. Cette classe est en general utilisee comme un type, la fn
	// template ptr_fun l'utilise pour retourner un objet de ce type
	template<class Arg, class Result>
		class pointer_to_unary_function : public unary_function<Arg, Result>
		{
			protected:
				Result			(*pfunc)(Arg); // pointeur sur fonction avec 1 arg

			public:
				explicit pointer_to_unary_function(Result (*f)(Arg)) : pfunc(f) {}

				Result	operator()(Arg x) const { return pfunc(x); }
		};
	/* ---  ft::pointer_to_unary_function ------------------------------------- */

	/* ---  ft::binary_function ----------------------------------------------- */
	template<class Arg1, class Arg2, class Result>
		struct binary_function
		{
			typedef Arg1		first_argument_type;
			typedef Arg2		second_argument_type;
			typedef Result		result_type;
		};
	/* ---  ft::binary_function ----------------------------------------------- */

	/* ---  ft::pointer_to_binary_function ------------------------------------ */
	template<class Arg1, class Arg2, class Result>
	// Genere une classe d'objet de fonction unaire a partir d'un pointeur de
	// fonction prenant deux arguments Arg1 et Arg2 et retournant une valeur de
	// retour Result. Cette classe est en general utilisee comme un type, la fn
	// template ptr_fun l'utilise pour retourner un objet de ce type
		class pointer_to_binary_function : public binary_function<Arg1, Arg2, Result>
		{
			protected:
				Result			(*pfunc)(Arg1, Arg2); // pointeur sur fonction avec 2 args

			public:
				explicit	pointer_to_binary_function(Result (*f)(Arg1, Arg2)) : pfunc(f) {}

				Result		operator()(Arg1 x, Arg2 y) const { return pfunc(x, y); }
		};
	/* ---  ft::pointer_to_binary_function ------------------------------------ */

	/* ---  ft::ptr_fun ------------------------------------------------------- */
	// retourne un objet functor qui encapsule une fonction f
	template<class Arg, class Result>
		pointer_to_unary_function<Arg, Result>				ptr_fun(Result (*f)(Arg))			{ return pointer_to_unary_function<Arg, Result>(f); }

	template<class Arg1, class Arg2, class Result>
		pointer_to_binary_function<Arg1, Arg2, Result>		ptr_fun(Result (*f)(Arg1, Arg2))	{ return pointer_to_binary_function<Arg1, Arg2, Result>(f); }
	/* ---  ft::ptr_fun ------------------------------------------------------- */

	/* ---  ft::mem_fun_t ----------------------------------------------------- */
	template<class Result, class T>
		class mem_fun_t : public unary_function<T*, Result>
	{
		protected:
			Result			(T::*pmem)(); // pointeur sur fonction membre sans argument

		public:
			explicit		mem_fun_t(Result (T::*p)()) : pmem(p) {};

			Result			operator()(T* p) const { return (p->*pmem)(); }
	};

	template<class Result, class T>
		class const_mem_fun_t : public unary_function<T*, Result>
	{
		protected:
			Result			(T::*pmem)() const; // pointeur sur fonction membre sans argument const

		public:
			explicit		const_mem_fun_t(Result (T::*p)() const) : pmem(p) {};

			Result			operator()(T* p) const { return (p->*pmem)(); }
	};

	template<class Result, class T, class Arg>
		class mem_fun1_t : public binary_function<T*, Arg, Result>
	{
		protected:
			Result			(T::*pmem)(Arg); // pointeur sur fonction membre avec argument

		public:
			explicit		mem_fun1_t(Result (T::*p)(Arg)) : pmem(p) {};

			Result			operator()(T* p, Arg x) const { return (p->*pmem)(x); }
	};

	template<class Result, class T, class Arg>
		class const_mem_fun1_t : public binary_function<T*, Arg, Result>
	{
		protected:
			Result			(T::*pconst_mem)(Arg) const; // pointeur sur fonction membre avec argument const

		public:
			explicit		const_mem_fun1_t(Result (T::*p)(Arg) const) : pconst_mem(p) {};

			Result			operator()(T* p, Arg x) const { return (p->*pconst_mem)(x); }
	};
	/* ---  ft::mem_fun_t ----------------------------------------------------- */

	/* ---  ft::mem_fun ------------------------------------------------------- */
	//	retourne un objet functor encapsulant une fonction membre f de type T. Cette
	//	fonction membre retourne une valeur de type Result et optionnellement, prenant un
	//	parametre de type Arg
	//
	//	Sans arg + const
	template<class Result, class T>
		mem_fun_t<Result, T>										mem_fun(Result (T::*f)())				{ return mem_fun_t<Result, T>(f); }

	template<class Result, class T>
		const_mem_fun_t<Result, T>									mem_fun(Result (T::*f)() const)			{ return const_mem_fun_t<Result, T>(f); }

	// Avec Arg + const
	template<class Result, class T, class Arg>
		mem_fun1_t<Result, T, Arg>									mem_fun(Result (T::*f)(Arg))			{ return mem_fun1_t<Result, T, Arg>(f); }

	template<class Result, class T, class Arg>
		const_mem_fun1_t<Result, T, Arg>							mem_fun(Result (T::*f)(Arg) const)		{ return const_mem_fun1_t<Result, T, Arg>(f); }
	/* ---  ft::mem_fun ------------------------------------------------------- */

	/* ---  ft::select1st ----------------------------------------------------- */
	template<class Pair>
	struct	select1st : public unary_function<Pair, typename Pair::first_type>
	{
		typedef	unary_function<Pair, typename Pair::first_type> base_type;
		typedef typename base_type::result_type		result_type;
		typedef typename base_type::argument_type	argument_type;
		typedef Pair								value_type;

		result_type
			operator()(const argument_type& p) const	{ return p.first; }
	};
	/* ---  ft::select1st ----------------------------------------------------- */

	/* ---  ft::select2nd ----------------------------------------------------- */
	template<class Pair>
	struct	select2nd : public unary_function<Pair, typename Pair::second_type>
	{
		typedef	unary_function<Pair, typename Pair::second_type> base_type;
		typedef typename base_type::result_type		result_type;
		typedef typename base_type::argument_type	argument_type;
		typedef Pair								value_type;

		result_type
			operator()(const argument_type& p) const	{ return p.second; }
	};
	/* ---  ft::select1st ----------------------------------------------------- */

	/* ---  ft::less ---------------------------------------------------------- */
	template<class T>
		struct less : binary_function<T, T, bool>
		{
			bool	operator()(const T& lhs, const T& rhs) const								{ return lhs < rhs; }
		};
	/* ---  ft::less ---------------------------------------------------------- */
}

#endif
