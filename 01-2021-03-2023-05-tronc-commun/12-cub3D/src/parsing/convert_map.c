/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   convert_map.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:23:33 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:23:33 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"
#include "types.h"

#include <stdlib.h>

static void	fill_int_map(t_data *data, int i, int x, int y)
{
	char	*p;

	p = _strchr("NSEW", data->map[y][x]);
	if (p)
	{
		data->p.dir = *p;
		data->int_map[i] = 2;
	}
	else if (!_isdigit(data->map[y][x]))
		data->int_map[i] = -1;
	else
		data->int_map[i] = data->map[y][x] - '0';
}

void	convert_map(t_data *data)
{
	int		y;
	int		x;
	int		i;

	i = 0;
	y = -1;
	data->int_map = _calloc(sizeof(int), (data->rows * data->cols));
	while (data->map[++y])
	{
		x = -1;
		while (data->map[y][++x])
		{
			fill_int_map(data, i, x, y);
			i++;
		}
	}
}
