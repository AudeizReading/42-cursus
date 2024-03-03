#include "libasm_tester.h"

#ifdef BONUS
/*
** begin: tete de liste chainee depuis laquelle ajouter un maillon
**
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_SIZE_L:
** __FILE__:__LINE__:final_assert:list_size:size_check:
*/
void	tests_ft_list_size(t_list **begin) {

	int		fd = open(SIZELL_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	if (fd == -1)
		exit(1);
	PRINT_TEST(fd, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_SIZE_L, RESET);
	int		size_check = 0;
	int		list_size = ft_list_size((*begin));
	t_list	*p_list = (*begin);

	for (; p_list; p_list = p_list->next, size_check++);
	assert(size_check == list_size);
	PRINT_TEST(fd, "%s:%d:%d:\n", "final_assert", list_size, size_check);
	close(fd);
}
#endif // BONUS
