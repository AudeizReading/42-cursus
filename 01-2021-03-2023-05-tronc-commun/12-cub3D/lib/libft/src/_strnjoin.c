/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strnjoin.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:03 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:04 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);
void	*_calloc(size_t count, size_t size);
char	*_stpncpy(char *dst, char const *src, size_t len);
char	*_stpcpy(char *dst, char const *src);
char	*_strdup(char const *str);

char	*_strnjoin(char const *str, char const *add, size_t len)
{
	char	*ret;
	char	*tmp;

	ret = 0;
	if (len == 0)
		return (_strdup(str));
	ret = _calloc((1 + _strlen(str) + len), sizeof(*ret));
	tmp = ret;
	if (ret)
		_stpncpy(_stpcpy(tmp, str), add, len);
	return (ret);
}
