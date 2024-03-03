#include "../includes/libasm_tester.h"

#ifdef BONUS
/*
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_ATOI_B:
** __FILE__:__LINE__:idx_test:retour_atoi_base:str_to_atoi:base_atoi:valeur_attendue:
*/
void							tests_atoi_base() {
	char *atoi_base_tests_datas[42][2] = {
		{"123", "0123456789"},// -> 123
		{"123", "0123456789ABCDEF"},// -> 291
		{"7B", "0123456789ABCDEF"},// -> 123
		{"123", "01"},// -> 0, 2 et 3 ne font pas partie de la base
		{"1111011", "01"},// -> 123
		{"                     123", "0123456789ABCDEF"},// -> 291
		{"                     ---+--+123", "0123456789ABCDEF"},// -> -291
		{"123", "0123456A89ABCDEF"},// -> 0, 2 fois le m char
		{"123", "1"},// -> 0, base < 2
		{"--******** ++-----   123", "0123456789ABCDEF"},// 0, car * non autorié
		{"123", "0123456a89ABCDEF"},// 291
		{"3aa", "0123456a89ABCDEF"},// 887
		{"887", "0123456a89ABCDEF"},// -> 0, normal 7 n'est pas dans la base, et
									// je considere a et A differents sans precision
									// info sup dans le sujet
		{"2147483647", "0123456789"},// INT_MAX
		{"7FFFFFFF", "0123456789ABCDEF"},
		{"01111111111111111111111111111111", "01"},
		{"2147483648", "0123456789"},// overflow INT_MAX
		{"80000000", "0123456789ABCDEF"},
		{"10000000000000000000000000000000", "01"},
		{"-2147483647", "0123456789"},// INT_MIN + 1
		{"-7FFFFFFF", "0123456789ABCDEF"},
		{"-01111111111111111111111111111111", "01"},
		{"-2147483648", "0123456789"},// INT_MIN
		{"-80000000", "0123456789ABCDEF"},
		{"-10000000000000000000000000000000", "01"},
		{"-2147483649", "0123456789"},// INT_MIN - 1
		{"-80000001", "0123456789ABCDEF"},
		{"-10000000000000000000000000000001", "01"},
		{"-1111111111111111", "1"},// -> 0, car base < 2
	};

	long long overflow_max = INT_MAX;
	++overflow_max;
	long long overflow_min = INT_MIN;
	--overflow_min;
	int	expected_value[] = {123, 291, 123, 0, 123, 291, -291, 0, 0, 0, 291, 887, 0, INT_MAX, INT_MAX, INT_MAX, overflow_max, overflow_max, overflow_max, INT_MIN + 1, INT_MIN + 1, INT_MIN + 1, INT_MIN, INT_MIN, INT_MIN, overflow_min, overflow_min, overflow_min, 0};

	int		fd = open(ATOI_B_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);

	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_ATOI_B, RESET);

	for (int i = 0; atoi_base_tests_datas[i][0] != NULL; i++) {
		PRINT_TEST(fd, "%d:%d:%s:%s:%d:\n", i + 1, ft_atoi_base(atoi_base_tests_datas[i][0], atoi_base_tests_datas[i][1]), atoi_base_tests_datas[i][0], atoi_base_tests_datas[i][1], expected_value[i]);
		assert((ft_atoi_base(atoi_base_tests_datas[i][0], atoi_base_tests_datas[i][1])) == expected_value[i]);
	}

	close(fd);
}
#endif // BONUS
