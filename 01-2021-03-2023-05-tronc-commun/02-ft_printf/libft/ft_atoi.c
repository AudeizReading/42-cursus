/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/24 09:51:26 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/27 20:49:08 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_atoi(const char *nptr)
{
	int			polarity;
	int			sign;
	long int	atoi;

	polarity = 1;
	sign = 0;
	atoi = 0;
	while (ft_isspace(*nptr))
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
	while (ft_isdigit(*nptr))
	{
		atoi = atoi * 10 + *nptr - '0';
		nptr++;
	}
	atoi *= polarity;
	return ((int)atoi);
}
