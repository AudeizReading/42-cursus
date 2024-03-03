/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_init_point.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/15 08:53:21 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/15 08:53:35 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_point	*ft_init_point(int x, int y, int pos)
{
	t_point	*point;

	point = (t_point *)malloc(sizeof(*point));
	if (!point)
		return (NULL);
	point->x = x;
	point->y = y;
	point->pos = pos;
	point->next = NULL;
	return (point);
}
