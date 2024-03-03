/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils_bonus.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/17 19:10:47 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/19 19:59:52 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minitalk_bonus.h"

int	ft_atoi(const char *nptr)
{
	int			polarity;
	int			sign;
	long int	atoi;

	polarity = 1;
	sign = 0;
	atoi = 0;
	while (*nptr == 32 || (*nptr >= 9 && *nptr <= 13))
		nptr++;
	while (*nptr == 45 || *nptr == 43)
	{
		if (*nptr == 45)
			polarity = -1;
		sign++;
		nptr++;
	}
	if (sign > 1)
		return (0);
	while (*nptr >= '0' && *nptr <= '9')
	{
		atoi = atoi * 10 + *nptr - '0';
		nptr++;
	}
	atoi *= polarity;
	return ((int)atoi);
}

size_t	ft_strlen(char *str)
{
	size_t		len;

	len = 0;
	if (!str)
		return (0);
	while (str[len])
		len++;
	return (len);
}

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

void	ft_putstr(char *s)
{
	write(1, s, ft_strlen(s));
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
