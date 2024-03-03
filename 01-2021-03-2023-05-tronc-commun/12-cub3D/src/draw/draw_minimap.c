/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   draw_minimap.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:22:44 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:22:45 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "types.h"
#include "defines.h"

void	draw_square(t_data *d, t_vertex a, t_vertex b, int color);

void	draw_minimap(t_data *data)
{
	int	xo;
	int	yo;
	int	x;
	int	y;

	y = 0;
	while (y < data->rows)
	{
		x = 0;
		while (x < data->cols)
		{
			xo = x * CELL_SIZE / 4;
			yo = y * CELL_SIZE / 4;
			if (data->int_map[y * data->cols + x] == 1)
				draw_square(data, (t_vertex){xo, yo},
					(t_vertex){xo + CELL_SIZE / 4, yo + CELL_SIZE / 4},
					0x00BFD9FF);
			else if (data->int_map[y * data->cols + x] == 0)
				draw_square(data, (t_vertex){xo, yo},
					(t_vertex){xo + CELL_SIZE / 4, yo + CELL_SIZE / 4},
					0x00FFF00CC);
			x++;
		}
		y++;
	}
}
