/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strlcat.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:57 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:57 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);

size_t	_strlcat(char *dst, const char *src, size_t siz)
{
	char		*d;
	size_t		n;
	size_t		dlen;
	const char	*s;

	d = dst;
	s = src;
	n = siz;
	while (n-- != 0 && *d != '\0')
		d++;
	dlen = d - dst;
	n = siz - dlen;
	if (n == 0)
		return (dlen + _strlen(s));
	while (*s != '\0')
	{
		if (n != 1)
		{
			*d++ = *s;
			n--;
		}
		s++;
	}
	*d = '\0';
	return (dlen + (s - src));
}
