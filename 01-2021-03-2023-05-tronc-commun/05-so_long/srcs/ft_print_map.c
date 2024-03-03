/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_map.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 19:22:05 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:33:06 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_print_map(t_line *map)
{
	while (map)
	{
		ft_putendl_fd(map->content, 1);
		ft_putnbr_fd(map->y, 1);
		ft_putstr_fd(" pos y\n", 1);
		ft_putnbr_fd(map->len, 1);
		ft_putstr_fd(" length line\n", 1);
		map = map->next;
	}
}

void	print_info_map(t_map *map)
{
	ft_putendl_fd("------------MAP------------------", 1);
	ft_print_map(map->first_line);
	ft_putnbr_fd(map->lines, 1);
	ft_putendl_fd(" maillons", 1);
	ft_putendl_fd("Dimensions map :", 1);
	ft_putnbr_fd(map->cols, 1);
	ft_putstr_fd(" x ", 1);
	ft_putnbr_fd(map->lines, 1);
	ft_putstr_fd("\n", 1);
	ft_putendl_fd("---------------------------------", 1);
	ft_putendl_fd("Liste des points de depart", 1);
	ft_print_point_list(map->start);
	ft_putendl_fd("Liste des points collectables", 1);
	ft_print_point_list(map->collect);
	ft_putendl_fd("Liste des points de sortie", 1);
	ft_print_point_list(map->end);
	ft_putendl_fd("Liste des points de murs", 1);
	ft_print_point_list(map->wall);
}
