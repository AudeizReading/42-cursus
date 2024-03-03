/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_map_clear.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 19:18:59 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:09:59 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_map_clear(t_line **map, void (*del)(void *))
{
	t_line	*tmp;

	while (*map)
	{
		tmp = (*map)->next;
		ft_map_delone(*map, del);
		(*map) = tmp;
	}
}
