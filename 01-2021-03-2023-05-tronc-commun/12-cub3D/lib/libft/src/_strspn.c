/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strspn.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:10 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:11 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strspn(char *str, char *set)
{
	const char	*s = str;
	char		*c;

	while (*str)
	{
		c = set;
		while (*c)
		{
			if (*str == *c)
				break ;
			c++;
		}
		if (*c == '\0')
			break ;
		str++;
	}
	return (str - s);
}
