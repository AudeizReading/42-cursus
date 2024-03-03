/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _substr.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:14 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:15 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>

size_t	_strlen(char const *s);
char	*_strdup(char const *s);

char	*_substr(char const *s, size_t start, size_t len)
{
	size_t	i;
	size_t	min_len;
	char	*ret;

	if (!s || len <= 0 || start >= _strlen(s))
		return (_strdup(""));
	else
	{
		min_len = _strlen(&s[start]);
		if (min_len < len)
			len = min_len;
		ret = malloc(sizeof(*ret) * (len + 1));
		if (!ret)
			return (NULL);
		i = start;
		while (s[i] && (i - start) < len)
		{
			ret[i - start] = s[i];
			i++;
		}
		ret[i - start] = '\0';
		return (ret);
	}
}
