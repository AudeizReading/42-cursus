/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _stpncpy.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:48 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:49 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

void	*_memset(void *dst, int c, size_t len);
void	*_memcpy(void *dst, void const *src, size_t len);
size_t	_strnlen(char const *s, size_t maxlen);

char	*_stpncpy(char *dst, char const *src, size_t len)
{
	size_t const	size = _strnlen(src, len);

	_memcpy(dst, src, size);
	dst += size;
	if (size == len)
		return (dst);
	return (_memset(dst, '\0', len - size));
}
