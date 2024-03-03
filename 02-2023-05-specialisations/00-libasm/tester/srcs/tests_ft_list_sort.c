#include "libasm_tester.h"
//#include "../includes/libasm_tester.h"

#ifdef BONUS
/*
** begin: tete de liste chainee depuis laquelle ajouter un maillon
** str_to_split: la liste comportera tous les mots de la chaine. Les mots seront splits a espace
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_SORT_L:
** __FILE__:__LINE__:idx_test:valeur_maillon:valeur_split:resultat_comparaison_ok(doit etre a 1 ici):
** __FILE__:__LINE__:idx_test:valeur_maillon:valeur_maillon_suivant:resultat_comparaison_liste_triée(doit etre a 1 ici ou -1 si
** dernier maillon, 0 c'est pas trié en ordre croissant):
*/
void	tests_ft_list_sort(t_list **begin, char *str_to_split) {
	t_list	*p_list = (*begin);
	char	**vals = ft_split(str_to_split, ' ');
	int		last_val_idx = 0;

	for (; vals[last_val_idx]; last_val_idx++);
	--last_val_idx;

	int		fd = open(SORTLL_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);
	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_SORT_L, RESET);
	for (int i = 1, j = last_val_idx; p_list && j >= 0; p_list = p_list->next, i++, j--) {
		assert(STRCMP((char *)p_list->data, vals[j]) == 0);
		//PRINT_TEST(fd, "%d:%s:%s:%d:\n", i , (char *)p_list->data, vals[j], STRCMP((char *)p_list->data, vals[j]) == 0);
	}

	ft_list_sort(begin, _STRCMP);
	p_list = (*begin);

	for (int i = 1, j = last_val_idx; p_list && j >= 0; p_list = p_list->next, i++, j--) {
		if (p_list->next)
			assert(STRCMP((char *)p_list->data, (char *)p_list->next->data) <= 0);
		PRINT_TEST(fd, "%d:%s:%s:%d:\n", i , (char *)p_list->data, ((p_list->next)?(char *)p_list->next->data : ""), ((p_list->next)?STRCMP((char *)p_list->data, (char *)p_list->next->data) < 0 : -1));
	}
	for (int i = 0; vals[i]; free(vals[i]), i++);
	free(vals);
	close(fd);
}
#endif // BONUS
