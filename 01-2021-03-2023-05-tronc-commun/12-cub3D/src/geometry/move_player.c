/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   move_player.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 15:16:54 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/06 15:22:48 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "defines.h"
#include "types.h"
#include "libft.h"

#include <math.h>

static void	move_player_left(t_data *data, t_vars *v)
{
	if ((cos(data->p.a - PI2) * 5) < 0)
		v->xo = -20;
	else
		v->xo = 20;
	if ((sin(data->p.a - PI2) * 5) < 0)
		v->yo = -20;
	else
		v->yo = 20;
	v->ipx_add_yo = (int)(data->p.y + v->yo) >> 6;
	v->ipx_add_xo = (int)(data->p.x + v->xo) >> 6;
	v->ipx_sub_yo = (int)(data->p.y - v->yo) >> 6;
	v->ipx_sub_xo = (int)(data->p.x - v->xo) >> 6;
	if (data->int_map[v->ipy * data->cols + v->ipx_add_xo] == 0)
		data->p.x += round(cos(data->p.a - PI2) * 5);
	if (data->int_map[v->ipx_add_yo * data->cols + v->ipx] == 0)
		data->p.y += round(sin(data->p.a - PI2) * 5);
}

static void	move_player_right(t_data *data, t_vars *v)
{
	if ((cos(data->p.a - PI2) * 5) < 0)
		v->xo = -20;
	else
		v->xo = 20;
	if ((sin(data->p.a - PI2) * 5) < 0)
		v->yo = -20;
	else
		v->yo = 20;
	v->ipx_add_yo = (int)(data->p.y + v->yo) >> 6;
	v->ipx_add_xo = (int)(data->p.x + v->xo) >> 6;
	v->ipx_sub_yo = (int)(data->p.y - v->yo) >> 6;
	v->ipx_sub_xo = (int)(data->p.x - v->xo) >> 6;
	if (data->int_map[v->ipy * data->cols + v->ipx_sub_xo] == 0)
		data->p.x += round(cos(data->p.a + PI2) * 5);
	if (data->int_map[v->ipx_sub_yo * data->cols + v->ipx] == 0)
		data->p.y += round(sin(data->p.a + PI2) * 5);
}

static void	move_player_up(t_data *data, t_vars *v)
{
	if (data->int_map[v->ipy * data->cols + v->ipx_add_xo] == 0)
		data->p.x += data->p.dx;
	if (data->int_map[v->ipx_add_yo * data->cols + v->ipx] == 0)
		data->p.y += data->p.dy;
}

static void	move_player_down(t_data *data, t_vars *v)
{
	if (data->int_map[v->ipy * data->cols + v->ipx_sub_xo] == 0)
		data->p.x -= data->p.dx;
	if (data->int_map[v->ipx_sub_yo * data->cols + v->ipx] == 0)
		data->p.y -= data->p.dy;
}

void	move_player(t_data *data, t_vars *v, int dir)
{
	if (dir == UP)
		move_player_up(data, v);
	if (dir == DOWN)
		move_player_down(data, v);
	if (dir == LEFT)
		move_player_left(data, v);
	if (dir == RIGHT)
		move_player_right(data, v);
}
