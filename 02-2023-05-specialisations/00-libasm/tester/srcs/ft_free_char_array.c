#include "libasm_tester.h"

void	ft_free_char_array(char **arr) {
	if (*arr) {
		for (int i = 0; arr[i]; free(arr[i]), i++);
		free(arr);
	}
}
