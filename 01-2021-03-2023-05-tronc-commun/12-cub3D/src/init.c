/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi and allelouc                       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:22:20 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:22:21 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "defines.h"
#include "types.h"
#include "cub3D.h"
#include "mlx.h"

#include <math.h>

void	init_player(t_data *d)
{
	d->p.x = d->p.x * CELL_SIZE + CELL_SIZE / 2;
	d->p.y = d->p.y * CELL_SIZE + CELL_SIZE / 2;
	if (d->p.dir == 'N')
		d->p.a = PI3;
	else if (d->p.dir == 'S')
		d->p.a = PI2;
	else if (d->p.dir == 'W')
		d->p.a = PI;
	else if (d->p.dir == 'O')
		d->p.a = 0;
	d->p.dx = cos((*d).p.a) * 5;
	d->p.dy = sin((*d).p.a) * 5;
}

int	init(t_data *d)
{
	d->mlx = mlx_init();
	d->win = mlx_new_window(d->mlx, WIN_W, WIN_H, WIN_T);
	d->img = mlx_new_image(d->mlx, WIN_W, WIN_H);
	d->addr = mlx_get_data_addr(d->img, &d->bpp, &d->ll, &d->endian);
	d->map = 0;
	d->int_map = 0;
	if (d->mlx && d->win && d->img && d->addr)
		return (1);
	return (0);
}
