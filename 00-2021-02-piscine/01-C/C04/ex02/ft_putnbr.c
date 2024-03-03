/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putnbr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/21 20:20:25 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/22 21:00:59 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

void	ft_putnbr(int nb)
{
	long int c;

	c = nb;
	if (c < 0)
	{
		c = -c;
		ft_putchar('-');
	}
	if (c >= 10)
		ft_putnbr(c / 10);
	ft_putchar(c % 10 + '0');
}
