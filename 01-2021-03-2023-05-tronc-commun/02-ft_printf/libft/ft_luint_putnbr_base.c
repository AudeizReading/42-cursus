/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_luint_putnbr_base.c                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/27 14:12:39 by alellouc          #+#    #+#             */
/*   Updated: 2021/07/09 09:40:29 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_luint_putnbr_base(unsigned long int nbr, char *base, t_bool restart)
{
	unsigned long int	l_nbr;
	int					size_base;
	static int			sum = 0;

	if (restart)
		sum = 0;
	l_nbr = nbr;
	size_base = 0;
	if (ft_check_invalid_base(base, &size_base))
		return (-1);
	if (l_nbr >= (unsigned int)size_base)
		ft_luint_putnbr_base(l_nbr / size_base, base, e_false);
	sum += ft_int_putchar_fd(base[l_nbr % size_base], 1);
	return (sum);
}
