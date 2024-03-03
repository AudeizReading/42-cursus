/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_get_map.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 19:26:42 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/09 15:03:21 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_check_line(t_line *tmp, t_line **map)
{
	if (!tmp)
	{
		if (*map)
			ft_map_clear(map, free);
		ft_parse_map_error(1024);
	}
}

void	ft_set_map(int gnl, char *line, int *y, t_line **map)
{
	t_line	*tmp;

	if (gnl)
	{
		tmp = ft_init_line(line, (*y)++);
		ft_check_line(tmp, map);
		ft_map_addback(map, tmp);
	}
}

t_line	*ft_get_map(int fd)
{
	t_line	*map;
	int		gnl;
	int		y;
	char	*line;

	gnl = 1;
	y = 0;
	map = NULL;
	line = NULL;
	while (gnl > 0)
	{
		gnl = get_next_line(fd, &line);
		if (!line)
			return (NULL);
		ft_set_map(gnl, line, &y, &map);
		free(line);
	}
	if (gnl == -1)
		ft_parse_map_error(errno);
	return (map);
}

int	ft_open_map(char *file)
{
	int	fd;

	fd = open(file, O_RDONLY);
	if (fd == -1)
		ft_parse_map_error(errno);
	return (fd);
}
