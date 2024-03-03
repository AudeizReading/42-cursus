/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/12/10 23:02:46 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/13 15:51:11 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	sub_main(int argc, char **argv)
{
	int				**args;
	t_data			data;

	args = NULL;
	if (argc == 5 || argc == 6)
	{
		args = get_args(argc, argv);
		if (args == NULL)
		{
			return (0);
		}
		init_data(args, &data);
		init_threads(&data);
		launch_philos(&data);
	//	usleep(1000);
		launch_death_tester(&data);
		destroy_mutex(&data);
		free(data.philos);
		free(data.locks);
		free(data.tid);
		free_int_array(args);
	}
	else
		return (0);
	return (1);
}

int	main(int argc, char **argv)
{
	if (!sub_main(argc, argv))
	{
		printf("Error: argument\n");
		return (1);
	}
	return (0);
}
