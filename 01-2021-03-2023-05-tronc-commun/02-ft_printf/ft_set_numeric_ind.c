/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_set_numeric_ind.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/07/07 13:52:34 by alellouc          #+#    #+#             */
/*   Updated: 2021/07/09 09:39:16 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libftprintf.h"

int	ft_set_ind_d(va_list args)
{
	int		v_arg;
	int		sum;

	sum = 0;
	v_arg = va_arg(args, int);
	return (sum += ft_putnbr_base(v_arg, "0123456789", e_true));
}

int	ft_set_ind_i(va_list args)
{
	int		v_arg;
	int		sum;

	sum = 0;
	v_arg = va_arg(args, int);
	return (sum += ft_putnbr_base(v_arg, "0123456789", e_true));
}

int	ft_set_ind_u(va_list args)
{
	unsigned int	v_arg;
	int				sum;

	sum = 0;
	v_arg = va_arg(args, unsigned int);
	return (sum += ft_luint_putnbr_base(v_arg, "0123456789", e_true));
}

int	ft_set_ind_x(va_list args)
{
	unsigned int	v_arg;
	int				sum;

	sum = 0;
	v_arg = va_arg(args, unsigned int);
	return (sum += ft_luint_putnbr_base(v_arg, "0123456789abcdef", e_true));
}

int	ft_set_ind_X(va_list args)
{
	unsigned int	v_arg;
	int				sum;

	sum = 0;
	v_arg = va_arg(args, unsigned int);
	return (sum += ft_luint_putnbr_base(v_arg, "0123456789ABCDEF", e_true));
}
