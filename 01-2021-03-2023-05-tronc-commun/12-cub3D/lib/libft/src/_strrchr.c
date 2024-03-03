/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strrchr.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:07 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:08 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);

char	*_strrchr(const char *s, int c)
{
	int	i;

	i = _strlen(s) + 1;
	while (--i >= 0)
		if (s[i] == (char) c)
			return ((char *) &s[i]);
	return (NULL);
}
