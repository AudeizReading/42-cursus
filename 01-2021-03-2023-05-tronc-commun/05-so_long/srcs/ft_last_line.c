/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_last_line.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 19:10:09 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/14 19:10:33 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_line	*ft_last_line(t_line *map)
{
	if (!map)
		return (NULL);
	while (map->next)
		map = map->next;
	return (map);
}
