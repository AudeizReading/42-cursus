/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main_bonus.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/02 12:25:09 by alellouc          #+#    #+#             */
/*   Updated: 2021/06/04 10:11:49 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line_bonus.h"
#include <stdio.h>
#include <fcntl.h>

void	ft_putstr_fd(char *str, int fd);

void	ft_putstr_fd(char *str, int fd)
{
	while (*str)
		write(fd, str++, 1);
}

int	main(int argc, char **argv)
{
	char	*line;
	size_t	fd1;
	size_t	fd2;
	size_t	fd3;
	int		gnl;
	int		i = 0;
	size_t fd[3];

	if (argc == 4)
	{
		fd1 = open(argv[1], O_RDONLY);
		fd[0] = fd1;
		fd2 = open(argv[2], O_RDONLY);
		fd[1] = fd2;
		fd3 = open(argv[3], O_RDONLY);
		fd[2] = fd3;
	}
	else
	{
		ft_putstr_fd("Il faut indiquer 3 noms de fichiers en paramètres, sans quoi le programme bonus ne se lancera pas\n", 1);
		return (1);
	}
	while ((gnl = get_next_line(fd[i++], &line)) > 0)
	{
		if (i == 3)
			i = 0;
		printf("\n\033[%dm%s\033[0m\n", 31 + i, line);
	
	}
	if (gnl == -1)
		ft_putstr_fd("Votre gnl a rencontré un souci\n", 1);
	if (line)
	{
		ft_putstr_fd(line, 1);
		ft_putstr_fd("\n", 1);
		free(line);
	}
	close(fd1);
	close(fd2);
	close(fd3);
	return (0);
}

