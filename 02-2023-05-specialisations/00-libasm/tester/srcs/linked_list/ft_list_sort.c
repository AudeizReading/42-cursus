#include "libasm_tester.h"

#ifdef BONUS
void							ft_list_sort(t_list **begin_list, int (*cmp)()) {
	if (!*begin_list)
		return;
	t_list	*current_node = *begin_list;
	t_list	*tmp;
	t_list	*swap;

	while (current_node) {
		tmp = current_node->next;
		while (tmp) {
			if ((*cmp)(current_node->data, tmp->data) > 0) {
				swap = current_node->data;
				current_node->data = tmp->data;
				tmp->data = swap;
			}
			tmp = tmp->next;
		}
		current_node = current_node->next;
	}
}
#endif // BONUS
