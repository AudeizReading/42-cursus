#include "tests_vector.hpp"

std::ofstream outfile(OUTFILE, std::ios::out | std::ios::app);
std::ofstream timefile(TIMEFILE, std::ios::out | std::ios::app);
std::ofstream detail_timefile(DETAIL_TIMEFILE, std::ios::out | std::ios::app);

 void	vector_test_iterators_manip()
{
	typedef	ft::vector<int>				vec_int;
	typedef vec_int::iterator			iterator;
	typedef vec_int::const_iterator		const_iterator;
	
	try 
	{
		const int							ft = 42;
		INIT_TIMER
		START_TIMER
		vec_int								vecf;
		RESET_TIMER("Vector default constructor", detail_timefile)

		// fill vectors
		for (int i = 0; i < 5; i++)
		{
			vecf.push_back(ft * i);
			RESET_TIMER("Vector push_back", detail_timefile)
		}
		END_TIMER("Vector push_back", detail_timefile)
		display_container(vecf, outfile);

		// test iterators commence ici
		START_TIMER
		iterator		_it = vecf.begin();
		RESET_TIMER("Vector iterator default constructor, vector begin()", detail_timefile)
		const_iterator	_end = vecf.end();
		RESET_TIMER("Vector const_iterator default constructor, vector end()", detail_timefile)
		const int							size = 5;

		// test acces []
		for (int i = 0; i < size; ++i)
		{
			_it[i] = (size - i) * 5;
			outfile << "iterator _it[" << i << "] = (size - i) * 5: " << _it[i] << "\n";
			RESET_TIMER("Vector operator[], _it[i] = (size - i) * 5", detail_timefile)
		}
		RESET_TIMER("Vector operator[], _it[i] = (size - i) * 5", detail_timefile)

		// test operator*, operator++, operator !=
		for (; _it != _end; ++_it)
		{
			outfile << "*_it: " << *_it << "\n";
			RESET_TIMER("Vector iterator operator*, operator++, operator!=", detail_timefile)
		}
		RESET_TIMER("Vector iterator operator*, operator++, operator!=", detail_timefile)

		_it = vecf.begin();
		RESET_TIMER("Vector iterator default constructor, vector begin()", detail_timefile)
		// test constructeur et operator+ membre
		_it = _it + 5;
		if (_it != _end)
			outfile << "_it = _it + 5: " << *_it << "\n";
		RESET_TIMER("Vector iterator operator+, _it = _it + 5", detail_timefile)

		// test constructeur et operator+ non membre
		// la std segfault sur ce test! avec fsanitize
		_it = 1 + _it;
		if (_it != _end)
			outfile << "_it = 1 + _it: " << *_it << "Dont worry if your result differs from the compare one, this is because we are after the end of the vector\n";
		RESET_TIMER("Vector iterator operator+, _it = 1 + _it", detail_timefile)

		// test constructeur et operator- membre
		_it = _it - 4;
		if (_it != _end)
			outfile << "_it = _it - 4: " << *_it << "\n";
		RESET_TIMER("Vector iterator operator-, _it = _it - 4", detail_timefile)

		// test operator* et operator +=
		if ((_it += 2) != _end)
			outfile << "*(_it += 2): " << *_it << "\n";
		RESET_TIMER("Vector iterator operator+=, *(_it += 2)", detail_timefile)

		// test operator* et operator -=
		if ((_it -= 1) != _end)
			outfile << "*(_it -= 1): " << *_it << "\n";
		RESET_TIMER("Vector iterator operator-=, *(_it -= 1)", detail_timefile)

		// test operator* et operator -=
		*(_it -= 2) = 42;
		if (_it != _end)
			outfile << "*(_it -= 2) = 42: " << *_it << "\n";
		RESET_TIMER("Vector iterator operator-=, *(_it -= 2) = 42", detail_timefile)

		// test operator* et operator +=
		*(_it += 2) = 21;
		if (_it != _end)
			outfile << "*(_it += 2) = 21: " << *_it << "\n";
		RESET_TIMER("Vector iterator operator+=, *(_it += 2) = 21", detail_timefile)

		// test conversion iterator to const_iterator
		const_iterator _beg = vecf.begin();
		RESET_TIMER("Vector const_iterator default constructor, vector begin()", detail_timefile)

		const_iterator _ite = _beg;
		RESET_TIMER("Vector const_iterator default constructor, _ite = _beg", detail_timefile)
		for (; _ite != _end; ++_ite)
		{
			outfile << "*_ite: " << *_ite << "\n";
			RESET_TIMER("Vector iterator operator*, operator++, operator!=", detail_timefile)
		}

		// test operator* et operator += const
		if ((_ite += 2) != _end)
			outfile << "const_iterator *(_ite += 2): " << *_ite << "Dont worry if your result differs from the compare one, this is because we are after the end of the vector\n";
		RESET_TIMER("Vector const iterator operator+=, *(_ite += 2)", detail_timefile)
		// test operator* et operator -= const
		if ((_ite -= 2) != _end)
			outfile << "const_ite -=: " << *_ite << "\n";
		RESET_TIMER("Vector const iterator operator-=, *(_ite -= 2)", detail_timefile)

		// test operator==
		if (_it != _end && _ite != _end)
			outfile << "(_ite == _it): " << (_ite == _it) << "\n";
		RESET_TIMER("Vector const iterator operator==, (_ite == _it)", detail_timefile)
		// test operator- const - non const
		if ((_ite) != _end && _it != _end)
			outfile << "(_ite - _it): " << (_ite - _it) << "\n";
		RESET_TIMER("Vector const iterator operator-, (_ite  - _it)", detail_timefile)
		// test operator+ const et egalité const == non const
		if ((_ite + 3) != _end)
			outfile << "(_ite + 3 == _it): " << (_ite + 3 == _it) << "\n";
		END_TIMER("Vector const iterator operator+, operator==, (_ite + 3 == _it)", detail_timefile)
		display_container(vecf, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
}

 void	vector_test_reverse_iterators_manip()
{
	typedef	ft::vector<int>						vec_int;
	typedef vec_int::reverse_iterator			reverse_iterator;
	typedef vec_int::const_reverse_iterator		const_reverse_iterator;
	
	try 
	{
		const int							ft = 42;
		INIT_TIMER
		START_TIMER
		vec_int								vecf;
		RESET_TIMER("Vector default constructor", detail_timefile)

		// fill vectors
		for (int i = 0; i < 5; i++)
		{
			vecf.push_back(ft * i);
			RESET_TIMER("Vector push_back", detail_timefile)
		}
		END_TIMER("Vector push_back", detail_timefile)
		display_container(vecf, outfile);

		// test iterators commence ici
		START_TIMER
		reverse_iterator		_it = vecf.rbegin();
		RESET_TIMER("Vector reverse_iterator default constructor, vector rbegin()", detail_timefile)
		const_reverse_iterator	_end = vecf.rend();
		RESET_TIMER("Vector const_reverse_iterator default constructor, vector rend()", detail_timefile)
		const int							size = 5;

		// test acces []
		for (int i = 0; i < size; ++i)
		{
			_it[i] = (size - i) * 5;
			outfile << "reverse_iterator _it[" << i << "] = (size - i) * 5: " << _it[i] << "\n";
			RESET_TIMER("Vector operator[], _it[i] = (size - i) * 5", detail_timefile)
		}
		RESET_TIMER("Vector operator[], _it[i] = (size - i) * 5", detail_timefile)

		// test operator*, operator++, operator !=
		for (; _it != _end; ++_it)
		{
			outfile << "reverse_iterator, *_it: " << *_it << "\n";
			RESET_TIMER("Vector reverse_iterator operator*, operator++, operator!=", detail_timefile)
		}
		RESET_TIMER("Vector reverse_iterator operator*, operator++, operator!=", detail_timefile)

		_it = vecf.rbegin();
		RESET_TIMER("Vector reverse_iterator default constructor, vector rbegin()", detail_timefile)
		// test constructeur et operator+ membre
		_it = _it + 5;
		if (_it != _end)
			outfile << "reverse_iterator, _it = _it + 5: " << *_it << "\n";
		RESET_TIMER("Vector reverse_iterator operator+, _it = _it + 5", detail_timefile)

		// test constructeur et operator+ non membre
		// la std segfault sur ce test! avec fsanitize
		// c'est normal on depasse les limites
		_it = 1 + _it;
		if (_it != _end)
			outfile << "reverse_iterator, _it = 1 + _it: " << *_it << "Dont worry if your result differs from the compare one, this is because we are after the end of the vector\n";
		RESET_TIMER("Vector reverse_iterator operator+, _it = 1 + _it", detail_timefile)

		// test constructeur et operator- membre
		_it = _it - 4;
		if (_it != _end)
			outfile << "reverse_iterator, _it = _it - 4: " << *_it << "\n";
		RESET_TIMER("Vector reverse_iterator operator-, _it = _it - 4", detail_timefile)

		// test operator* et operator +=
		if ((_it += 2) != _end)
			outfile << "reverse_iterator, *(_it += 2): " << *_it << "\n";
		RESET_TIMER("Vector reverse_iterator operator+=, *(_it += 2)", detail_timefile)

		// test operator* et operator -=
		if ((_it -= 1) != _end)
			outfile << "reverse_iterator, *(_it -= 1): " << *_it << "\n";
		RESET_TIMER("Vector reverse_iterator operator-=, *(_it -= 1)", detail_timefile)

		// test operator* et operator -=
		*(_it -= 2) = 42;
		if (_it != _end)
			outfile << "reverse_iterator, *(_it -= 2) = 42: " << *_it << "\n";
		RESET_TIMER("Vector reverse_iterator operator-=, *(_it -= 2) = 42", detail_timefile)

		// test operator* et operator +=
		*(_it += 2) = 21;
		if (_it != _end)
			outfile << "reverse_iterator, *(_it += 2) = 21: " << *_it << "\n";
		RESET_TIMER("Vector reverse_iterator operator+=, *(_it += 2) = 21", detail_timefile)

		// test conversion reverse_iterator to const_reverse_iterator
		const_reverse_iterator _beg = vecf.rbegin();
		RESET_TIMER("Vector const_reverse_iterator default constructor, vector rbegin()", detail_timefile)

		const_reverse_iterator _ite = _beg;
		RESET_TIMER("Vector const_reverse_iterator default constructor, _ite = _beg", detail_timefile)
		for (; _ite != _end; ++_ite)
		{
			outfile << "const reverse_iterator, *_ite: " << *_ite << "\n";
			RESET_TIMER("Vector reverse_iterator operator*, operator++, operator!=", detail_timefile)
		}

		// test operator* et operator += const
		if ((_ite += 2) != _end)
			outfile << "const reverse_iterator, *(_ite += 2): " << *_ite << "Dont worry if your result differs from the compare one, this is because we are after the end of the vector\n";
		RESET_TIMER("Vector const reverse_iterator operator+=, *(_it += 2)", detail_timefile)
		// test operator* et operator -= const
		if ((_ite -= 2) != _end)
			outfile << "const reverse_iterator, _ite -= 2: " << *_ite << "\n";
		RESET_TIMER("Vector const reverse_iterator operator-=, *(_it -= 2)", detail_timefile)

		// test operator==
		if (_it != _end && _ite != _end)
			outfile << "const reverse_iterator, (_ite == _it): " << (_ite == _it) << "\n";
		RESET_TIMER("Vector const reverse_iterator operator==, (_ite == _it)", detail_timefile)
		// test operator- const - non const
		if ((_ite) != _end && _it != _end)
			outfile << "const reverse_iterator, (_ite - _it): " << (_ite - _it) << "\n";
		RESET_TIMER("Vector const reverse_iterator operator-, (_ite  - _it)", detail_timefile)
		// test operator+ const et egalité const == non const
		if ((_ite + 3) != _end)
			outfile << "const reverse_iterator, (_ite + 3 == _it): " << (_ite + 3 == _it) << "\n";
		END_TIMER("Vector const reverse_iterator operator+, operator==, (_ite + 3 == _it)", detail_timefile)
		display_container(vecf, outfile);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	catch (std::length_error const& e)
	{
		std::cerr << "Error length error: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cerr << "Error out of range: " << e.what() << std::endl;
	}
}

int	main(void)
{

	if (!outfile || !timefile || !detail_timefile)
	{
		std::cerr << "A problem occurs while creating logs file...\n";
		exit(1);
	}
	outfile << NAMESPACE << " - VECTOR TESTING\n";
	std::cerr << NAMESPACE << " - VECTOR TESTING\n";
	timefile << NAMESPACE << " - VECTOR TESTING\n";
	
	value_type	val("Hello World VECTOR 42");
	size_type	sz = 42000;
	INIT_TIMER
	START_TIMER
	vec_vt	vs;
	RESET_TIMER("Vector, default constructor", detail_timefile)
	
	vs = vector_test_push_back(vs, val, sz);
	try 
	{
		vs.push_back(val);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
	}
	
	sz -= 420;
	vs = vector_test_pop_back(vs, sz);

	if (sz == vs.size())
	{
		RESET_TIMER("Vector, size()", detail_timefile)
		outfile << sz << " and " << vs.size() << " are same\n";
	}
	else
	{
		RESET_TIMER("Vector, size()", detail_timefile)
		outfile << sz << " and " << vs.size() << " are not same\n";
	}

	val += "\nMore stuff for a bigger test\nMay I wrote Lorem Ipsum? Maybe later\n";
	sz = 32665;

	vs = vector_test_resize(vs, val, sz);

	val += "\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc condimentum orci non finibus pellentesque. Donec ultricies lacus nec tempor congue. Duis sed dapibus quam, sed vehicula diam. Cras auctor aliquet finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin malesuada nulla dolor, at pulvinar arcu semper ut. Nullam convallis quam lorem. Vestibulum semper tempus ultrices. Aenean vel tellus ligula. Suspendisse facilisis venenatis velit, egestas fermentum nibh scelerisque in. Quisque nec turpis porttitor, mattis augue eu, cursus nulla.\n\nPellentesque elementum tortor a diam ultricies, a elementum mauris faucibus. Maecenas a tristique nibh. Quisque non tristique ante. Fusce ipsum odio, tincidunt nec magna id, faucibus semper justo. Suspendisse quis lorem consequat, tincidunt velit ac, finibus dolor. Nulla vitae facilisis turpis, eu volutpat felis. Suspendisse potenti. Donec ut elit non tortor viverra interdum et eu dui.\n\nCurabitur condimentum posuere justo rhoncus scelerisque. Vestibulum blandit, ligula fermentum imperdiet imperdiet, eros elit tempus purus, et euismod libero sapien at turpis. Donec sed tristique enim, sit amet tincidunt urna. Donec tempor quam a diam dignissim, id convallis ex porta. Praesent in ex non nisl venenatis condimentum. Aliquam dictum, ante eget auctor tincidunt, magna nunc viverra justo, sed lacinia lectus massa a nulla. Nulla at est lobortis, sagittis massa et, sollicitudin erat. Aliquam iaculis augue eu fringilla bibendum. Mauris turpis purus, consectetur non magna nec, interdum dictum velit.\n\nPhasellus lacinia turpis augue, tincidunt tincidunt odio sollicitudin nec. Duis pellentesque ante quis nisl iaculis, et venenatis magna fringilla. Sed diam nisi, luctus accumsan luctus ac, molestie ut est. Aenean eget sollicitudin dui, id lacinia nunc. Donec in auctor purus, eu tempor massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent non ullamcorper libero, eu luctus tellus. Morbi sit amet interdum erat, semper posuere sapien. Integer sit amet magna eu diam dictum eleifend. Pellentesque vulputate egestas malesuada. Nam a volutpat enim.\n\nDonec fermentum nisl id massa vulputate, sed aliquet orci hendrerit. Ut tempus at massa eget hendrerit. Proin bibendum a ante nec euismod. Ut blandit mi mauris, vitae faucibus est condimentum eu. Etiam nulla sem, tempor sed tellus a, maximus placerat eros. Fusce non augue at mi dignissim condimentum. Sed vitae vulputate ex. Vestibulum condimentum elit in blandit viverra. Quisque tempor, tellus eget accumsan pulvinar, nunc nisi sagittis mauris, nec elementum sem nisl sed mi. Suspendisse vulputate sodales eros ac faucibus. Nulla non maximus diam, in vehicula purus. Nulla ut justo massa. Curabitur at urna eros. Suspendisse quis nisi erat. Curabitur eu tincidunt turpis.\n\n";
	sz = 42000;

	vs = vector_test_resize(vs, val, sz);

	sz = 420;
	vs = vector_test_reserve(vs, sz);

	// stress test!
	std::cerr << "Don't worry: Stress test begins here, right now (4 200 000 inserted values and manip)\n It could take a certain time, do not panic, do not give up, do not ^C\n";
	sz = 4200000;
	//sz = 4200;
	vs = vector_test_reserve(vs, sz);
	
	test_empty_copy_constructor<vec_vt>();
	test_copy_constructor(vs);
	
	vec_vt	vs2(vs);
	vec_vt	vs3;

	display_container(vs, outfile);
	display_container(vs2, outfile);
	display_container(vs3, outfile);

	test_compare_2_objects(vs, vs);
	test_compare_2_objects(vs, vs2);
	test_compare_2_objects(vs, vs3);

	sz = 420;
	value_type val2("Another bites the dust\n"); 
	try 
	{
		vs3 = vector_test_constructor(vs3, val2, sz);
	}
	catch (std::bad_alloc const& e)
	{
		std::cerr << "Bad alloc error: " << e.what() << std::endl;
		exit(1);
	}
	display_container(vs3, outfile);

	vec_vt	vs4(1277, val2);

	value_type val3("You have been jinxed\n"); 
	vs4 = vector_test_assign(vs4, val3, sz);
	display_container(vs4, outfile);

	vs2 = vector_test_erase(vs2);
	display_container(vs2, outfile);

	vec_vt	vs5(sz, val2);
	sz = 7777;
	vec_vt	vs6 = vector_test_insert(vs5, val3, sz);
	display_container(vs5, outfile);
	display_container(vs6, outfile);

	std::cerr << "If the next test throws one std::out_of_range error: it is legit, that is the purpose of one of the test.\nBut if there are more, this test has failed\n";
	vector_test_at(vs, val3);

	vector_test_swap(vs4, vs6);

	vector_test_clear(vs);
	vector_test_clear(vs2);
	vector_test_clear(vs3);
	vector_test_clear(vs4);
	vector_test_clear(vs5);
	vector_test_clear(vs6);

#undef TYPE
#undef VALUE_TYPE	
#undef ALLOCATOR_TYPE
#undef VEC_VALUE_TYPE
#define TYPE INT
#define VALUE_TYPE				TYPE
#define ALLOCATOR_TYPE			std::allocator<VALUE_TYPE>
#define VEC_VALUE_TYPE			ft::vector<VALUE_TYPE, ALLOCATOR_TYPE>

	VEC_VALUE_TYPE::size_type	sz2 = 24000;
	VEC_VALUE_TYPE::value_type	val_i(42);
	
	VEC_VALUE_TYPE	vi(sz2, val_i);
	display_container(vi, outfile);

	vector_test_iterators_manip();
	vector_test_reverse_iterators_manip();

	VEC_VALUE_TYPE::size_type	szi = 24;
	VEC_VALUE_TYPE::value_type	val_i2(97);
	
	VEC_VALUE_TYPE	vi2(szi, val_i);
	test_comp_reverse_iter(vi2, val_i2);

	val_i2 = -177;
	std::cerr << "If the next test throws one std::out_of_range error: it is legit, that is the purpose of one of the test.\nBut if there are more, this test has failed\n";
	vector_test_at(vi2, val_i2);
	TIMEFILE_TOTAL(timefile)

	outfile.close();
	timefile.close();
	detail_timefile.close();
	return 0;
}
