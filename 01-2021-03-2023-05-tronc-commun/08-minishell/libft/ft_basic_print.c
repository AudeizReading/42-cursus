/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_basic_print.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/08 10:14:27 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/08 10:26:13 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

void	ft_putstr(char *s)
{
	write(1, s, ft_strlen(s));
}

void	ft_putendl(char *s)
{
	ft_putstr(s);
	ft_putstr("\n");
}

void	ft_putnbr(int n)
{
	long int	c;

	c = n;
	if (c < 0)
	{
		ft_putchar('-');
		c = -c;
	}
	if (c / 10 > 0)
		ft_putnbr(c / 10);
	ft_putchar(c % 10 + 48);
}
