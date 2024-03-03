#include <iostream>
#include "Array.hpp"
#define MAX_VAL 750

int	main(void)
{
	Array<int>	*a1 = new Array<int>(42);

	std::cout << "a1->size(): "	<< a1->size()	<< std::endl;
	(*a1)[0] = 42;
	std::cout << "(*a1)[0]: "	<< (*a1)[0]	<< std::endl;

	Array<int> a2;

	a2 = *a1;
	std::cout << "a2 is the copy of a1\na2.size(): "	<< a2.size()	<< std::endl;
	std::cout << "a2[0]: "	<< a2[0]	<< std::endl;
	a2[0] = 21;
	std::cout << "a2[0]: "	<< a2[0]	<< std::endl;
	std::cout	<< std::boolalpha	<< "checking if (*a1)[0] has been updated too, when a2[0] was: "	<< (((*a1)[0] == a2[0]) ? true : false) << std::endl;
	delete a1;

	try {
		Array<float>	test(42000);
		test[0] = 42;
		std::cout	<< "test[0]: "	<< test[0] << std::endl;
		Array<float>	retest;
		Array<float>	copy = test;

		std::cout << "test.size(): "	<< test.size()	<< std::endl;
		std::cout << "retest.size(): "	<< retest.size()	<< std::endl;
		std::cout << "copy - of variable test - .size(): "	<< copy.size()	<< std::endl;
		std::cout	<< "before updating - copy[0]: "	<< copy[0] << std::endl;
		copy[0] = 4242.4242f;
		std::cout	<< "after updating - copy[0]: "	<< copy[0] << std::endl;
		std::cout	<< std::boolalpha	<< "checking if test[0] has been updated too, when copy[0] was: "	<< ((test[0] == copy[0]) ? true : false) << std::endl;
		std::cout	<< "trying to access at index -42 of test:\n"	<< test[-42] << std::endl;

	}
	catch (std::exception &e) {
		std::cerr	<< "["	<< e.what()	<< "] attempting to access at a wrong Array[index]"	<< std::endl;
	}

	// main implementation provided by 42 network
	 Array<int> numbers(MAX_VAL);
    int* mirror = new int[MAX_VAL];
    srand(time(NULL));
    for (int i = 0; i < MAX_VAL; i++)
    {
        const int value = rand();
        numbers[i] = value;
        mirror[i] = value;
    }
    //SCOPE
    {
        Array<int> tmp = numbers;
        Array<int> test(tmp);
    }

    for (int i = 0; i < MAX_VAL; i++)
    {
        if (mirror[i] != numbers[i])
        {
            std::cerr << "didn't save the same value!!" << std::endl;
            return 1;
        }
    }
    try
    {
        numbers[-2] = 0;
    }
    catch(const std::exception& e)
    {
		std::cerr	<< "["	<< e.what()	<< "] attempting to access at a wrong Array[index]"	<< std::endl;
    }
    try
    {
        numbers[MAX_VAL] = 0;
    }
    catch(const std::exception& e)
    {
		std::cerr	<< "["	<< e.what()	<< "] attempting to access at a wrong Array[index]"	<< std::endl;
    }

    for (int i = 0; i < MAX_VAL; i++)
    {
        numbers[i] = rand();
    }
    delete [] mirror;//
	return 0;
}
