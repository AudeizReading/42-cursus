/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _memchr.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:31 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:32 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

void	*_memchr(const void *p, int c, size_t len)
{
	char	*ptr;

	ptr = (char *) p;
	while (len-- > 0)
	{
		if (*ptr == (char) c)
			return (ptr);
		ptr++;
	}
	return (NULL);
}
