/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putnbr_base.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/27 14:11:15 by alellouc          #+#    #+#             */
/*   Updated: 2021/07/09 09:32:11 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_putnbr_base(int nbr, char *base, t_bool restart)
{
	long int	l_nbr;
	static int	sum = 0;
	int			size_base;

	if (restart)
		sum = 0;
	l_nbr = nbr;
	size_base = 0;
	if (ft_check_invalid_base(base, &size_base))
		return (-1);
	if (l_nbr < 0)
	{
		ft_putchar_fd('-', 1);
		l_nbr = -l_nbr;
		sum++;
	}
	if (l_nbr >= size_base)
		ft_putnbr_base(l_nbr / size_base, base, e_false);
	sum += ft_int_putchar_fd(base[l_nbr % size_base], 1);
	return (sum);
}
