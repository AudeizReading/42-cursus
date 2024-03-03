#include "libasm_tester.h"

char	*ft_substr(char const *s, unsigned int start, size_t len) {
	char	*dst = NULL;
	size_t	len_s = 0;

	if (!s)
		return NULL;

	while (s[len_s++]) ;
	if (len > len_s || (len + start > len_s && start < len_s))
		len = len_s - start;
	if (start >= len_s)
		len = 0;
	dst = (char *)calloc((len + 1), sizeof(*dst));
	if (!dst)
		return NULL;
	memcpy(dst, s + start, len);
	return dst;
}

static char	*ft_slice(char const *s, char c, int *j) {
	int		i = 0;
	char	*dst = NULL;;

	while (s[i] && s[i] != c)
		i++;
	dst = ft_substr(s, 0, i);
	if (!dst)
		return NULL;
	while (s[i] && s[i] == c)
		i++;
	*j += i;
	return dst;
}

static int	ft_is_in_charset(int c, char const *charset) {
	while (*charset) {
		if (c == *charset++)
			return 1;
	}
	return 0;
}

static int	get_nb_token(char const *str, int sep) {
	int		nb = 0;
	enum	e_state {
		OUTSIDE_TOKEN,
		INSIDE_TOKEN
	};
	int		state = OUTSIDE_TOKEN;

	while (*str) {
		if (ft_is_in_charset(*str, (char const *)&sep))
			state = OUTSIDE_TOKEN;
		else if (state == OUTSIDE_TOKEN) {
			state = INSIDE_TOKEN;
			nb++;
		}
		str++;
	}
	return nb;
}

char		**ft_split(char const *s, char c) {
	if (!s)
		return 0;

	int		nb_token = get_nb_token(s, (int)c);
	int		i = -1;
	int		j = 0;
	char	**dst = (char **)calloc(nb_token + 1, sizeof(*dst));
	if (!dst)
		return NULL;
	while (s[j] && s[j] == c)
		j++;
	while (++i < nb_token) {
		dst[i] = ft_slice((s + j), c, &j);
		if (!dst[i]) {
			while (--i >= 0)
				free(dst[i]);
			free(dst);
			return NULL;
		}
	}
	return dst;
}
