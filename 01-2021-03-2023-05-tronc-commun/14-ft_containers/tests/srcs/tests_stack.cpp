#include <tests_stack.hpp>

std::ofstream outfile(OUTFILE, std::ios::out | std::ios::app);
std::ofstream timefile(TIMEFILE, std::ios::out | std::ios::app);
std::ofstream detail_timefile(DETAIL_TIMEFILE, std::ios::out | std::ios::app);
std::ofstream treefile(TREEFILE, std::ios::out | std::ios::app);

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

int	main(void)
{
	if (!outfile || !timefile || !detail_timefile || !treefile)
	{
		std::cerr << "A problem occurs while creating logs file...\n";
		exit(1);
	}

	outfile << NAMESPACE << " - STACK TESTING\n";
	std::cerr << NAMESPACE << " - STACK TESTING\n";
	timefile << NAMESPACE << " - STACK TESTING\n";

	map_km	m1 = make_map_clrs_with_operator_brackets();

	INIT_TIMER
	START_TIMER
	ft::stack<map_km, ft::vector<map_km> >	stk_clrs;
	RESET_TIMER("Stack default constructor, ft::stack<map_km, ft::vector<map_km> >", detail_timefile)

	for (int i = 0; i < 10302; ++i)
	{
		stk_clrs.push(m1);
		RESET_TIMER("Stack push", detail_timefile)
	}
	STOP_TIMER
	display_container(stk_clrs, outfile);
#ifndef STD
	ft::display_binary_tree_ft_map(treefile, stk_clrs.top());
#endif

	START_TIMER
	MutantStack<map_km>		mutant_clrs;
	END_TIMER("MutantStack<map_km> default constructor, ft::stack<map_km, ft::vector<map_km> >", detail_timefile)

	for (int i = 0; i < 57894; ++i)
	{
		START_TIMER
		mutant_clrs.push(m1);
		END_TIMER("MutantStack push", detail_timefile)
		display_container(mutant_clrs, outfile);
	}

	START_TIMER
	MutantStack<map_km>::iterator	mut_it = mutant_clrs.begin();
	RESET_TIMER("MutantStack<map_km>::iterator default constructor, mutant_clrs.begin()", detail_timefile)
	MutantStack<map_km>::iterator	mut_max = mutant_clrs.begin() + (mutant_clrs.size() % stk_clrs.size());
	END_TIMER("MutantStack<map_km>::iterator default constructor, mutant_clrs.begin() + (mutant_clrs.size() % stk_clrs.size())", detail_timefile)
	outfile << "What's the result of this calculation? " << (mutant_clrs.size() % stk_clrs.size()) << "\n";
#ifndef STD
	ft::display_binary_tree_ft_map(treefile, *mut_it);
#endif
	for (; mut_it != mut_max; ++mut_it)
	{
		START_TIMER
		if (!stk_clrs.empty())
		{
			stk_clrs.pop();
			RESET_TIMER("Stack<map_km> pop ", detail_timefile)
			display_container(stk_clrs, outfile);
		}
		END_TIMER("MutantStack<map_km>::iterator, operator!= et operator++ ", detail_timefile)
	}
#ifndef STD
	ft::display_binary_tree_ft_map(treefile, mutant_clrs.top());
#endif

	test_compare_2_objects(stk_clrs, stk_clrs, 1);
	test_compare_2_objects(mutant_clrs, mutant_clrs, 1);
	test_copy_constructor(stk_clrs);
	test_copy_constructor(mutant_clrs);
	TIMEFILE_TOTAL(timefile)

	outfile.close();
	timefile.close();
	detail_timefile.close();
	treefile.close();
	return 0;
}
