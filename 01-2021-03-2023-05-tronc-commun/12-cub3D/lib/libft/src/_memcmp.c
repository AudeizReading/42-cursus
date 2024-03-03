/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _memcmp.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:33 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:33 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

int	_memcmp(const void *s1, const void *s2, size_t n)
{
	unsigned char	*pt_s1;
	unsigned char	*pt_s2;

	pt_s1 = (unsigned char *) s1;
	pt_s2 = (unsigned char *) s2;
	while (n--)
	{
		if (*pt_s1 != *pt_s2)
			return (*pt_s1 - *pt_s2);
		if (n)
		{
			pt_s1++;
			pt_s2++;
		}
	}
	return (0);
}
