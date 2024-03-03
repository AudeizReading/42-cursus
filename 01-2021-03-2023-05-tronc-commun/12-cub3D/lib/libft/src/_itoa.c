/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _itoa.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:28 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:29 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>

static int	get_digits(unsigned int n);

char	*_itoa(int n)
{
	char			*str;
	int				size;
	int				neg;
	unsigned int	nb;

	neg = 0;
	nb = n;
	if (n < 0 && ++neg)
		nb = -n;
	size = get_digits(nb) + neg;
	str = malloc(size + 1);
	if (!str)
		return (0);
	str[size] = 0;
	while (size--)
	{
		str[size] = nb % 10 + '0';
		nb /= 10;
	}
	if (neg)
		str[0] = '-';
	return (str);
}

static int	get_digits(unsigned int n)
{
	int	size;

	size = 1;
	while (n > 9)
	{
		n /= 10;
		size++;
	}
	return (size);
}
