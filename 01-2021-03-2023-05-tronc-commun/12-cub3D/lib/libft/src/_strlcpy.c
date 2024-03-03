/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strlcpy.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:58 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:59 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);
void	*_memcpy(void *dst, void const *src, size_t len);

size_t	_strlcpy(char *dst, char const *src, size_t len)
{
	const size_t	srclen = _strlen(src);

	if (srclen < len)
	{
		_memcpy(dst, src, srclen + 1);
	}
	else if (len != 0)
	{
		_memcpy(dst, src, len - 1);
		dst[len - 1] = '\0';
	}
	return (srclen);
}
