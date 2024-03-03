/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_clean_map.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/19 14:37:47 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:38:01 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_clean_map(t_map *map)
{
	ft_point_clear(&map->start, free);
	ft_point_clear(&map->collect, free);
	ft_point_clear(&map->end, free);
	ft_point_clear(&map->wall, free);
	ft_map_clear(&map->first_line, free);
	free(map);
}
