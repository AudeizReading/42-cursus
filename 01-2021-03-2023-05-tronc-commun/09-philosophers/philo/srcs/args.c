/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   args.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/12/10 22:57:29 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/13 13:12:13 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "philo.h"

int	*check_arg(char *arg)
{
	char	*p_arg;
	int		*atoi;

	p_arg = arg;
	while (*p_arg >= '0' && *p_arg <= '9')
		p_arg++;
	if (*p_arg)
	{
		printf("invalid argument: %s\n", arg);
		return (NULL);
	}
	atoi = malloc(sizeof(int));
	if (!atoi)
	{
		printf("no atoi malloc\n");
		return (NULL);
	}
	*atoi = ft_atoi(arg);
	if (*atoi < 0)
	{
		printf("invalid argument: %d\n", *atoi);
		free(atoi);
		return (NULL);
	}
	return (atoi);
}

void	free_int_array(int **arr)
{
	int		i;

	i = -1;
	if (!arr)
		return ;
	while (arr[++i])
		free(arr[i]);
	free(arr);
}

int	**get_args(int argc, char **argv)
{
	int		**args;
	char	*p_arg;
	int		i;

	i = -1;
	p_arg = NULL;
	args = malloc(sizeof(int *) * (argc));
	if (!args)
		return (NULL);
	args[argc - 1] = NULL;
	while (++i < argc - 1)
	{
		args[i] = malloc(sizeof(int));
		p_arg = argv[i + 1];
		while (*p_arg >= '0' && *p_arg <= '9')
			p_arg++;
		if (*p_arg)
			return (NULL);
		*args[i] = ft_atoi(argv[i + 1]);
		if (*args[i] <= 0)
			return (NULL);
	}
	return (args);
}
