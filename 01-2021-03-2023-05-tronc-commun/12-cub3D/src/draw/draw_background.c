/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   draw_background.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:22:43 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:22:43 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "types.h"
#include "defines.h"

void	draw_square(t_data *d, t_vertex a, t_vertex b, int color);
int		get_color(int t, unsigned char c[3]);

void	draw_background(t_data *data)
{
	draw_square(data, (t_vertex){0, 0}, (t_vertex){WIN_W, WIN_H / 2},
		get_color(0, data->rgb[UP]));
	draw_square(data, (t_vertex){0, WIN_H / 2}, (t_vertex){WIN_W, WIN_H},
		get_color(0, data->rgb[DOWN]));
}
