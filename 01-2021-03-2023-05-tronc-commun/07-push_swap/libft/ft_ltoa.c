/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_ltoa.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/29 08:38:39 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/29 08:38:55 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_ltoa(long n)
{
	size_t			len;
	char			*ltoa;
	unsigned long	c;

	c = n;
	len = ft_intlen(c);
	if (ft_isneg(c))
	{
		len++;
		c = -c;
	}
	ltoa = (char *)ft_calloc((len + 1), sizeof(*ltoa));
	if (!ltoa)
		return (NULL);
	ltoa[len] = 0;
	while (len--)
	{
		ltoa[len] = c % 10 + '0' ;
		c /= 10;
	}
	if (ft_isneg(n))
		ltoa[0] = '-';
	return (ltoa);
}
