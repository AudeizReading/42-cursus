/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_drawing_legend.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/14 11:47:34 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/14 11:47:51 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_draw_legend_start(t_player *pl, t_img *img, int x, int y)
{
	void	*mlx;
	void	*win;
	int		x_start;
	int		y_start;
	t_point	*point;

	mlx = pl->screen->mlx;
	win = pl->screen->win;
	x_start = img->width / 8;
	y_start = img->height / 8;
	point = ft_init_point(x_start, y_start, 0);
	ft_draw_square(img, point, x_start, turquoise);
	x_start = x + img->width / 3;
	y_start = y + y_start + img->width / 9;
	mlx_string_put(mlx, win, x_start, y_start, turquoise, "Start / Pos");
	ft_point_clear(&point, free);
}

void	ft_draw_legend_exit(t_player *pl, t_img *img, int x, int y)
{
	void	*mlx;
	void	*win;
	int		x_start;
	int		y_start;
	t_point	*point;

	mlx = pl->screen->mlx;
	win = pl->screen->win;
	x_start = img->width / 8;
	y_start = 3 * (img->height / 8);
	point = ft_init_point(x_start, y_start, 0);
	ft_draw_square(img, point, x_start, pink);
	x_start = x + img->width / 3;
	y_start = y + y_start + img->width / 9;
	mlx_string_put(mlx, win, x_start, y_start, pink, "Exit");
	ft_point_clear(&point, free);
}

void	ft_draw_legend_item(t_player *pl, t_img *img, int x, int y)
{
	void	*mlx;
	void	*win;
	int		x_start;
	int		y_start;
	t_point	*point;

	mlx = pl->screen->mlx;
	win = pl->screen->win;
	x_start = img->width / 8;
	y_start = 5 * (img->height / 8);
	point = ft_init_point(x_start, y_start, 0);
	ft_draw_square(img, point, x_start, yellow);
	x_start = x + img->width / 3;
	y_start = y + y_start + img->width / 9;
	mlx_string_put(mlx, win, x_start, y_start, yellow, "Item");
	ft_point_clear(&point, free);
}

void	ft_draw_legend(t_player	*player)
{
	t_img	*img;
	void	*mlx;
	int		x;
	int		y;

	mlx = player->screen->mlx;
	img = ft_create_img(player);
	if (!img)
		return ;
	x = player->screen->width - img->width;
	y = player->screen->height - img->height;
	ft_fill_screen(img, 0xDDFFFFFF);
	ft_draw_legend_start(player, img, x, y);
	ft_draw_legend_exit(player, img, x, y);
	ft_draw_legend_item(player, img, x, y);
	mlx_put_image_to_window(mlx, player->screen->win, img->def, x, y);
	ft_destroy_timg(img, mlx);
}
