#include "libasm_tester.h"

#ifdef BONUS
static int						ft_isspace(char str) {
	if (str == 32 || (str >= 9 && str <= 13))
		return 1;
	return 0;
}

static int						get_base(char *base) {
	register int	i = -1;
	char	check[256] = {0};
	while (base[++i]) {
		if (check[(int)base[i]]
				|| base[i] == 43
				|| base[i] == 45 
				|| base[i] <= 32
				|| base[i] >= 126)
			return -1;
		check[(int)base[i]] = '1';
	}
	return i;
}

static int						get_parity(char *str) {
	register int minus = 0;

	while (*str == 43 || *str == 45 || ft_isspace(*str)) {
		if (*str == 45)
			minus++;
		str++;
	}
	if (minus % 2)
		return -1;
	return 1;
}

static char						*trim(char *str) {
	register char *p_str = str;

	while (*p_str == 43 || *p_str == 45 || ft_isspace(*p_str))
		p_str++;
	return (str + (p_str - str));
}

// Ex: ft_atoi_base("123", "0123456789")
int								ft_atoi_base(char *str, char *base) {
	register long int result;
	register int parity, base_int, idx_base;

	result = idx_base = 0;
	base_int = get_base(base);
	if (base_int < 2)
		return 0;
	parity = get_parity(str);
	char	*p_str_trim = trim(str);
	while (*p_str_trim) {
		idx_base = 0;
		while (base[idx_base] != *p_str_trim)
			idx_base++;
		if (idx_base >= base_int)
			return 0;
		result = result * base_int + idx_base;
		p_str_trim++;
	}

	return (int)(result * parity);
}
#endif // BONUS
