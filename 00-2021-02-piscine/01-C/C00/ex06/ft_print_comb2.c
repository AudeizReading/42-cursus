/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_comb2.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/12 09:18:31 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/12 09:57:01 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_print_num(int nb)
{
	int		temp;

	temp = (nb / 10) + '0';
	write(1, &temp, 1);
	temp = (nb % 10) + '0';
	write(1, &temp, 1);
}

void	ft_print_comb2(void)
{
	int		a;
	int		b;
	int		temp;

	a = 0;
	temp = 0;
	while (a <= 98)
	{
		b = a + 1;
		while (b <= 99)
		{
			ft_print_num(a);
			write(1, " ", 1);
			ft_print_num(b);
			if (!((a == 98) && (b == 99)))
				write(1, ", ", 2);
			b++;
		}
		a++;
	}
}
