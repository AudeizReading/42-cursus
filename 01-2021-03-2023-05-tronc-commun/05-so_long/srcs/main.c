/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/13 16:33:07 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/13 16:33:17 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	main(int argc, char **argv)
{
	t_player	*player;
	char		*title;

	title = ft_strdup("SO_LONG - and thanks for all the fishes");
	if (!title)
		exit(EXIT_FAILURE);
	if (argc == 2)
	{
		player = ft_init_player(argv, 768, 576, title);
		if (!player)
			exit(EXIT_FAILURE);
		ft_draw_map(player);
		mlx_hook(player->screen->win, 17, 1L << 2, ft_hook_close_mlx, player);
		mlx_hook(player->screen->win, 2, 1L << 0, key_hook, player);
		mlx_loop(player->screen->mlx);
		ft_clean_player(player);
	}
	else
		ft_parse_map_error(22);
	free(title);
	return (0);
}
