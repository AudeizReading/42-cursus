/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_hook_key_mlx.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/11 23:30:56 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 16:29:46 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	ft_hook_key_s(int keycode, t_player *player)
{
	int	next_x;
	int	next_y;
	int	cond;

	next_x = player->pole_pos->x;
	next_y = player->pole_pos->y + player->coef;
	cond = player->pole_pos->y < (int)player->img->height - player->coef * 2;
	if (keycode == 1 && cond)
	{
		if (!ft_is_pixel_color(player, next_x, next_y, grey))
		{
			ft_handle_exit(player, next_x, next_y, keycode);
			ft_handle_items(player, next_x, next_y);
			if (!ft_is_pixel_color(player, next_x, next_y, pink))
			{
				ft_change_player_pos(player, next_x, next_y, keycode);
			}
		}
	}
	return (0);
}

int	ft_hook_key_w(int keycode, t_player *player)
{
	int	next_y;
	int	next_x;

	next_y = player->pole_pos->y - player->coef;
	next_x = player->pole_pos->x;
	if (keycode == 13 && player->pole_pos->y > player->coef)
	{
		if (!ft_is_pixel_color(player, next_x, next_y, grey))
		{
			ft_handle_exit(player, next_x, next_y, keycode);
			ft_handle_items(player, next_x, next_y);
			if (!ft_is_pixel_color(player, next_x, next_y, pink))
			{
				ft_change_player_pos(player, next_x, next_y, keycode);
			}
		}
	}
	return (0);
}

int	ft_hook_key_a(int keycode, t_player *player)
{
	int	next_x;
	int	next_y;

	next_x = player->pole_pos->x - player->coef;
	next_y = player->pole_pos->y;
	if (keycode == 0 && player->pole_pos->x > player->coef)
	{
		if (!ft_is_pixel_color(player, next_x, next_y, grey))
		{
			ft_handle_exit(player, next_x, next_y, keycode);
			ft_handle_items(player, next_x, next_y);
			if (!ft_is_pixel_color(player, next_x, next_y, pink))
			{
				ft_change_player_pos(player, next_x, next_y, keycode);
			}
		}
	}
	return (0);
}

int	ft_hook_key_d(int keycode, t_player *player)
{
	int	next_x;
	int	next_y;
	int	cond;

	next_x = player->pole_pos->x + player->coef;
	next_y = player->pole_pos->y;
	cond = player->pole_pos->x < (int)player->img->width - player->coef * 2;
	if (keycode == 2 && cond)
	{
		if (!ft_is_pixel_color(player, next_x, next_y, grey))
		{
			ft_handle_exit(player, next_x, next_y, keycode);
			ft_handle_items(player, next_x, next_y);
			if (!ft_is_pixel_color(player, next_x, next_y, pink))
			{
				ft_change_player_pos(player, next_x, next_y, keycode);
			}
		}
	}
	return (0);
}

int	key_hook(int keycode, t_player *player)
{
	ft_hook_key_esc(keycode, player);
	ft_hook_key_a(keycode, player);
	ft_hook_key_s(keycode, player);
	ft_hook_key_d(keycode, player);
	ft_hook_key_w(keycode, player);
	return (0);
}
