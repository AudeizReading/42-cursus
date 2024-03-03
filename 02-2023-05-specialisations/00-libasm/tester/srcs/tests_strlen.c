#include "libasm_tester.h"

/*
** strs: array de char * dont il faudra tester la longueur
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_STRLEN:
** __FILE__:__LINE__:idx_test:taille_chaine:valeur_chaine:
*/
void	tests_strlen(char **strs) {
	// Gestion des droits avec open: si on set a 777, umask (ici 022) sera appliqué a la creation et les droits vaudront
	// 755 apres umask.
	int		fd = open(STRLEN_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);

	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_STRLEN, RESET);
	for (int i = 0; strs[i] != NULL; i++) {
		PRINT_TEST(fd, "%d:%zu:%s:\n", i + 1, STRLEN(strs[i]), strs[i]);
	}

	close(fd);
}
