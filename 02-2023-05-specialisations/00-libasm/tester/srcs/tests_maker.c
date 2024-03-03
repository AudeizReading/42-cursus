#include "libasm_tester.h"

void							select_test(enum e_functions type_test, ...) {
	va_list		args;

	va_start(args, type_test);

	switch (type_test) {
		case TEST_STRLEN: {
				char	**test_strs = va_arg(args, char**);
				tests_strlen(test_strs);
			}
			break;
		case TEST_STRCPY: {
				char	**test_strs = va_arg(args, char**);
				tests_strcpy(test_strs);
			}
			break;
		case TEST_STRCMP: {
				char	**test_strs1 = va_arg(args, char**);
				char	**test_strs2 = va_arg(args, char**);
				tests_strcmp(test_strs1, test_strs2);
			}
			break;
		case TEST_STRDUP: {
				char	**test_strs = va_arg(args, char**);
				tests_strdup(test_strs);
			}
			break;
		case TEST_READ:
		case TEST_WRITE: {
				char	*filename = va_arg(args, char*);
				tests_read_and_write(filename);
			}
			break;
#ifdef BONUS
		case TEST_ATOI_BASE: {
				tests_atoi_base();
			}
			break;
		case TEST_FT_LIST_PUSH_FRONT: {
				t_list	**begin = va_arg(args, t_list **);
				char	*str_to_split = va_arg(args, char *);
				tests_ft_list_push_front(begin, str_to_split);
			}
			break;
		case TEST_FT_LIST_SIZE: {
				t_list	**begin = va_arg(args, t_list **);
				tests_ft_list_size(begin);
			}
			break;
		case TEST_FT_LIST_REMOVE_IF: {
				t_list	**begin = va_arg(args, t_list **);
				tests_ft_list_remove_if(begin);
			}
			break;
		case TEST_FT_LIST_SORT: {
				t_list	**begin = va_arg(args, t_list **);
				char	*str_to_split = va_arg(args, char *);
				tests_ft_list_sort(begin, str_to_split);
			}
			break;
#endif
		default:
			break;
	}
	va_end(args);
}
