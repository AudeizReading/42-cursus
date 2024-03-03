#include "iter.hpp"

int	main(void)
{
	int		test[] = {0, 1, 1, 2, 4, 7, 13};
	print_iter<int, void>(test, 7, &addTen<int>);

	char	test2[] = "Hello World! Welcome to the 42's jungle";
	print_iter<char, void>(test2, std::strlen(test2), &addTen<char>);

	float	test3[] = {0.1f, 2.3f, 4.5f, 6.7f, 8.9f};
	print_iter<float, void>(test3, 5, &addTen<float>);

	short	test4[5] = {1, -1, -7, 1000, 13 * 7};
	print_iter<short, void>(test4, 5, &addTen<short>);
	return 0;
}
