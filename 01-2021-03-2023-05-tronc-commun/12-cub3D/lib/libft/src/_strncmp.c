/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strncmp.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:01 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:02 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);
int		_memcmp(void const *s1, void const *s2, size_t len);

int	_strncmp(char const *s1, char const *s2, size_t len)
{
	if (len > _strlen(s1))
		len = 1 + _strlen(s1);
	else if (len > _strlen(s2))
		len = 1 + _strlen(s2);
	return (_memcmp(s1, s2, len));
}
