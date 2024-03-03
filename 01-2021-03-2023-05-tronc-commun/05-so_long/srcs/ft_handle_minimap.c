/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_handle_minimap.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/13 15:52:55 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 15:54:20 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_draw_map_objects(t_img *img, t_map *map, int coef)
{
	ft_draw_object(img, map->wall, coef, grey_legend);
	ft_draw_object(img, map->collect, coef, yellow_legend);
	ft_draw_object(img, map->start, coef, turquoise_legend);
	ft_draw_object(img, map->end, coef, pink);
}

void	ft_scale_minimap(t_player *player, t_map *map, int *coef)
{
	unsigned int	scr_w;
	unsigned int	scr_h;

	scr_w = player->screen->width;
	scr_h = player->screen->height;
	while (map->cols * (*coef) > scr_w || map->lines * (*coef) > scr_h)
		*coef /= 2;
}

void	ft_draw_minimap(t_player *player)
{
	t_img	*img;
	t_map	*map;
	int		fd;
	void	*mlx;
	int		coef;

	mlx = player->screen->mlx;
	coef = player->coef / 8;
	fd = open(player->filename, O_RDONLY);
	map = ft_init_map();
	map->first_line = ft_get_map(fd);
	map->lines = ft_map_size(map->first_line);
	map->cols = map->first_line->len;
	ft_get_objects_pos(map);
	ft_scale_minimap(player, map, &coef);
	img = ft_init_img(player, coef);
	img->def = mlx_new_image(player->screen->mlx, img->width, img->height);
	img->addr = mlx_get_data_addr(img->def, &img->bpp, &img->len, &img->end);
	ft_fill_screen(img, 0xDDFFFFFF);
	ft_draw_map_objects(img, map, coef);
	mlx_put_image_to_window(mlx, player->screen->win, img->def, 0, 0);
	ft_destroy_timg(img, mlx);
	ft_clean_map(map);
	close(fd);
}
