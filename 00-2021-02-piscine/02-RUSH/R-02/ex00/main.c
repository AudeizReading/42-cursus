/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 12:47:05 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 20:06:50 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_strings.h"
#include "ft_errors.h"
#include "ft_file.h"
#include <stdio.h>
#include <stdlib.h>

void	ft_read_dico(int *fd)
{
	char	*line;
	char	c;

	while (ft_read(*fd, &c) > 0)
	{
		line = ft_get_file(*fd);
		ft_putstr(line);
		ft_putstr("To be continued...\n");
	}
	free(line);
	ft_close(*fd);
}

int		handle_args(char *file, char **argv, int *fd)
{
	int		i;
	int		num_2_convert;

	i = 0;
	if (argv[1] && argv[2])
	{
		i = 2;
		file = argv[1];
	}
	else if (argv[1])
		i = 1;
	if ((num_2_convert = ft_atoi(argv[i])) == -2)
	{
		ft_error_arg(-2);
		i = 3;
	}
	if ((*fd = ft_open(file)) == -1)
	{
		ft_error_arg(-1);
		i = 3;
	}
	if (i == 3)
		return (-1);
	return (num_2_convert);
}

int		main(int argc, char **argv)
{
	int		num_2_convert;
	char	*file;
	int		fd;

	file = "numbers.dict";
	if (argc < 2)
		ft_error_arg(2);
	else if (argc > 3)
		ft_error_arg(3);
	else
	{
		if ((num_2_convert = handle_args(file, argv, &fd)) < 0)
			return (-1);
		ft_read_dico(&fd);
	}
	return (0);
}
