#include "libasm_tester.h"

/*
** strs: array de char * qu'il faudra copier
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_STRDUP:
** __FILE__:__LINE__:idx_test:chaine_destination:chaine_source:
*/
void							tests_strdup(char **strs) {
	int		fd = open(STRDUP_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);
	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_STRDUP, RESET);
	for (int i = 0; strs[i] != NULL; i++) {
		char *str_dup = STRDUP(strs[i]);
		PRINT_TEST(fd, "%d:%s:%s:\n", i + 1, str_dup, strs[i]);
		free(str_dup);
	}
	close(fd);
}
