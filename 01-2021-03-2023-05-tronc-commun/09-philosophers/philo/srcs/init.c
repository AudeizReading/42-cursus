/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/12/10 23:00:45 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/13 16:04:18 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	init_philos(t_data *data, t_philo *philos, int i)
{
	ft_memset(philos, '\0', sizeof(*philos));
	philos->nb_philos = data->nb_philos;
	philos->ttd = data->ttd * 1000;
	philos->tte = data->tte * 1000;
	philos->tts = data->tts * 1000;
	philos->nb_eat = data->nb_eat;
	philos->id = i + 1;
	return (1);
}

t_data	*init_data(int **args, t_data *data)
{
	ft_memset(data, '\0', sizeof(*data));
	data->nb_philos = *args[0];
	data->ttd = *args[1];
	data->tte = *args[2];
	data->tts = *args[3];
	if (args[4])
		data->nb_eat = *args[4];
	return (data);
}

void	set_mutex(t_data *data, int i)
{
/*	if (data->philos[i].id == 1)
	{
		data->philos[i].left = &data->locks[data->nb_philos - 1];
		data->philos[i].right = &data->locks[i];
	}
	else*/
		data->philos[i].left = &data->locks[i];
		if (i != 0)
			data->philos[i].right = &data->locks[i - 1];
		else
			data->philos[i].right = &data->locks[data->nb_philos - 1];
	data->philos[i].display = &data->locks[data->nb_philos];
}

int	init_threads(t_data *data)
{
	int	i;

	i = -1;
	data->philos = malloc(sizeof(t_philo) * data->nb_philos);
	data->locks = malloc(sizeof(pthread_mutex_t) * data->nb_philos + 1);
	data->tid = malloc(sizeof(pthread_t) * data->nb_philos);
	while (++i < data->nb_philos)
	{
		init_philos(data, &data->philos[i], i);
		pthread_mutex_init(&data->locks[i], NULL);
	}
	pthread_mutex_init(&data->locks[i], NULL);
	i = -1;
	while (++i < data->nb_philos)
		set_mutex(data, i);
	return (1);
}

void	destroy_mutex(t_data *data)
{
	int	i;
	int	nb_philos;

	i = -1;
	nb_philos = data->nb_philos;
	while (++i <= nb_philos)
	{
		pthread_mutex_destroy(&data->locks[i]);
		if (i < nb_philos)
			pthread_mutex_destroy(data->philos[i].display);
	}
}
