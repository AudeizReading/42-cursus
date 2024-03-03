#include "libasm_tester.h"

#ifdef BONUS
void							ft_list_push_front(t_list **begin_list, void *data) {
	t_list *tmp = ft_create_elem(data);

	if (!tmp)
		return ;
	tmp->data = data;
	tmp->next = NULL;
	if (!*begin_list) {
		*begin_list = tmp;
		return ;
	}
	tmp->next = *begin_list;
	*begin_list = tmp;
}
#endif // BONUS
