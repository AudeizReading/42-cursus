/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strndup.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:02 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:03 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strnlen(char const *str, size_t len);
void	*_memcpy(void *dst, void const *src, size_t len);
void	*_calloc(size_t count, size_t size);

char	*_strndup(char const *str, size_t len)
{
	size_t const	slen = _strnlen(str, len);
	char			*ret;

	ret = _calloc((1 + slen), sizeof(*ret));
	if (ret)
		_memcpy(ret, str, slen);
	return (ret);
}
