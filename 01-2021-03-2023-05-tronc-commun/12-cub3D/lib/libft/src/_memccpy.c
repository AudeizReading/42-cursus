/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _memccpy.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:30 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:30 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

void	*_memccpy(void *dst, const void *src, int c, size_t n)
{
	size_t	i;
	char	*pt_dst;
	char	*pt_src;

	pt_dst = (char *)dst;
	pt_src = (char *)src;
	i = 0;
	while (i < n)
	{
		pt_dst[i] = pt_src[i];
		if (pt_dst[i] == (char)c)
			return ((void *)(dst + i + 1));
		++i;
	}
	return (NULL);
}
