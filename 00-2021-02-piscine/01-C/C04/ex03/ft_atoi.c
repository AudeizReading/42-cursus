/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atoi.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/21 20:20:44 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/22 09:29:14 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

int		ft_isspace(char str)
{
	if (str == 32 || (str >= 9 && str <= 13))
		return (1);
	return (0);
}

int		ft_atoi(char *str)
{
	int		atoi;
	int		minus;

	atoi = 0;
	minus = 0;
	while (ft_isspace(*str))
		str++;
	while (*str == 43 || *str == 45)
	{
		if (*str == 45)
			minus++;
		str++;
	}
	while (*str >= 48 && *str <= 57)
	{
		atoi = atoi * 10 + (*str - 48);
		str++;
	}
	if (minus % 2)
		atoi = -atoi;
	return (atoi);
}
