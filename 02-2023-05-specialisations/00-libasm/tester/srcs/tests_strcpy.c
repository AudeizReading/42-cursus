#include "libasm_tester.h"

/*
** strs: array de char * qu'il faudra copier
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_STRCPY:
** __FILE__:__LINE__:idx_test:retour_strcpy:chaine_destination:chaine_source:
*/
void	tests_strcpy(char **strs) {
	int		fd = open(STRCPY_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);
	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_STRCPY, RESET);
	for (int i = 0; strs[i] != NULL; i++) {
		char *dst = calloc(sizeof(char *), STRLEN(strs[i]) + 1);
		PRINT_TEST(fd, "%d:%s:%s:%s:\n", i + 1, STRCPY(dst, strs[i]), dst, strs[i]);
		free(dst);
	}
	close(fd);
}
