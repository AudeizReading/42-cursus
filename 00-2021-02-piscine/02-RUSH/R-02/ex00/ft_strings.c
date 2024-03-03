/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strings.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 13:24:23 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 14:37:21 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void				ft_putchar(char c)
{
	write(1, &c, 1);
}

void				ft_putstr(char *str)
{
	while (*str)
	{
		ft_putchar(*str);
		str++;
	}
}

int					ft_isspace(char str)
{
	if (str == 32 || (str >= 9 && str <= 13))
		return (1);
	return (0);
}

long long int		ft_atoi(char *str)
{
	long long int		atoi;

	atoi = 0;
	while (*str < 48 || *str > 57)
		return (-2);
	while (*str >= 48 && *str <= 57)
	{
		atoi = atoi * 10 + (*str - 48);
		str++;
	}
	return (atoi);
}
