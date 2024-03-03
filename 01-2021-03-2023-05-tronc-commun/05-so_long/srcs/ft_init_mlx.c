/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_init_mlx.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/24 12:39:05 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 16:28:03 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_get_img_mlx(t_screen *screen)
{
	screen->mlx = mlx_init();
	if (!screen->mlx)
		exit(EXIT_FAILURE);
}

void	ft_get_img_win(t_screen *screen)
{
	void			*mlx;
	unsigned int	width;
	unsigned int	height;
	char			*title;

	mlx = screen->mlx;
	width = screen->width;
	height = screen->height;
	title = screen->title;
	screen->win = mlx_new_window(mlx, width, height, title);
	if (!screen->win)
		exit(EXIT_FAILURE);
}

void	ft_get_img_def(t_player *player)
{
	void			*mlx;
	unsigned int	width;
	unsigned int	height;

	mlx = player->screen->mlx;
	width = player->img->width;
	height = player->img->height;
	player->img->def = mlx_new_image(mlx, width, height);
	if (!player->img->def)
		exit(EXIT_FAILURE);
}

void	ft_get_img_addr(t_img *img)
{
	img->addr = mlx_get_data_addr(img->def, &img->bpp, &img->len, &img->end);
	if (!img->addr)
		exit(EXIT_FAILURE);
}
