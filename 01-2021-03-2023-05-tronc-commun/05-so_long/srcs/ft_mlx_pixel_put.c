/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_mlx_pixel_put.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/24 13:03:49 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 16:36:11 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_mlx_pixel_put(t_img *img, int x, int y, int color)
{
	char	*dst;
	int		offset;

	offset = (y * img->len + x * (img->bpp / 8));
	dst = img->addr + offset;
	*(unsigned *)dst = color;
}

t_bool	ft_is_pixel_color(t_player *player, int x, int y, int color)
{
	int		offset;

	offset = (y * player->img->len + x * (player->img->bpp / 8));
	if (*(int *)(player->img->addr + offset) == color)
		return (e_true);
	return (e_false);
}
