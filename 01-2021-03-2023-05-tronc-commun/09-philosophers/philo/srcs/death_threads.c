/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   death_threads.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/12/10 22:59:00 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/13 15:52:41 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

void	*dth(void *arg)
{
	int				i;
	t_philo			*philo;
	int				nb_philos;
	long			limit_time;

	philo = (t_philo *)arg;
	nb_philos = philo[0].nb_philos;
	limit_time = 0;
	while (1)
	{
		usleep(2500);
		i = 0;
		while (i < nb_philos)
		{
			limit_time = philo[i].last_meal + philo[i].ttd / 1000;
			if (get_time() - philo[i].start >= limit_time)
			{
				philo[i].last_meal = get_time() - philo[i].start;
				philo[i].is_died = 1;
				return ((void *)0);
			}
			i++;
		}
	}
}

int	check_all_eat(t_data *data)
{
	int				i;

	i = 0;
	if (!data->nb_eat)
		return (0);
	while (i < data->nb_philos)
	{
		if (data->philos[i].nb_eat > 0)
			return (0);
		i++;
	}
	return (1);
}

void	raz_cnt(int *i, int limit)
{
	if (*i + 1 == limit)
	{
		*i = -1;
		usleep(200);
	}
}

int	handle_death(t_data *data, pthread_t tid)
{
	int				i;
	long			time;

	i = 0;
	time = 0;
	while (1)
	{
		//usleep(5000);
		if (data->philos[i].is_died == 1)
		{
			pthread_detach(tid);
			print_msg(&data->philos[i], data->philos[i].last_meal, DIE);
			return (1);
		}
		if (check_all_eat(data))
			return (1);
		raz_cnt(&i, data->nb_philos);
		i++;
	}
}

void	launch_death_tester(t_data *data)
{
	pthread_t		tid;
	pthread_mutex_t	lock;

	pthread_mutex_init(&lock, NULL);
	pthread_mutex_lock(&lock);
	pthread_create(&tid, NULL, dth, data->philos);
	if (handle_death(data, tid))
	{
		pthread_mutex_unlock(&lock);
		pthread_mutex_destroy(&lock);
		return ;
	}
	pthread_mutex_unlock(&lock);
	pthread_mutex_destroy(&lock);
}
