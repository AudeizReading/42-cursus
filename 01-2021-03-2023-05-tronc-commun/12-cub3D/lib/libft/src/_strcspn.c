/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strcspn.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:52 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:53 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strcspn(char *str, char *set)
{
	char	c;
	char	*p;
	char	*s;

	s = str;
	c = *s;
	while (c)
	{
		p = set;
		while (*p)
		{
			if (c == *p++)
				return (s - str);
		}
		s++;
		c = *s;
	}
	return (s - str);
}
