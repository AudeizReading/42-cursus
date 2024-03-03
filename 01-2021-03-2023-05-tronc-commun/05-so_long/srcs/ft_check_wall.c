/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_check_wall.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/19 11:33:44 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 11:34:01 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_bool	ft_check_wall(t_line *map)
{
	char	*p_content;
	int		size_max;
	int		map_len;
	int		cnt;

	size_max = ft_map_size(map) - 1;
	map_len = (int)map->len - 1;
	while (map)
	{
		cnt = 0;
		p_content = map->content;
		while (p_content[cnt])
		{
			if (!map->y || map->y == size_max || !cnt || cnt == map_len)
			{
				if (!ft_strchr("1", p_content[cnt]))
					return (e_false);
			}
			cnt++;
		}
		map = map->next;
	}
	return (e_true);
}
