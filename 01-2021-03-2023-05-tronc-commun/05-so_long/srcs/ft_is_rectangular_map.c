/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_is_rectangular_map.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/19 11:35:53 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 11:36:10 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_bool	ft_is_rectangular_map(t_line *map)
{
	size_t	first_line_len;

	first_line_len = map->len;
	while (map)
	{
		if (first_line_len != map->len)
			return (e_false);
		map = map->next;
	}
	return (e_true);
}
