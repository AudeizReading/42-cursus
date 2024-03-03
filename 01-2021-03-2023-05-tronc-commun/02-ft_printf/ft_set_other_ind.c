/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_set_other_ind.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/07/07 14:23:05 by alellouc          #+#    #+#             */
/*   Updated: 2021/07/09 09:39:42 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libftprintf.h"

int	ft_set_ind_c(va_list args)
{
	int	v_arg;
	int	sum;

	sum = 0;
	v_arg = va_arg(args, int);
	return (sum += ft_int_putchar_fd(v_arg, 1));
}

int	ft_set_ind_s(va_list args)
{
	char	*v_arg;
	int		sum;

	sum = 0;
	v_arg = va_arg(args, char *);
	if (!v_arg)
		return (sum += ft_int_putstr_fd("(null)", 1));
	else
		return (sum += ft_int_putstr_fd(v_arg, 1));
}

int	ft_set_ind_p(va_list args)
{
	unsigned long int	v_arg;
	int					sum;

	sum = 0;
	v_arg = va_arg(args, unsigned long int);
	sum += ft_int_putstr_fd("0x", 1);
	return (sum += ft_luint_putnbr_base(v_arg, "0123456789abcdef", e_true));
}

int	ft_set_ind_percent(va_list args)
{
	int	sum;

	(void) args;
	sum = 0;
	return (sum += ft_int_putchar_fd('%', 1));
}
