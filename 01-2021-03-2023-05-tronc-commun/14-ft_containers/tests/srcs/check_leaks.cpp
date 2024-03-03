#include <tests_42.hpp>

std::ofstream outfile(OUTFILE, std::ios::out | std::ios::app);
std::ofstream treefile(TREEFILE, std::ios::out | std::ios::app);
std::ofstream detail_timefile(DETAIL_TIMEFILE, std::ios::out | std::ios::app);
std::ofstream timefile(TIMEFILE, std::ios::out | std::ios::app);

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
			ft::display_binary_tree_ft_map(std::cout, *it);
		}
#endif

	}
}

// Do not use with other than int/std::string value_type
map_km			make_map_clrs_with_operator_brackets()
{
	map_km	map_clrs; 

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

	return map_clrs;
}

int main(int argc, char** argv) {
	if (argc != 2)
	{
		std::cerr << "Usage: ./test seed" << std::endl;
		std::cerr << "Provide a seed please" << std::endl;
		std::cerr << "Count value:" << COUNT << std::endl;
		return 1;
	}

	if (!outfile || !treefile)
	{
		std::cerr << "A problem occurs while creating logs file...\n";
		exit(1);
	}
	std::cout << NAMESPACE << " - CHECK LEAKS\n";
	std::cout << "If you see, after launching valgrind, some messages like \"Warning: set address range perms: large range [0x1161b4040, 0x1261f4040) (undefined)\", read this for understanding why this is not a problem: https://valgrind-users.narkive.com/Gplulcoy/valgrind-ending-with-warning-set-address-range-perms-large-range\n";
	const int seed = atoi(argv[1]);
	srand(seed);

	ft::vector<std::string> vector_str;
	ft::vector<int> vector_int;
	ft::stack<int> stack_int;
	ft::vector<Buffer> vector_buffer;
	ft::stack<Buffer, std::deque<Buffer> > stack_deq_buffer;
	ft::map<int, int> map_int;

	for (int i = 0; i < COUNT; i++)
	{
		vector_buffer.push_back(Buffer());
	}

	for (int i = 0; i < COUNT; i++)
	{
		const int idx = rand() % COUNT;
		vector_buffer[idx].idx = 5;
	}
	ft::vector<Buffer>().swap(vector_buffer);

	try
	{
		for (int i = 0; i < COUNT; i++)
		{
			const int idx = rand() % COUNT;
			vector_buffer.at(idx);
			std::cerr << "Error: THIS VECTOR SHOULD BE EMPTY!!" <<std::endl;
		}
	}
	catch(const std::exception& e)
	{
		//NORMAL ! :P
	}
	
	for (int i = 0; i < COUNT; ++i)
	{
		map_int.insert(ft::make_pair(rand(), rand()));
	}

	int sum = 0;
	for (int i = 0; i < 10000; i++)
	{
		int access = rand();
		sum += map_int[access];
	}

	{
		ft::map<int, int> copy = map_int;
	}

	MutantStack<char> iterable_stack;
	for (char letter = 'a'; letter <= 'z'; letter++)
	{
		iterable_stack.push(letter);
	}
	for (MutantStack<char>::iterator it = iterable_stack.begin(); it != iterable_stack.end(); it++)
	{
		std::cout << *it;
	}
	std::cout << "\n";

	std::cout << "Here starts the stressful memory checking\nDo not worry if it takes times, this is legit\n";
	map_km	map_clrs = make_map_clrs_with_operator_brackets();
	make_stress_vec_of_map_km(map_clrs);
	
	outfile.close();
	treefile.close();
	timefile.close();
	detail_timefile.close();
	return (0);
}
