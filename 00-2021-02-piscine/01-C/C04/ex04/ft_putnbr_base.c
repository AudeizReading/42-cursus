/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putnbr_base.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/21 20:21:19 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/24 17:42:57 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

int		ft_check_base(char *base, int *base_2_convert)
{
	while (base[*base_2_convert])
	{
		if (base[*base_2_convert] == base[*base_2_convert + 1]\
				|| base[*base_2_convert] == 43 || base[*base_2_convert] == 45\
				|| base[*base_2_convert] <= 32 || base[*base_2_convert] >= 126)
			return (1);
		(*base_2_convert)++;
	}
	if (*base_2_convert < 2)
		return (1);
	return (0);
}

void	ft_putnbr_base(int nbr, char *base)
{
	long int	c;
	int			base_2_convert;

	base_2_convert = 0;
	if (ft_check_base(base, &base_2_convert))
		return ;
	c = nbr;
	if (c < 0)
	{
		c = -c;
		ft_putchar('-');
	}
	if (c >= base_2_convert)
		ft_putnbr_base(c / base_2_convert, base);
	ft_putchar(base[c % base_2_convert]);
}
