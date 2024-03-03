/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_handle_game.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/13 15:29:31 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 15:33:40 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_handle_exit(t_player *player, int x, int y, int keycode)
{
	int	nb_items;
	int	total_items;

	nb_items = player->nb_collect;
	total_items = ft_point_list_size(player->map->collect);
	if (ft_is_pixel_color(player, x, y, pink) && nb_items == total_items)
	{
		ft_change_player_pos(player, x, y, keycode);
		ft_print_final_stats(player);
		ft_hook_close_mlx(player);
	}
	else if (ft_is_pixel_color(player, x, y, pink) && nb_items != total_items)
	{
		ft_putstr("\nYou only have collected ");
		ft_putnbr(nb_items);
		ft_putstr(" / ");
		ft_putnbr(total_items);
		ft_putendl(" items. You cannot exit until all items are collected.");
	}
}

void	ft_handle_items(t_player *player, int x, int y)
{
	if (ft_is_pixel_color(player, x, y, yellow))
		player->nb_collect++;
}
