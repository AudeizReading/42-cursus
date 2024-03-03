/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memccpy.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/28 16:42:00 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/28 17:17:03 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_memccpy(void *dst, const void *src, int c, size_t n)
{
	unsigned char		*p_dst;
	unsigned const char	*p_src;
	unsigned char		c_c;

	p_dst = dst;
	p_src = src;
	c_c = c;
	while (n--)
	{
		*p_dst++ = *p_src;
		if (*p_src++ == c_c)
			return (p_dst);
	}
	return ((void *)0);
}
