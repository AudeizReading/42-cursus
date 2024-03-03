/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi_base.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/21 20:21:39 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/24 16:29:10 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>

int		ft_isspace(char str)
{
	if (str == 32 || (str >= 9 && str <= 13))
		return (1);
	return (0);
}

char	*ft_skip_unauthorized_ascii(char *str)
{
	char	*p_str;

	p_str = str;
	while (ft_isspace(*p_str) || *p_str == 43 || *p_str == 45)
		p_str++;
	return (str + (p_str - str));
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

int		ft_count_minus(char *str)
{
	int			minus;

	minus = 0;
	while (*str == 43 || *str == 45)
	{
		if (*str == 45)
			minus++;
		str++;
	}
	return (minus);
}

int		ft_atoi_base(char *str, char *base)
{
	int			base_2_convert;
	int			atoi;
	int			minus;
	int			ind_base;

	atoi = 0;
	minus = 0;
	base_2_convert = 0;
	if (ft_check_base(base, &base_2_convert))
		return (0);
	minus = ft_count_minus(str);
	str = ft_skip_unauthorized_ascii(str);
	while (*str)
	{
		ind_base = 0;
		while (base[ind_base] != *str)
			ind_base++;
		if (ind_base >= base_2_convert)
			return (0);
		atoi = atoi * base_2_convert + ind_base;
		str++;
	}
	if (minus % 2)
		atoi = -atoi;
	return (atoi);
}
