/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_hook_close_mlx.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/24 14:18:27 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 16:30:18 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	ft_hook_close_mlx(t_player *player)
{
	ft_clean_player(player);
	exit(EXIT_SUCCESS);
	return (0);
}

int	ft_hook_key_esc(int keycode, t_player *player)
{
	if (keycode == 53)
		ft_hook_close_mlx(player);
	return (0);
}
