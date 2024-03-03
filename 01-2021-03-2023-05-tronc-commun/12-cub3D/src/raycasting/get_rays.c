/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_rays.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 15:22:42 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/06 15:37:09 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "defines.h"
#include "types.h"
#include "libft.h"
#include "mlx.h"

#include <math.h>

double	dist_2d(double x0, double y0, double x1, double y1);

static void	adjust_ray_angle(t_data *data, t_vars *tmp)
{
	if (tmp->ra == 0 || tmp->ra == PI)
	{
		tmp->rx = data->p.x;
		tmp->ry = data->p.y;
		tmp->dof = data->cols;
	}
}

static void	vertical_suite(t_data *data, t_vars *tmp)
{
	while (tmp->dof < data->cols)
	{
		tmp->mx = (int)(tmp->rx) >> 6;
		tmp->my = (int)(tmp->ry) >> 6;
		tmp->mp = tmp->my * data->cols + tmp->mx;
		if ((tmp->mp > 0) && (tmp->mp < data->cols * data->rows)
			&& data->int_map[tmp->mp] == 1)
		{
			data->p.vx = tmp->rx;
			data->p.vy = tmp->ry;
			data->p.distv = dist_2d(data->p.x,
					data->p.y, data->p.vx, data->p.vy);
			tmp->dof = data->cols;
		}
		else
		{
			tmp->rx += tmp->xo;
			tmp->ry += tmp->yo;
			tmp->dof += 1;
		}
	}
}

static void	horizontal_suite(t_data *data, t_vars *tmp)
{
	while (tmp->dof < data->rows)
	{
		tmp->mx = (int)(tmp->rx) >> 6;
		tmp->my = (int)(tmp->ry) >> 6;
		tmp->mp = tmp->my * data->cols + tmp->mx;
		if ((tmp->mp > 0) && (tmp->mp < data->cols * data->rows)
			&& data->int_map[tmp->mp] == 1)
		{
			data->p.hx = tmp->rx;
			data->p.hy = tmp->ry;
			data->p.dist_h = dist_2d(data->p.x,
					data->p.y, data->p.hx, data->p.hy);
			tmp->dof = data->rows;
		}
		else
		{
			tmp->rx += tmp->xo;
			tmp->ry += tmp->yo;
			tmp->dof += 1;
		}
	}
}

void	get_horizontal_ray(t_data *data, t_vars *tmp)
{
	tmp->dof = 0;
	tmp->a_tan = -1 / tan(tmp->ra);
	data->p.dist_h = 1000000;
	data->p.hx = data->p.x;
	data->p.hy = data->p.y;
	if (tmp->ra > PI)
	{
		tmp->ry = (((int)data->p.y >> 6) << 6) - 0.0001;
		tmp->rx = (data->p.y - tmp->ry) * tmp->a_tan + data->p.x;
		tmp->yo = -CELL_SIZE;
		tmp->xo = -(tmp->yo) * tmp->a_tan;
	}
	if (tmp->ra < PI)
	{
		tmp->ry = (((int)data->p.y >> 6) << 6) + CELL_SIZE;
		tmp->rx = (data->p.y - tmp->ry) * tmp->a_tan + data->p.x;
		tmp->yo = CELL_SIZE;
		tmp->xo = -(tmp->yo) * tmp->a_tan;
	}
	adjust_ray_angle(data, tmp);
	horizontal_suite(data, tmp);
}

void	get_vertical_ray(t_data *data, t_vars *tmp)
{
	tmp->dof = 0;
	tmp->n_tan = -tan(tmp->ra);
	data->p.distv = 1000000;
	data->p.vx = data->p.x;
	data->p.vy = data->p.y;
	if (tmp->ra > PI2 && tmp->ra < PI3)
	{
		tmp->rx = (((int)data->p.x >> 6) << 6) - 0.0001;
		tmp->ry = (data->p.x - tmp->rx) * tmp->n_tan + data->p.y;
		tmp->xo = -CELL_SIZE;
		tmp->yo = -(tmp->xo) * tmp->n_tan;
	}
	if (tmp->ra < PI2 || tmp->ra > PI3)
	{
		tmp->rx = (((int)data->p.x >> 6) << 6) + CELL_SIZE;
		tmp->ry = (data->p.x - tmp->rx) * tmp->n_tan + data->p.y;
		tmp->xo = CELL_SIZE;
		tmp->yo = -(tmp->xo) * tmp->n_tan;
	}
	adjust_ray_angle(data, tmp);
	vertical_suite(data, tmp);
}
