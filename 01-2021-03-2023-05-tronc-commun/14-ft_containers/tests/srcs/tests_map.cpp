#include <tests_map.hpp>

std::ofstream outfile(OUTFILE, std::ios::out | std::ios::app);
std::ofstream timefile(TIMEFILE, std::ios::out | std::ios::app);
std::ofstream detail_timefile(DETAIL_TIMEFILE, std::ios::out | std::ios::app);
std::ofstream treefile(TREEFILE, std::ios::out | std::ios::app);

// Do not use with other than int/std::string value_type
void			push_back_pair_km(vec_vt& vec, key_type key, mapped_type value)
{
	const value_type	p = MAKE_VALUE_TYPE(key, value);
	vec.push_back(p);
}

vec_vt			make_vector_of_pair_clrs_push_back()
{
	t_clrs	clrs[] = {
		{26, "twenty-six"},	
		{17, "seventeen"},	
		{41, "forty-one"},	
		{14, "fourteen"},	
		{21, "twenty-one"},	
		{30, "thirty"},	
		{47, "forty-seven"},	
		{10, "ten"},	
		{16, "sixteen"},	
		{19, "nineteen"},	
		{23, "twenty-three"},	
		{28, "twenty-eight"},	
		{38, "thirty-eight"},	
		{7, "seven"},	
		{12, "twelve"},	
		{15, "fifteen"},	
		{20, "twenty"},	
		{35, "thirty-five"},	
		{39, "thirty-nine"},	
		{3, "three"},	
	};

	INIT_TIMER
	START_TIMER

	vec_vt		item;

	RESET_TIMER("Vector of pair const int/std::string, default constructor", detail_timefile)

	for (int i = 0; i < get_arr_width(clrs); ++i)
	{
		push_back_pair_km(item, clrs[i].key, clrs[i].value);
	}

	END_TIMER("make_pair\nVector push_back", detail_timefile)

	return item;
}

vec_vt			make_vector_of_pair_size_n(size_t n, mapped_type& unic_value)
{
	vec_vt	v;

	for (size_t i = 0; i < n; ++i)
	{
		push_back_pair_km(v, static_cast<key_type>(i), unic_value);
	}
	return v;
}

map_km			make_stress_map_km(map_km& m, size_t n, mapped_type mv)
{
	mapped_type			value(mv);
	vec_vt				v = make_vector_of_pair_size_n(n, value);

	print_range_iterator(v, v.begin(), v.end(), ft::bidirectional_iterator_tag(), outfile);
	map_test_insert_pos(m, v, outfile);
	display_container(m, outfile);

#ifndef STD
	if (n <= 2000)
	{
		ft::display_binary_tree_ft_map(treefile, m);
	}
#endif
	return m;
}

void			make_stress_vec_of_map_km(map_km& m)
{
	typedef ft::vector<map_km, std::allocator<map_km> > vec_of_map_km;
	typedef vec_of_map_km::iterator						it_v_m_km;
	vec_of_map_km	big_vec_of_map_km(500, m);

	for (it_v_m_km it = big_vec_of_map_km.begin(); it != big_vec_of_map_km.end(); ++it)
	{
		display_container(*it, outfile);
#ifndef STD
		if ((*it).size() <= 2000)
		{
			ft::display_binary_tree_ft_map(treefile, *it);
		}
#endif

	}
}

void			make_full_stress(map_km& m)
{
	make_stress_vec_of_map_km(m);

	mapped_type			value("Big Big big test\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur facilisis id ex at tempor. Nullam venenatis ultrices leo, vel congue metus interdum vitae. Phasellus fermentum libero leo, sed posuere tellus tempus ut. Maecenas non libero eu arcu cursus fringilla sed vitae libero. Curabitur lacus dolor, semper ac viverra eu, ornare id libero. Nam tempor quam sed tempus ullamcorper. Praesent pharetra enim ac varius porta. Donec nec massa gravida, feugiat nisl eu, semper massa. Duis nisi purus, efficitur et laoreet in, elementum id nisl. Nunc vitae dictum purus. Suspendisse nec augue dolor. Etiam eleifend varius risus, sed rhoncus quam varius a. Sed tincidunt rhoncus imperdiet.\n");

	value.reserve(50000); // extended to 50000
	make_stress_map_km(m, 500000, value);
	//make_stress_map_km(m, 5000000, value);
}

// Do not use with other than int/std::string value_type
map_km			make_map_clrs_with_operator_brackets()
{
	INIT_TIMER
	START_TIMER

	map_km	map_clrs; 

	RESET_TIMER("Map default constructor", detail_timefile)

	map_clrs[26]	= "twenty-six";
	map_clrs[17]	= "seventeen";
	map_clrs[41]	= "forty-one";
	map_clrs[14]	= "fourteen";
	map_clrs[21]	= "twenty-one";
	map_clrs[30]	= "thirty";
	map_clrs[47]	= "forty-seven";
	map_clrs[10]	= "ten";
	map_clrs[16]	= "sixteen";
	map_clrs[19]	= "nineteen";
	map_clrs[23]	= "twenty-three";
	map_clrs[28]	= "twenty-eight";
	map_clrs[38]	= "thirty-eight";
	map_clrs[7]		= "seven";
	map_clrs[12]	= "twelve";
	map_clrs[15]	= "fifteen";
	map_clrs[20]	= "twenty";
	map_clrs[35]	= "thirty-five";
	map_clrs[39]	= "thirty-nine";
	map_clrs[3]		= "three";

	END_TIMER("Map default brackets", detail_timefile)

	return map_clrs;
}

// Do not use with other than int/std::string value_type
map_km			map_test_insert_value_type()
{
	typedef ft::pair<map_km::const_iterator, bool>				result_pair;
	t_clrs	clrs[] = {
		{26, "twenty-six"},	
		{17, "seventeen"},	
		{41, "forty-one"},	
		{14, "fourteen"},	
		{21, "twenty-one"},	
		{30, "thirty"},	
		{47, "forty-seven"},	
		{10, "ten"},	
		{16, "sixteen"},	
		{19, "nineteen"},	
		{23, "twenty-three"},	
		{28, "twenty-eight"},	
		{38, "thirty-eight"},	
		{7, "seven"},	
		{12, "twelve"},	
		{15, "fifteen"},	
		{20, "twenty"},	
		{35, "thirty-five"},	
		{39, "thirty-nine"},	
		{3, "three"},	
	};

	INIT_TIMER
	START_TIMER

	map_km				m1;

	RESET_TIMER("Map default constructor", detail_timefile)

	result_pair		p_it_bool;
	for (int i = 0; i < get_arr_width(clrs); ++i)
	{
		RESET_TIMER("dummy loop for", detail_timefile)
		const value_type	p = MAKE_VALUE_TYPE(clrs[i].key, clrs[i].value);
		RESET_TIMER("make_pair", detail_timefile)
		p_it_bool = m1.insert(p);
		RESET_TIMER("Map insert(value_type), + checking return type (a pair witn an iterator and a boolean)", detail_timefile)
		outfile << "p_it_bool.first: ";
		print_associative_iter(p_it_bool.first, outfile);
		outfile << "p_it_bool.second: " << std::boolalpha << p_it_bool.second << "\n";
	}

	END_TIMER("dummy loop for", detail_timefile)

	return m1;
}

// Do not use with other than int/std::string value_type
map_km			map_test_insert_range() // with range of iterators
{

	vec_vt	vec_clrs = make_vector_of_pair_clrs_push_back();

	INIT_TIMER
	START_TIMER

	map_km	map_clrs(vec_clrs.begin(), vec_clrs.end());
	
	RESET_TIMER("Map range constructor (with vector of pair const int/std::string)", detail_timefile)

	vec_key	vk;

	RESET_TIMER("Vector of key_type, default constructor", detail_timefile)
	
	mci	begin = map_clrs.begin();

	RESET_TIMER("Map::iterator default constructor\nMap begin()", detail_timefile)
	
	mci	end = map_clrs.end();

	RESET_TIMER("Map::iterator default constructor\nMap end()", detail_timefile)
	
	mci	it = begin;

	RESET_TIMER("Map::iterator operator=", detail_timefile)
	
	for (; it != end; ++it)
	{
		ft::back_inserter(vk) = it->first;
	}

	END_TIMER("Vector of key_type, back_inserter\nMap::iterator it->first, operator!=, operator++", detail_timefile)

	display_container(vk, outfile);
	display_container(map_clrs, outfile);

	START_TIMER

	const value_type	p = MAKE_VALUE_TYPE(256, "two hundred and fifty-six");

	RESET_TIMER("make_pair", detail_timefile)
	
	map_km	map_clrs2;
	
	RESET_TIMER("Map default constructor", detail_timefile)

	ft::inserter(map_clrs2, map_clrs2.begin()) = p;

	END_TIMER("inserter(map_clrs2, map_clrs2.begin())", detail_timefile)

	display_container(map_clrs2, outfile);

	START_TIMER

	map_km	map_clrs3;
	
	RESET_TIMER("Map default constructor", detail_timefile)
	
	map_clrs3.insert(vec_clrs.begin() + 4, vec_clrs.end() - 3);

	END_TIMER("Map insert(vec_clrs.begin() + 4, vec_clrs.end() - 3), vector iterator operator+, operator-", detail_timefile)

	display_container(map_clrs3, outfile);
	return map_clrs;
}

// for the moment has to work with cont<int, string>
std::ostream&	map_test_insert_pos(map_km& m, vec_vt& v, std::ostream& o)
{
	typedef vec_vt::iterator							vec_iterator;
	typedef vec_vt::const_iterator						vec_const_iterator;
	typedef map_km::iterator							map_iterator;

	INIT_TIMER
	START_TIMER

	vec_iterator		it = v.begin();

	RESET_TIMER("Vector iterator default constructor, vector begin()", detail_timefile)

	vec_const_iterator	end = v.end();
	RESET_TIMER("Vector const iterator default constructor, vector end()", detail_timefile)
	map_iterator		pos = m.begin();
	RESET_TIMER("Map iterator default constructor, map begin()", detail_timefile)

	for (; it != end; ++it) 
	{
		RESET_TIMER("Vector iterator and const iterator operator !=, operator++", detail_timefile)
		pos = m.insert(pos, *it);
		RESET_TIMER("Map insert(pos, value_type)", detail_timefile)
		o << "associative iterator pos: ";
		print_associative_iter(pos, o);
		o << "vector iterator (pair) it: ";
		print_associative_iter(it, o);
	}
	END_TIMER("Vector iterator and const iterator operator !=, operator++", detail_timefile)
	return o;
}

void			map_test_erase_range(map_km& m, size_t n)
{
	// erase the last 10 percent of the map to the end (because, this is with end that troubles may come)
	
	INIT_TIMER
	START_TIMER

	map_km::size_type	size_m = m.size();

	RESET_TIMER("Map size()", detail_timefile)

	outfile << "map_test_erase_range: m.erase(m_it, m_end);\n";
	outfile << "map.size(): " << size_m <<"\n";
	map_km::iterator	m_end = m.end();
	RESET_TIMER("Map iterator, default constructor\nMap end()", detail_timefile)
	map_km::iterator	m_it = m_end--;
	RESET_TIMER("Map iterator, default constructor\nMap end(), operator--(int)", detail_timefile)

	size_t	ten_pc = n / 10;
	for (size_t i = 0; i < ten_pc; ++i, --m_it)
	{
		RESET_TIMER("Map iterator operator--", detail_timefile)
	}
	RESET_TIMER("Map iterator operator--", detail_timefile)
	outfile << "m.erase(m_it, m_end)\n";
	m.erase(m_it, m_end);
	END_TIMER("Map erase(m_it, m_end)", detail_timefile)
	display_container(m, outfile);
}

void			map_test_erase_by_odd_key(map_km& m)
{
	INIT_TIMER
	START_TIMER

	map_km::size_type	size_m = m.size();

	RESET_TIMER("Map size()", detail_timefile)
	
	outfile << "map_test_erase_by_odd_key: m.erase((m_it++)->first);\n";
	outfile << "map.size(): " << size_m <<"\n";
	map_km::iterator	m_beg = m.begin();
	RESET_TIMER("Map iterator, default constructor\nMap begin()", detail_timefile)
	map_km::iterator	m_end = m.end();
	RESET_TIMER("Map iterator, default constructor\nMap end()", detail_timefile)
	map_km::iterator	m_it = m_beg;
	RESET_TIMER("Map iterator, copy assignation m_it = m_beg", detail_timefile)

	m_it++;
	RESET_TIMER("Map iterator, operator++(int)", detail_timefile)
	outfile << "m.erase((m_it++)->first)\n";
	for (; m_it != m_end; )
	{
		RESET_TIMER("Map iterator, operator!=", detail_timefile)
		if (m_it->first % 2)
		{
			m.erase((m_it++)->first);
			RESET_TIMER("Map erase((m_it++)->first) if (m_it->first % 2), operator++(int)", detail_timefile)
		}
		else
		{
			++m_it;
			RESET_TIMER("Map iterator, operator++", detail_timefile)
		}
	}
	END_TIMER("Map iterator, operator!=", detail_timefile)
	display_container(m, outfile);
}

void			map_test_erase_by_position(map_km& m)
{
	INIT_TIMER
	START_TIMER

	map_km::size_type	size_m = m.size();

	RESET_TIMER("Map size()", detail_timefile)
	
	outfile << "map_test_erase_by_position: m.erase(m_it++);\n";
	outfile << "map.size(): " << size_m <<"\n";
	map_km::iterator	m_beg = m.begin();
	RESET_TIMER("Map iterator, default constructor\nMap begin()", detail_timefile)
	map_km::iterator	m_end = m.end();
	RESET_TIMER("Map iterator, default constructor\nMap end()", detail_timefile)
	map_km::iterator	m_it = m_beg;
	RESET_TIMER("Map iterator, copy assignation m_it = m_beg", detail_timefile)

	map_km::size_type s = size_m / 2;

	// go to the middle of the map (it is bidi so we could just iterate on it til mid is found
	for (map_km::size_type i = 0; i < s; ++i, ++m_it)
	{
		RESET_TIMER("Map iterator, operator++", detail_timefile)
	}
	RESET_TIMER("Map iterator, operator++", detail_timefile)
	outfile << "m.erase(m_it++)\n";

	// erase from middle to the end
	for (; m_it != m_end;)
	{
		RESET_TIMER("Map iterator, operator!=", detail_timefile)
		m.erase(m_it++);
		RESET_TIMER("Map iterator, operator++(int)", detail_timefile)
	}
	END_TIMER("Map iterator, operator!=", detail_timefile)
	display_container(m, outfile);
}

map_km			map_test_multi_erase(size_t n, mapped_type& unic_value)
{
	map_km	m;

	m = make_stress_map_km(m, n, unic_value);
	display_container(m, outfile);

	map_test_erase_range(m, n);
	map_test_erase_by_odd_key(m);
	map_test_erase_by_position(m);
	return m;
}

void			test_erase_from_mli_tester()
{

	vec_vt	v = make_vector_of_pair_clrs_push_back();

	INIT_TIMER
	START_TIMER
	map_km	m(v.begin(), v.end()); 
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	RESET_TIMER("map range constructor (with iterator coming from a vector of pair key/mapped value)", detail_timefile)

	m.erase(++m.begin()); // enleve le 7
	RESET_TIMER("map erase(pos), begin()\nmap iterator operator++", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER

	m.erase(m.begin());  // enleve le 3
	RESET_TIMER("map erase(pos), begin()", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	
	m.erase(--m.end()); // enleve le 47
	RESET_TIMER("map erase(pos), begin()\nmap iterator operator--", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER

	m.erase(m.begin(), ++(++(++m.begin()))); 
	RESET_TIMER("map erase(first, last), begin() (x2)\nmap iterator operator++ (x3)", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	
	m.erase(--(--(--m.end())), --m.end()); // enleve 38 et 39
	RESET_TIMER("map erase(first, last), end() (x2)\nmap iterator operator-- (x4)", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	
	m[10] = "Hello";
	RESET_TIMER("map operator[]", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	m[11] = "Hi there";
	RESET_TIMER("map operator[]", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	m.erase(--(--(--m.end())), m.end()); // enleve 30, 35 et 41
	RESET_TIMER("map erase(first, last), end() (x2)\nmap iterator operator-- (x3)", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER

	m[12] = "ONE";
	RESET_TIMER("map operator[]", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	m[13] = "TWO";
	RESET_TIMER("map operator[]", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	m[14] = "THREE";
	RESET_TIMER("map operator[]", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER
	m[15] = "FOUR";
	RESET_TIMER("map operator[]", detail_timefile)
	STOP_TIMER
	display_container(m, outfile);
	START_TIMER

	m.erase(m.begin(), m.end());
	END_TIMER("map erase(first, last), begin() end()", detail_timefile)
	display_container(m, outfile);
}

void			test_ope_rel_from_mli_tester()
{
	INIT_TIMER
	START_TIMER
	ft::map<char, int> mp1;
	ft::map<char, int> mp2;
	RESET_TIMER("map default constructor (x2)", detail_timefile)

	mp1['a'] = 2; mp1['b'] = 3; mp1['c'] = 4; mp1['d'] = 5;
	mp2['a'] = 2; mp2['b'] = 3; mp2['c'] = 4; mp2['d'] = 5;
	END_TIMER("map operator[] mp1 and mp2 (x10)", detail_timefile)

	display_container(mp1, outfile);
	display_container(mp2, outfile);
	outfile << "comparaison mp1 et mp1 (version ft) avant modif de mp1" << std::endl;
	test_compare_2_objects(mp1, mp1, 0); // 0
	outfile << "-------------------------------------" << std::endl;

	outfile << "comparaison mp1 et mp2 (version ft) avant modif de mp1 et de mp2" << std::endl;
	test_compare_2_objects(mp1, mp2, 1); // 1
	outfile << "-------------------------------------" << std::endl;

	START_TIMER
	mp2['e'] = 6; mp2['f'] = 7; mp2['h'] = 8; mp2['h'] = 9;
	END_TIMER("map operator[] mp2 (x4)", detail_timefile)

	display_container(mp2, outfile);
	START_TIMER
	(++(++mp1.begin()))->second = 42; 
	END_TIMER("map (++(++mp1.begin()))->second = 42", detail_timefile)
	display_container(mp1, outfile);
	display_container(mp2, outfile);

	test_compare_2_objects(mp1, mp2, 1); // 2 ne 1, lt 1, le 1
	outfile << "-------------------------------------" << std::endl;

	START_TIMER
	ft::swap(mp1, mp2);
	outfile << NAMESPACE;
	END_TIMER("swap(mp1, mp2)", detail_timefile)

	display_container(mp1, outfile);
	display_container(mp2, outfile);
	outfile << "comparaison mp1 et mp2 (version ft) apres swap mp1 et mp2" << std::endl;
	test_compare_2_objects(mp1, mp2, 1); // 6
	outfile << "-------------------------------------" << std::endl;
}

int	main(void)
{
	if (!outfile || !timefile || !detail_timefile || !treefile)
	{
		std::cerr << "A problem occurs while creating logs file...\n";
		exit(1);
	}

	try {
		outfile << NAMESPACE << " - MAP TESTING\n";
		std::cerr << NAMESPACE << " - MAP TESTING\n";
		timefile << NAMESPACE << " - MAP TESTING\n";

		// == INSERT TESTING ==
		map_km				m1;
		m1 = map_test_insert_value_type();

		// == INSERT TESTING ==
		map_km				m2;
		m2 = make_map_clrs_with_operator_brackets();

		// == INSERT TESTING ==
		map_km				m3;
		m3 = map_test_insert_range();

		// == CONSTRUCTORS TESTING ==
		test_empty_copy_constructor<map_km>();
		test_empty_copy_constructor<vec_key>();
		test_copy_constructor(m2);

		// == RELATIONAL OPERATORS TESTING ==
		test_compare_2_objects(m2, m3);

		map_km				m4;
		test_compare_2_objects(m2, m4);
		if (!test_rel_ops(m2))
		{
			outfile << "Something messed up with the relational operators\n";
		}
		else
		{
			outfile << "[OK]\tRelational Operators\n";
		}

		test_ope_rel_from_mli_tester();

		// == BOUNDARIES TESTING ==
		map_test_low_up_equal_count_find(m2, outfile);
		display_container(m2, outfile);

		// == UPDATE ITERATORS TESTING ==
		test_update_mapped_type_values<map_km, map_km::iterator>(m1, map_km::mapped_type("All the container have been erased by this content"), outfile);
		display_container(m1, outfile);
		test_jinx_mapped_type_values(m3, map_km::mapped_type("\nYou have been jinxed!"), outfile);
		display_container(m3, outfile);

		// == INSERT TESTING ==
		map_km				m5;
		vec_vt				vec_clrs = make_vector_of_pair_clrs_push_back();
		map_test_insert_pos(m5, vec_clrs, outfile);
		display_container(m5, outfile);
		
		// == SWAP TESTING ==
		outfile << "m4.swap(m1) - m4 empty and m1 not";
		test_swap(m4, m1);
		outfile << "m3.swap(m1) - m3 empty and m1 not";
		test_swap(m3, m1);
		outfile << "m4.swap(m3) - m3 empty and m4 not";
		test_swap(m4, m3);

		key_type keys[] = {3, 7, 10, 22, 26, 29, 35, 39, 41, 42, 47, 77, 101, 1024, 2048, 4096, 2048024};

		// == OPERATOR[] TESTING ==
		for (int i = 0; i < get_arr_width(keys); ++i)
		{
			test_associative_operator_brackets(m2, keys[i], ft::bidirectional_iterator_tag());
		}

		// == ERASE TESTING ==
		size_t n = 42000;
		mapped_type m6_mapped("42 000 is a great number for testing stuffs");
		m6_mapped.reserve(4096);
		map_km	m6 = map_test_multi_erase(n, m6_mapped);
		test_erase_from_mli_tester();

		// == CLEAR TESTING ==
		INIT_TIMER
		START_TIMER
		m6.clear();
		END_TIMER("Map clear", detail_timefile)

		// == STRESS TESTING ==
		make_stress_map_km(m5, 250, "What else?");

		// have to reduce the amount of values tested, because takes too long time about 20 min for testing both namespace, and it had made crash my mac, so i do not know how the schools mac would react with my tester...
		std::cerr << "Please, be patient, this is the stressful testing part.\nWe'll try to put 500 000 values into a map of [int / string], and delete it entirely. Also, the string size is extended to 50 000. It could take a certain time (about 10 min for each namespace, because of underlying testing stuffs, input / output streams, time checking, etc.), but stay aware, because we still here!\nSee you after, for the conclusion!" << std::endl;
		make_stress_map_km(m5, 1984, "Big brother is watching you");
		make_stress_vec_of_map_km(m5);
		make_full_stress(m5);
		//make_stress_map_km(m5, 5000000, "A little test");

		// == CLEAR TESTING ==
		START_TIMER
		m5.clear();
		END_TIMER("Map clear", detail_timefile)
		TIMEFILE_TOTAL(timefile)

		outfile.close();
		timefile.close();
		detail_timefile.close();
		treefile.close();
		return 0;
	} 
	catch (std::bad_alloc const& e)
	{
		std::cout << "Error bad alloc: " << e.what() << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cout << "Error out of range: " << e.what() << std::endl;
	}
	catch (std::exception const& e)
	{
		std::cout << "Error exception: " << e.what() << std::endl;
	} 
	outfile.close();
	timefile.close();
	detail_timefile.close();
	treefile.close();
	return 1;
}
