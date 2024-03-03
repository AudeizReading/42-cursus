/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/29 15:13:26 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/13 12:51:45 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	ft_atoi(const char *nptr)
{
	int				polarity;
	int				sign;
	long int		atoi;

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

void	*ft_memset(void *b, int c, size_t len)
{
	unsigned char	*p_b;
	unsigned char	c_c;

	p_b = b;
	c_c = c;
	while (len--)
		*p_b++ = c_c;
	return (b);
}

long	get_time(void)
{
	struct timeval	time;

	if (0 != gettimeofday(&time, NULL))
		return (0);
	return (time.tv_sec * 1000 + time.tv_usec / 1000);
}

int	print_msg(t_philo *philo, long tmstmp, int state)
{
	static t_msg	arr_msg[] = {
	{FORK, "%5ld %5d has taken fork\n"},
	{EAT, "%5ld %5d is eating\n"},
	{SLEEP, "%5ld %5d is sleeping\n"},
	{THINK, "%5ld %5d is thinking\n"},
	{DIE, "%5ld %5d died\n"},
	{-1, NULL}
	};
	int				i;

	i = -1;
	while (arr_msg[++i].state != -1)
	{
		if (state == arr_msg[i].state)
		{
			pthread_mutex_lock(philo->display);
			printf(arr_msg[i].msg, tmstmp, philo->id);
			pthread_mutex_unlock(philo->display);
		}
	}
	return (1);
}
