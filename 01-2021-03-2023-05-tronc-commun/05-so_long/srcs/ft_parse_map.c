/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_parse_map.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/19 14:39:38 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:39:49 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_map	*ft_parse_map(int fd, char **argv)
{
	t_map	*map;

	map = ft_init_map();
	if (!ft_is_map_file(argv[1], ".ber"))
		ft_parse_map_error(1026);
	map->first_line = ft_get_map(fd);
	if (!map->first_line)
		ft_parse_map_error(1025);
	map->lines = ft_map_size(map->first_line);
	map->cols = map->first_line->len;
	if (!ft_check_valid_characters(map->first_line))
		ft_parse_map_error(1029);
	if (!ft_is_rectangular_map(map->first_line))
		ft_parse_map_error(1027);
	ft_get_objects_pos(map);
	return (map);
}
