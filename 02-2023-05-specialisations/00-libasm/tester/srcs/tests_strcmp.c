#include "libasm_tester.h"

/*
** strs1: array de char * qu'il faudra comparer
** strs2: array de char * qu'il faudra comparer
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_STRCMP:
** __FILE__:__LINE__:idx_test:retour_strcmp:chaine_src1:chaine_src2:
** __FILE__:__LINE__:idx_test:retour_strcmp:chaine_src2:chaine_src1:
** __FILE__:__LINE__:idx_test:retour_strcmp:&chaine_src1[1]:&chaine_src2[1]:
** __FILE__:__LINE__:idx_test:retour_strcmp:&chaine_src1[1]:&chaine_src2[2]:
*/
void	tests_strcmp(char **strs1, char **strs2) {
	int		fd = open(STRCMP_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);
	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_STRCMP, RESET);
	for (int i = 0; strs1[i] != NULL; i++) {
		PRINT_TEST(fd, "%d:%d:%s:%s:\n", i + 1, STRCMP(strs1[i], strs2[i]), strs1[i], strs2[i]);
		PRINT_TEST(fd, "%d:%d:%s:%s:\n", i + 1, STRCMP(strs2[i], strs1[i]), strs2[i], strs1[i]);
		PRINT_TEST(fd, "%d:%d:%s:%s:\n", i + 1, STRCMP(&strs1[i][1], &strs2[i][1]), &strs1[i][1], &strs2[i][1]);
		PRINT_TEST(fd, "%d:%d:%s:%s:\n", i + 1, STRCMP(&strs1[i][1], &strs2[i][2]), &strs1[i][1], &strs2[i][2]);
	}
	close(fd);
}
