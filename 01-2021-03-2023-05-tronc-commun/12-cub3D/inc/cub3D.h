/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cub3D.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 15:39:15 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/06 15:40:23 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CUB3D_H
# define CUB3D_H

# ifndef TYPES_H
#  define TYPES_H

typedef struct s_data	t_data;
typedef struct s_vars	t_vars;

# endif

int		init(t_data *d);
int		parse(char *s, t_data *d);
void	hook(t_data *data);
void	quit(t_data *d, int code, char *msg);

void	draw_background(t_data *d);
void	draw_minimap(t_data *d);

void	cast_rays(t_data *d);
void	get_vertical_ray(t_data *d, t_vars *v);
void	get_horizontal_ray(t_data *d, t_vars *v);
void	get_ray_texture(t_data *d, t_vars *v);

double	fix_angle(double a);
double	dist_2d(double x0, double y0, double x1, double y1);

#endif
