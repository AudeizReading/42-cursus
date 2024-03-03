/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_handle_image.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/09 11:19:13 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 16:36:45 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_center_image(t_player *player, int next_x, int next_y)
{
	int		center_x;
	int		center_y;
	void	*mlx;
	void	*win;
	void	*img;

	center_x = (player->screen->width / 2) - next_x;
	center_y = (player->screen->height / 2) - next_y;
	mlx = player->screen->mlx;
	win = player->screen->win;
	img = player->img->def;
	mlx_put_image_to_window(mlx, win, img, center_x, center_y);
}

t_img	*ft_init_img(t_player *player, size_t coef)
{
	t_img	*img;

	img = malloc(sizeof(*img));
	if (!img)
		return (NULL);
	img->width = player->map->cols * coef;
	img->height = player->map->lines * coef;
	return (img);
}

void	ft_clean_img(t_player *player)
{
	mlx_destroy_image(player->screen->mlx, player->img->def);
	free(player->img);
	player->img = NULL;
}

void	ft_destroy_timg(t_img *img, void *mlx)
{
	mlx_destroy_image(mlx, img->def);
	free(img);
	img = NULL;
}

t_img	*ft_create_img(t_player *player)
{
	t_img	*img;
	void	*mlx;

	mlx = player->screen->mlx;
	img = malloc(sizeof(*img));
	if (!img)
		return (NULL);
	img->width = player->screen->width / 6 + player->screen->width / 12;
	img->height = player->screen->height / 6 + player->screen->height / 12;
	img->def = mlx_new_image(mlx, img->width, img->height);
	img->addr = mlx_get_data_addr(img->def, &img->bpp, &img->len, &img->end);
	return (img);
}
