/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_line.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 21:21:13 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 16:32:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_file.h"
#include <stdlib.h>
#include <stdio.h>

int		ft_size_line(int fd)
{
	int		size;
	char	c;

	size = 1;
	c = 0;
	while (ft_read(fd, &c) > 0)
	{
		if (c != 10)
			size++;
		else
			break ;
	}
	return (size);
}

int		ft_count_line(int fd)
{
	int		size;
	char	c;

	size = 1;
	c = 0;
	while (ft_read(fd, &c) > 0)
	{
		if (c == 10)
			size++;
	}
	return (size);
}

char	*ft_get_file(int fd)
{
	char	c;
	char	*line;
	int		i;

	i = 0;
	c = '\0';
	if ((line = (char *)malloc(sizeof(char) * ft_size_line(fd) + 1)) != NULL)
	{
		while (ft_read(fd, &c) > 0)
		{
			line[i] = c;
			i++;
		}
		line[i] = '\0';
	}
	return (line);
}
