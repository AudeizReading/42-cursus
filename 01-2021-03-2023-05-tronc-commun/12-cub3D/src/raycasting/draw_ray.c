/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   draw_ray.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 15:21:36 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/06 15:22:48 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "defines.h"
#include "types.h"
#include "libft.h"
#include "mlx.h"

#include <math.h>

double	fix_angle(double a);
void	get_vertical_ray(t_data *data, t_vars *tmp);
void	get_horizontal_ray(t_data *data, t_vars *tmp);
void	draw_square(t_data *data, t_vertex a, t_vertex b, int color);

static int	get_tex_pixel(t_data *data, t_vars *t, t_dir dir)
{
	return (*(int *)(data->tex[dir] + (int)t->ty * data->tx_w + (int)(t->tx)));
}

void	get_ray_texture(t_data *data, t_vars *t)
{
	while (t->y < t->line_h)
	{
		if ((t->ra < PI2 || t->ra > PI3) && data->p.distv < data->p.dist_h)
			t->tex = get_tex_pixel(data, t, RIGHT);
		else if ((t->ra > PI2 && t->ra < PI3) && data->p.distv < data->p.dist_h)
			t->tex = get_tex_pixel(data, t, LEFT);
		else if ((t->ra > 0 && t->ra < PI) && data->p.distv > data->p.dist_h)
			t->tex = get_tex_pixel(data, t, DOWN);
		else
			t->tex = get_tex_pixel(data, t, UP);
		if (t->y + t->line_offset + 3 <= WIN_H)
			draw_square(data, (t_vertex){t->r * 3, t->y + t->line_offset},
				(t_vertex){t->r * 3 + 3, t->y + t->line_offset + 3}, t->tex);
		t->ty += t->ty_step;
		t->y++;
	}
}

static void	compute_draw_ray_1(t_data *data, t_vars *tmp)
{
	if (data->p.distv < data->p.dist_h)
	{
		tmp->rx = data->p.vx;
		tmp->ry = data->p.vy;
		tmp->dist_t = data->p.distv;
	}
	if (data->p.dist_h < data->p.distv)
	{
		tmp->rx = data->p.hx;
		tmp->ry = data->p.hy;
		tmp->dist_t = data->p.dist_h;
	}
	tmp->ca = data->p.a - tmp->ra;
	tmp->ra = fix_angle(tmp->ra);
	tmp->dist_t = tmp->dist_t * cos(tmp->ca);
	tmp->line_h = (CELL_SIZE * WIN_H) / tmp->dist_t;
	tmp->ty_step = data->tx_w / (double)tmp->line_h;
	tmp->ty_off = 0;
}

static void	compute_draw_ray_2(t_data *data, t_vars *tmp)
{
	if (tmp->line_h > WIN_H)
	{
		tmp->ty_off = (tmp->line_h - WIN_H) / 2.0;
		tmp->line_h = WIN_H;
	}
	tmp->line_offset = (WIN_H / 2) - (tmp->line_h >> 1);
	tmp->y = 0;
	tmp->ty = tmp->ty_off * tmp->ty_step;
	if (data->p.distv < data->p.dist_h)
	{
		tmp->tx = (int)(tmp->ry / 2.0) % data->tx_w;
		tmp->tx = 31 - tmp->tx;
	}
	else
	{
		tmp->tx = (int)(tmp->rx / 2.0) % data->tx_w;
		tmp->tx = 31 - tmp->tx;
	}
}

void	cast_rays(t_data *data)
{
	t_vars	tmp;

	tmp.ra = fix_angle(data->p.a - DR * 30);
	tmp.r = 0;
	while (tmp.r < (VIEW_ANGLE * SCALE))
	{
		get_vertical_ray(data, &tmp);
		get_horizontal_ray(data, &tmp);
		compute_draw_ray_1(data, &tmp);
		compute_draw_ray_2(data, &tmp);
		get_ray_texture(data, &tmp);
		tmp.r++;
		tmp.ra += (DR / SCALE);
		tmp.ra = fix_angle(tmp.ra);
	}
}
