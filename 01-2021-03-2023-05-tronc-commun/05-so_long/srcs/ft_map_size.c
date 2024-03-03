/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_map_size.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 18:53:59 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:28:56 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	ft_map_size(t_line *map)
{
	int			size;

	size = 0;
	while (map)
	{
		size++;
		map = map->next;
	}
	return (size);
}
