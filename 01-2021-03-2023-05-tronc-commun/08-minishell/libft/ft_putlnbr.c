/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putlnbr.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/20 22:05:24 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/20 22:05:40 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_putlnbr(long n)
{
	unsigned long	c;

	if (n < 0)
	{
		ft_putchar('-');
		n = -n;
	}
	c = n;
	if (c / 10 > 0)
		ft_putlnbr(c / 10);
	ft_putchar(c % 10 + 48);
}
