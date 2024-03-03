/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/05/31 10:23:24 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/11 08:10:58 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line.h"
#include <stdio.h>
#include <fcntl.h>

size_t	ft_strlen(char *s);
void	ft_putstr_fd(char *str, int fd, int toggle);

size_t	ft_strlen(char *s)
{
	size_t	len = 0;
	while (s[len])
		len++;
	return len;
}

void	ft_putstr_fd(char *str, int fd, int toggle)
{
	if (str)
		write(fd, str, ft_strlen(str));
	if (toggle)
		write(fd, "\n", 1);
}

int	main(int argc, char **argv)
{
	char	*line;
	size_t	fd;
//	int		gnl;

	if (argc == 2)
		fd = open(argv[1], O_RDONLY);
	else
		fd = 0;
	// subject has changed since
	while ((line = get_next_line(fd)))
	{
		ft_putstr_fd(fd, line, 1);
		free(line);
	}
	if (line)
	{
		ft_putstr_fd(fd, line, 1);
		free(line);
	}
/*	while ((gnl = get_next_line(fd, &line)) > 0)
	{
		ft_putstr_fd(line, 1);
		ft_putstr_fd("\n", 1);
		free(line);
	}
	if (gnl == -1)
		ft_putstr_fd("Votre gnl a rencontré un souci\n", 1);
	if (line)
	{
		ft_putstr_fd(line, 1);
		ft_putstr_fd("\n", 1);
		free(line);
	}*/
	close(fd);
	return (0);
}
