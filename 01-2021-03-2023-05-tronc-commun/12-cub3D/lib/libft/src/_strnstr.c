/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strnstr.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:06 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:07 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);
int		_strncmp(char const *s1, char const *s2, size_t n);

char	*_strnstr(char const *str, char const *find, size_t len)
{
	size_t	find_len;

	if (*find == '\0')
		return ((char *) str);
	find_len = _strlen(find);
	while (*str != '\0' && len-- >= find_len)
	{
		if (*str == *find
			&& _strncmp(str, find, find_len) == 0)
			return ((char *) str);
		str++;
	}
	return (NULL);
}
