/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_point_addback.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/15 08:57:54 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/15 08:58:04 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_point_addback(t_point **point, t_point *last_point)
{
	t_point	*last;

	if (!*point)
	{
		*point = last_point;
		return ;
	}
	last = ft_last_point(*point);
	last->next = last_point;
}
