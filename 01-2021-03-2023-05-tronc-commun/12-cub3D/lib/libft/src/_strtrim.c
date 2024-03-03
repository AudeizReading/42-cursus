/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strtrim.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:13 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:14 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

char	*_strchr(char const *str, char c);
char	*_strrchr(char const *str, char c);
void	*_calloc(size_t count, size_t size);

char	*_strtrim(char const *str, char const *set)
{
	char	*ret;
	char	*tmp;
	char	*end;

	while (*str && _strchr(set, *str))
		str++;
	end = _strrchr(str, 0);
	while (end > str && _strchr(set, *(end - 1)))
		end--;
	ret = _calloc(1 + (end - str), sizeof(*str));
	tmp = ret;
	if (ret)
		while (str < end)
			*tmp++ = *str++;
	return (ret);
}
