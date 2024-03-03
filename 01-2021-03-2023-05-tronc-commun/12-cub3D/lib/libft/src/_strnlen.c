/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strnlen.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:05 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:05 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

void	*_memchr(void const *p, int c, size_t n);

size_t	_strnlen(char const *str, size_t maxlen)
{
	char	*p;

	p = _memchr(str, 0, maxlen);
	if (p == 0)
		return (maxlen);
	else
		return (p - str);
}
