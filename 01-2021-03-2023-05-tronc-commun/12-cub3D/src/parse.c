/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi and allelouc                       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:22:25 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:22:26 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"
#include "types.h"

#include <unistd.h>
#include <stdlib.h>
#include <fcntl.h>

char	*reach_map(char const *buf, t_data *m);
char	**check_map(char const *buf, t_data *data);
void	convert_map(t_data *data);
void	get_playerpos(t_data *d);

static int	_strerror(char const *msg)
{
	_putnl("Error");
	_putnl(msg);
	return (0);
}

static int	invalid_name(char const *s)
{
	char const	*ext = _strrchr(s, '.');

	if (ext && (_strcmp(ext, ".cub") == 0))
		return (0);
	return (1);
}

static int	invalid_tiles(char *buf)
{
	if (_strspn(buf, "10NSEW \n") == _strlen(buf))
		return (0);
	return (1);
}

static int	bad_textures(int *tex[4])
{
	int	i;

	i = -1;
	while (++i < 4)
		if (tex[i] == NULL)
			return (1);
	return (0);
}

int	parse(char *s, t_data *data)
{
	char const	*buf;
	char		*cursor;
	int			fd;

	if (invalid_name(s))
		return (_strerror("Bad extension"));
	fd = open(s, O_RDONLY);
	if (read(fd, 0, 0) != 0)
		return (_strerror("Can't open file"));
	close(fd);
	buf = _getfile(s);
	cursor = reach_map(buf, data);
	if (cursor == 0 || (bad_textures(data->tex) && _free((void *) cursor) == 0))
		return (_strerror("Bad parameters"));
	if (invalid_tiles(cursor))
		return (_strerror("Bad characters"));
	data->map = check_map(cursor, data);
	if (data->map == 0)
		return (_strerror("Invalid map"));
	convert_map(data);
	get_playerpos(data);
	free(cursor);
	return (1);
}
