/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   philos_threads.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/12/10 23:03:33 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/10 23:03:36 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	forks(t_philo *philo)
{
	long	time;

	pthread_mutex_lock(philo->left);
	time = get_time() - philo->start;
	print_msg(philo, time, FORK);
	pthread_mutex_lock(philo->right);
	time = get_time() - philo->start;
	print_msg(philo, time, FORK);
	return (1);
}

int	eat(t_philo *philo)
{
	long	time;

	time = get_time() - philo->start;
	print_msg(philo, time, EAT);
	philo->last_meal = time;
	if (philo->nb_eat)
		philo->nb_eat--;
	usleep(philo->tte);
	pthread_mutex_unlock(philo->left);
	pthread_mutex_unlock(philo->right);
	return (1);
}

int	sleep_n_think(t_philo *philo)
{
	long	time;

	time = get_time() - philo->start;
	print_msg(philo, time, SLEEP);
	usleep(philo->tts);
	time = get_time() - philo->start;
	print_msg(philo, time, THINK);
	return (1);
}

void	*act(void *arg)
{
	t_philo	*philo;

	philo = (t_philo *)arg;
	philo->start = get_time();
	if (!(philo->id % 2))
		usleep(philo->tte / 2);
	while (1)
	{
		forks(philo);
		eat(philo);
		sleep_n_think(philo);
	}
	return (NULL);
}

int	launch_philos(t_data *data)
{
	int		i;

	i = -1;
	while (++i < data->nb_philos)
		pthread_create(&data->tid[i], NULL, act, &data->philos[i]);
	return (1);
}
