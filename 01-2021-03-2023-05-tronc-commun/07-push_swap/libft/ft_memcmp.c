/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_memcmp.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/28 11:34:34 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/29 10:22:00 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_memcmp(const void *s1, const void *s2, size_t n)
{
	unsigned const char	*p_s1;
	unsigned const char	*p_s2;

	if (!n)
		return (0);
	p_s1 = s1;
	p_s2 = s2;
	while (n--)
	{
		if (*p_s1 != *p_s2)
			return ((int)(*p_s1 - *p_s2));
		p_s1++;
		p_s2++;
	}
	return (0);
}
