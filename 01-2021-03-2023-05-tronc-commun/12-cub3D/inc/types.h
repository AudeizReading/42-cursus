/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   types.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 15:40:18 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/06 15:41:01 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef TYPES_H
# define TYPES_H

typedef enum s_dir
{
	UP,
	DOWN,
	LEFT,
	RIGHT
}	t_dir;

typedef struct s_vec2
{
	int	x;
	int	y;
}	t_vertex;

typedef struct s_player
{
	char	dir;
	int		x;
	int		y;
	double	a;
	double	dx;
	double	dy;
	double	dist_h;
	double	distv;
	double	hx;
	double	hy;
	double	vx;
	double	vy;
}	t_player;

typedef struct s_data
{
	void			*mlx;
	void			*win;
	void			*img;
	char			*addr;
	int				bpp;
	int				ll;
	int				endian;
	int				*tex[4];
	int				tx_w;
	int				tx_h;
	unsigned char	rgb[2][3];
	char			**map;
	int				*int_map;
	t_player		p;
	int				rows;
	int				cols;
}	t_data;

typedef struct s_vars
{
	int		r;
	int		mx;
	int		my;
	int		mp;
	int		dof;
	int		line_offset;
	int		y;
	int		line_h;
	int		tex;
	double	rx;
	double	ry;
	double	ra;
	double	xo;
	double	yo;
	double	dist_t;
	double	n_tan;
	double	a_tan;
	double	ty;
	double	tx;
	double	ty_off;
	double	ty_step;
	double	ca;
	int		ipx;
	int		ipy;
	int		ipx_add_xo;
	int		ipx_sub_xo;
	int		ipx_add_yo;
	int		ipx_sub_yo;
}	t_vars;

#endif
