/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   hooks.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi and allelouc                       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:22:18 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:22:19 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "defines.h"
#include "types.h"
#include "cub3D.h"
#include "mlx.h"

#include <math.h>

void	move_player(t_data *data, t_vars *v, int dir);
void	rotate_player(t_data *data, int dir);
void	init_player(t_data *d);
int		print(t_data *data);

static int	quit_msg(t_data *parsed)
{
	quit(parsed, 0, 0);
	return (0);
}

static int	catch_hook(int keycode, t_data *data, t_vars *v)
{
	if (keycode == KB_ESC)
		quit(data, 0, 0);
	else if (keycode == KB_W)
		move_player(data, v, UP);
	else if (keycode == KB_S)
		move_player(data, v, DOWN);
	else if (keycode == KB_A)
		move_player(data, v, LEFT);
	else if (keycode == KB_D)
		move_player(data, v, RIGHT);
	else if (keycode == KB_LEFT)
		rotate_player(data, LEFT);
	else if (keycode == KB_RIGHT)
		rotate_player(data, RIGHT);
	return (1);
}

static void	handler(int keycode, t_data *data)
{
	t_vars	v;

	v.xo = 0;
	v.yo = 0;
	if (data->p.dx < 0)
		v.xo = -20;
	else
		v.xo = 20;
	if (data->p.dy < 0)
		v.yo = -20;
	else
		v.yo = 20;
	v.ipx = data->p.x >> 6;
	v.ipx_add_xo = (int)(data->p.x + v.xo) >> 6;
	v.ipx_sub_xo = (int)(data->p.x - v.xo) >> 6;
	v.ipy = data->p.y >> 6;
	v.ipx_add_yo = (int)(data->p.y + v.yo) >> 6;
	v.ipx_sub_yo = (int)(data->p.y - v.yo) >> 6;
	catch_hook(keycode, data, &v);
}

void	hook(t_data *data)
{
	init_player(data);
	mlx_hook(data->win, 2, 1L << 0, (void *) handler, data);
	mlx_hook(data->win, 17, 0, quit_msg, data);
	mlx_loop_hook(data->mlx, print, data);
	mlx_loop(data->mlx);
}
