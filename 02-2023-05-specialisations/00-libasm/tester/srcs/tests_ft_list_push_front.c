#include "libasm_tester.h"

#ifdef BONUS
/*
** begin: tete de liste chainee depuis laquelle ajouter un maillon
** str_to_split: la liste comportera tous les mots de la chaine. Les mots seront splits a espace
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_PUSH_L:
** __FILE__:__LINE__:idx_test:valeur_maillon:valeur_a_copier:
** __FILE__:__LINE__:final_assert:last_index_list:index_check:valeur_dernier_maillon:valeur_premier_maillon:valeur_premier_split:valeur_dernier_split:
*/
void	tests_ft_list_push_front(t_list **begin, char *str_to_split) {

	char	**vals = ft_split(str_to_split, ' ');
	char	*first = NULL;
	char	*last = NULL;
	char	*front_list_val = NULL;
	char	*back_list_val = NULL;
	int		last_index = 0;
	int		fd = open(PUSHFL_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);
	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_PUSH_L, RESET);
	for (int i = 0; vals[i]; i++) {
		ft_list_push_front(begin, STRDUP(vals[i]));
		if (i == 0) {
			first = STRDUP(vals[i]);
			back_list_val = STRDUP((*begin)->data);
		}
		if (vals[i + 1] == NULL) {
			last = STRDUP(vals[i]);
			front_list_val = STRDUP((*begin)->data);
			last_index = i;
		}
		PRINT_TEST(fd, "%d:%s:%s:\n", i + 1, (char *)(*begin)->data, vals[i]);
		free(vals[i]);
	}
	free(vals);

	int		size_check = -1;
	t_list	*p_list = (*begin);
	for (; p_list; p_list = p_list->next, size_check++);
	assert((size_check) == last_index);
	assert(STRCMP(first, back_list_val) == 0);
	assert(STRCMP(last, front_list_val) == 0);
	PRINT_TEST(fd, "%s:%d:%d:%s:%s:%s:%s:\n", "final_assert", last_index, size_check, back_list_val, front_list_val, first, last);
	free(first);
	free(last);
	free(back_list_val);
	free(front_list_val);
	close(fd);
}
#endif // BONUS
