/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_init_map.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/19 10:59:20 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 11:00:17 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_map	*ft_init_map(void)
{
	t_map	*map;

	map = (t_map *)malloc(sizeof(*map));
	if (!map)
		return (NULL);
	map->cols = 0;
	map->lines = 0;
	map->start = NULL;
	map->collect = NULL;
	map->end = NULL;
	map->wall = NULL;
	map->first_line = NULL;
	return (map);
}
