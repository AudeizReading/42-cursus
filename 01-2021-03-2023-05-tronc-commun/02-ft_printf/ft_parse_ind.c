/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_parse_ind.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/07/07 15:27:59 by alellouc          #+#    #+#             */
/*   Updated: 2021/07/09 09:21:48 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libftprintf.h"

t_bool	ft_is_indicator(int c)
{
	if (!ft_strchr("diuxXcsp%", c))
		return (e_false);
	return (e_true);
}

int	ft_parse_ind(char c, va_list args)
{
	int				i;
	int				sum;
	static t_func	tab[] =
	{
		{&(ft_set_ind_c), 'c'},
		{&(ft_set_ind_s), 's'},
		{&(ft_set_ind_d), 'd'},
		{&(ft_set_ind_i), 'i'},
		{&(ft_set_ind_u), 'u'},
		{&(ft_set_ind_x), 'x'},
		{&(ft_set_ind_X), 'X'},
		{&(ft_set_ind_p), 'p'},
		{&(ft_set_ind_percent), '%'},
		{NULL, -1}
	};

	i = -1;
	sum = 0;
	while (tab[i++].key != -1)
		if (tab[i].key == c)
			sum += tab[i].p_func(args);
	return (sum);
}
