/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   philo.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/12/10 22:50:24 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/13 11:48:44 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PHILO_H
# define PHILO_H
# include <stdio.h>
# include <stdlib.h>
# include <pthread.h>
# include <unistd.h>
# include <sys/time.h>
# include <string.h>

enum	e_state
{
	START,
	FORK,
	EAT,
	SLEEP,
	THINK,
	DIE
};

typedef struct s_philo
{
	int				id;
	int				nb_philos;
	int				ttd;
	int				tte;
	int				tts;
	int				nb_eat;
	int				is_died;
	long			start;
	long			last_meal;
	pthread_mutex_t	*left;
	pthread_mutex_t	*right;
	pthread_mutex_t	*display;
}				t_philo;

typedef struct s_data
{
	int				nb_philos;
	int				ttd;
	int				tte;
	int				tts;
	int				nb_eat;
	t_philo			*philos;
	pthread_mutex_t	*locks;
	pthread_t		*tid;
}				t_data;

typedef struct s_msg
{
	int				state;
	char			*msg;
}				t_msg;

/* args.c */
int		*check_arg(char *arg);
int		**get_args(int argc, char **argv);
void	free_int_array(int **arr);

/* death_threads.c */
int		check_all_eat(t_data *data);
void	launch_death_tester(t_data *data);
void	raz_cnt(int *i, int limit);
int		handle_death(t_data *data, pthread_t tid);
void	*dth(void *arg);

/* init.c */
int		init_philos(t_data *data, t_philo *philos, int i);
t_data	*init_data(int **args, t_data *data);
int		init_threads(t_data *data);
void	set_mutex(t_data *data, int i);
void	destroy_mutex(t_data *data);

/* main.c */
int		sub_main(int argc, char **argv);

/* philos_threads */
int		forks(t_philo *philo);
int		eat(t_philo *philo);
int		sleep_n_think(t_philo *philo);
void	*act(void *arg);
int		launch_philos(t_data *data);

/* utils.c */
int		ft_atoi(const char *nptr);
void	*ft_memset(void *b, int c, size_t len);
long	get_time(void);
int		print_msg(t_philo *philo, long tmstmp, int state);
#endif
