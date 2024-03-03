#include "libasm_tester.h"

#ifdef BONUS
void							ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)(), void (*free_fn)(void *)) {
	if (!*begin_list)
		return;
	t_list	*tmp = *begin_list;
	t_list	*prev = NULL;
	if ((*cmp)(tmp->data, data_ref) == 0) {
		(*begin_list) = prev = tmp->next;
		(*free_fn)(tmp->data);
		free(tmp);
		tmp = prev;
	}

	while (tmp) {
		if ((*cmp)(tmp->data, data_ref) == 0) {
			prev->next = tmp->next;
			(*free_fn)(tmp->data);
			free(tmp);
			tmp = prev;
		}
		prev = tmp;
		tmp = tmp->next;
	}
}
//# endif // LIBASM
#endif // BONUS
