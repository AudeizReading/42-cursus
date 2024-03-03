/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_map_addback.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 19:14:28 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:09:05 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_map_addback(t_line **map, t_line *line)
{
	t_line	*last_line;

	if (!*map)
	{
		(*map) = line;
		return ;
	}
	last_line = ft_last_line(*map);
	last_line->next = line;
}
