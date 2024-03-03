#include "libasm_tester.h"

#ifdef BONUS
int								ft_list_size(t_list *begin_list) {
	int	size = 0;

	while (begin_list) {
		size++;
		begin_list = begin_list->next;
	}
	return size;
}
#endif // BONUS
