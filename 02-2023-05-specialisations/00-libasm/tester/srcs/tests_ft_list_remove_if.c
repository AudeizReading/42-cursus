#include "libasm_tester.h"

#ifdef BONUS
/*
** begin: tete de liste chainee depuis laquelle ajouter un maillon
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_REMO_L:
** __FILE__:__LINE__:start:valeur_premier_maillon:taille_liste:
** __FILE__:__LINE__:remove_first:valeur_maillon_a_supprimer:taille_liste:
** __FILE__:__LINE__:idx_test:valeur_maillon_a_supprimer:taille_liste:
** __FILE__:__LINE__:final:taille_liste:
*/
void	tests_ft_list_remove_if(t_list **begin) {
	int		fd = open(REMVLL_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);
	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_REMO_L, RESET);

	t_list	*p_list = (*begin);
	int		list_size = ft_list_size(p_list);
	
	PRINT_TEST(fd, "%s:%s:%d:\n", "start" , (char *)p_list->data, list_size);
	ft_list_remove_if(begin, (char *)(*begin)->data, strcmp, free);

	p_list = (*begin);
	list_size = ft_list_size(p_list);
	PRINT_TEST(fd, "%s:%s:%d:\n", "remove_first" , (char *)p_list->data, list_size);

	int i = 1;
	while (*begin) {
		p_list = (*begin)->next;
		ft_list_remove_if(begin, (char *)(*begin)->data, strcmp, free);
		PRINT_TEST(fd, "%d:%s:%d:\n", i++ , (p_list) ? (char *)p_list->data : "", ft_list_size(*begin));
		(*begin) = p_list;
	}

	PRINT_TEST(fd, "%s:%d:\n", "final", ft_list_size(*begin));
	assert(ft_list_size(*begin) == 0);
	close(fd);
}
#endif // BONUS
