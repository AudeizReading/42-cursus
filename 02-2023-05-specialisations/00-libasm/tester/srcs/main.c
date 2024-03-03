#include "libasm_tester.h"

int main(int argc, char **argv) {

#ifdef	PHASE_ONE
	if (argc == 2 ) {

		char *strings_to_test[42] = {
			&argv[1][STRLEN(argv[1]) / 2],
			argv[1],
			"Hello 42 World",
			"Lorem Ipsum                         ......",
			"",
			"1234567890",
			"123",
			NULL
	};
		char *strings_to_cmp[42] = {
			"Hello 42 World",
			argv[1],
			"Lorem Ipsum                         ......",
			&argv[1][STRLEN(argv[1]) / 2],
			"1234567890",
			"",
			"123",
			NULL
	};
		
		select_test(TEST_STRLEN, strings_to_test);
		select_test(TEST_STRCPY, strings_to_test);
		select_test(TEST_STRCMP, strings_to_test, strings_to_cmp);
		select_test(TEST_STRDUP, strings_to_cmp);
		select_test(TEST_WRITE, FILE_TEST_WRITE);
# ifdef BONUS
		t_list	*begin = NULL;

		select_test(TEST_FT_LIST_PUSH_FRONT, &begin, argv[1]);
		select_test(TEST_FT_LIST_SIZE, &begin);
		select_test(TEST_FT_LIST_SORT, &begin, argv[1]);
		select_test(TEST_FT_LIST_REMOVE_IF, &begin);
		select_test(TEST_ATOI_BASE);

		if (begin)
			free(begin);
# endif
		return 0;
	}
#endif // PHASE_ONE
#ifdef	PHASE_TWO
	if (argc == 3) {
		char	*author = strdup(argv[1]);
		char	*campus = strdup(argv[2]);
		char	*title = read_file(FILE_TITLE);
		printf("\n");
# ifdef BONUS
		printf("%s%60.60s%s\n\n", COLOR_RES, BONUS, RESET);
# endif // BONUS
		printf("%s%s\n%30.30s - %-30.30s\n%45.45s%s\n\n", COLOR_RES, title, author, campus, __DATE__, RESET);

		int		idx_test = 1;
		compare_files(TEST_STRLEN, REG_STRLEN, FT_STRLEN, &idx_test);
		compare_files(TEST_STRCPY, REG_STRCPY, FT_STRCPY, &idx_test);
		compare_files(TEST_STRCMP, REG_STRCMP, FT_STRCMP, &idx_test);
		compare_files(TEST_STRDUP, REG_STRDUP, FT_STRDUP, &idx_test);
		compare_files(TEST_WRITE, REG_REAWRI, FT_REAWRI, &idx_test);

# ifdef BONUS
		compare_files(TEST_FT_LIST_PUSH_FRONT, REG_PUSHFL, FT_PUSHFL, &idx_test);
		compare_files(TEST_FT_LIST_SIZE, REG_SIZELL, FT_SIZELL, &idx_test);
		compare_files(TEST_FT_LIST_SORT, REG_SORTLL, FT_SORTLL, &idx_test);
		compare_files(TEST_FT_LIST_REMOVE_IF, REG_REMVLL, FT_REMVLL, &idx_test);
		compare_files(TEST_ATOI_BASE, REG_ATOI_B, FT_ATOI_B, &idx_test);
# endif // BONUS
		compare_files(TEST_LEAKS, REG_LEAKS, FT_LEAKS, &idx_test);
		free(author);
		free(campus);
		free(title);

		return 0;
	}
#endif // PHASE_TWO
	return 1;
}
