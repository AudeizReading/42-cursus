/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _stpcpy.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:46 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:47 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);
void	*_memcpy(void *dst, void const *src, size_t len);

char	*_stpcpy(char *dst, char const *src)
{
	size_t const	len = _strlen(src);

	return (len + _memcpy(dst, src, len + 1));
}
