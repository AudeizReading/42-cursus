/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_handle_player.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/08 15:17:34 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/14 11:55:10 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"             

int	ft_init_player_values(t_player *player, char *filename)
{
	int			start_x;
	int			start_y;

	player->nb_collect = 0;
	player->coef = 64;
	player->filename = ft_strdup(filename);
	start_x = player->map->start->x * player->coef;
	start_y = player->map->start->y * player->coef;
	player->pole_pos = ft_init_point(start_x, start_y, 0);
	if (!player->pole_pos)
		return (0);
	return (1);
}

t_player	*ft_init_player(char **file, size_t w, size_t h, char *title)
{
	t_player	*player;

	player = malloc(sizeof(*player));
	if (!player)
		return (NULL);
	player->fd = ft_open_map(file[1]);
	if (!player->fd)
		return (NULL);
	player->map = ft_parse_map(player->fd, file);
	if (!player->map)
		return (NULL);
	if (!ft_init_player_values(player, file[1]))
		return (NULL);
	player->screen = ft_init_screen(title, w, h);
	if (!player->screen)
		return (NULL);
	player->img = ft_init_img(player, player->coef);
	if (!player->img)
		return (NULL);
	ft_get_img_def(player);
	ft_get_img_addr(player->img);
	return (player);
}

void	ft_clean_player(t_player *player)
{
	ft_clean_map(player->map);
	ft_point_clear(&player->pole_pos, free);
	ft_clean_img(player);
	ft_clean_screen(player->screen);
	free(player->filename);
	free(player);
	close(player->fd);
}

void	ft_change_player_pos(t_player *pl, int next_x, int next_y, int key)
{
	t_point	*tmp;
	size_t	pos;

	pos = pl->pole_pos->pos;
	ft_draw_square(pl->img, pl->pole_pos, pl->coef, ocre);
	tmp = ft_init_point(next_x, next_y, pos + 1);
	ft_point_addback(&pl->pole_pos, tmp);
	pl->pole_pos = pl->pole_pos->next;
	ft_draw_square(pl->img, pl->pole_pos, pl->coef, turquoise);
	ft_print_moves_stats(key, pl);
	mlx_clear_window(pl->screen->mlx, pl->screen->win);
	ft_center_image(pl, next_x, next_y);
	ft_display_nb_moves(pl, 0xFFFFFF);
	ft_draw_minimap(pl);
	ft_draw_legend(pl);
}
