/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_itoa.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/04/01 22:28:41 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/04 16:41:12 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_itoa(int n)
{
	size_t		len;
	char		*itoa;
	long int	c;

	c = n;
	len = ft_intlen(c);
	if (ft_isneg(c))
		len++;
	itoa = (char *)ft_calloc((len + 1), sizeof(*itoa));
	if (itoa == NULL)
		return (NULL);
	if (ft_isneg(c))
	{
		itoa[0] = '-';
		c = -c;
	}
	if (c == 0)
		itoa[len - 1] = '0';
	while (c > 0)
	{
		itoa[--len] = c % 10 + '0' ;
		c /= 10;
	}
	return (itoa);
}
