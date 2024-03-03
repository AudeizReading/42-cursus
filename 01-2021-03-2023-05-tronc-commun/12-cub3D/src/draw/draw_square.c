/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   draw_square.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:22:47 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:22:48 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "types.h"

void	draw_pixel(t_data *d, int x, int y, int color);

void	draw_square(t_data *data, t_vertex a, t_vertex b, int color)
{
	int	i;
	int	j;

	i = a.x;
	j = a.y;
	while (i < b.x)
	{
		j = a.y;
		while (j < b.y)
		{
			draw_pixel(data, i, j, color);
			j++;
		}
		i++;
	}
}
