#include <tests_42.hpp>

std::ofstream outfile(OUTFILE, std::ios::out | std::ios::app);
std::ofstream timefile(TIMEFILE, std::ios::out | std::ios::app);
std::ofstream detail_timefile(DETAIL_TIMEFILE, std::ios::out | std::ios::app);

int main(int argc, char** argv) {
	if (argc != 2)
	{
		std::cerr << "Usage: ./test seed" << std::endl;
		std::cerr << "Provide a seed please" << std::endl;
		std::cerr << "Count value:" << COUNT << std::endl;
		return 1;
	}

	if (!outfile || !timefile || !detail_timefile)
	{
		std::cerr << "A problem occurs while creating logs file...\n";
		exit(1);
	}
	outfile << NAMESPACE << " - MAIN 42 TESTING\n";
	std::cerr << NAMESPACE << " - MAIN 42 TESTING\n";
	timefile << NAMESPACE << " - MAIN 42 TESTING\n";
	const int seed = atoi(argv[1]);
	srand(seed);

	INIT_TIMER
	START_TIMER
	ft::vector<std::string> vector_str;
	RESET_TIMER("ft::vector<std::string>, default constructor", detail_timefile)
	ft::vector<int> vector_int;
	RESET_TIMER("ft::vector<int>, default constructor", detail_timefile)
	ft::stack<int> stack_int;
	RESET_TIMER("ft::statck<int>, default constructor", detail_timefile)
	ft::vector<Buffer> vector_buffer;
	RESET_TIMER("ft::vector<Buffer>, default constructor", detail_timefile)
	ft::stack<Buffer, std::deque<Buffer> > stack_deq_buffer;
	RESET_TIMER("ft::statck<Buffer, std::deque<Buffer> >, default constructor", detail_timefile)
	ft::map<int, int> map_int;
	RESET_TIMER("ft::map<int, int>, default constructor", detail_timefile)

	for (int i = 0; i < COUNT; i++)
	{
		vector_buffer.push_back(Buffer());
		RESET_TIMER("vector_buffer.push_back(Buffer())", detail_timefile)
	}

	for (int i = 0; i < COUNT; i++)
	{
		const int idx = rand() % COUNT;
		vector_buffer[idx].idx = 5;
		RESET_TIMER("vector_buffer[idx].idx = 5", detail_timefile)
	}
	ft::vector<Buffer>().swap(vector_buffer);
	RESET_TIMER("ft::vector<Buffer>().swap(vector_buffer)", detail_timefile)

	try
	{
		for (int i = 0; i < COUNT; i++)
		{
			const int idx = rand() % COUNT;
			vector_buffer.at(idx);
			RESET_TIMER("vector_buffer.at(idx);", detail_timefile)
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
		RESET_TIMER("map_int.insert(ft::make_pair(rand(), rand())", detail_timefile)
	}

	STOP_TIMER
	display_container(map_int, outfile);
	START_TIMER
	int sum = 0;
	for (int i = 0; i < 10000; i++)
	{
		int access = rand();
		sum += map_int[access];
		RESET_TIMER("sum += map_int[access]", detail_timefile)
	}
	STOP_TIMER
	display_container(map_int, outfile);
	START_TIMER
	outfile << "should be constant with the same seed: " << sum << std::endl;

	{
		ft::map<int, int> copy = map_int;
		RESET_TIMER("ft::map<int, int> copy = map_int;", detail_timefile)
		STOP_TIMER
		display_container(copy, outfile);
		START_TIMER
	}

	MutantStack<char> iterable_stack;
	RESET_TIMER("MutantStack<char> iterable_stack, default constructor (inherited from a ft::Stack)", detail_timefile)
	for (char letter = 'a'; letter <= 'z'; letter++)
	{
		iterable_stack.push(letter);
		RESET_TIMER("iterable_stack.push(letter)", detail_timefile)
	}
	for (MutantStack<char>::iterator it = iterable_stack.begin(); it != iterable_stack.end(); it++)
	{
		outfile << *it;
		RESET_TIMER("MutantStack<char>::iterator it, operator*, operator++(int)", detail_timefile)
	}
	STOP_TIMER
	outfile << "\n";
	display_container(iterable_stack, outfile);
	START_TIMER
	END_TIMER("MutantStack<char>::iterator it, operator*, operator++(int)", detail_timefile)
	
	TIMEFILE_TOTAL(timefile)

	outfile.close();
	timefile.close();
	detail_timefile.close();
	return (0);
}
