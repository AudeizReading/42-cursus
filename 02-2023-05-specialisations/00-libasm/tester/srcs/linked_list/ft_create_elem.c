#include "libasm_tester.h"

#ifdef BONUS
t_list							*ft_create_elem(void *data) {
	t_list	*elem = malloc(sizeof(t_list));
	if (!elem)
		return NULL;

	elem->data = data;
	elem->next = NULL;
	return elem;
}
#endif // BONUS
