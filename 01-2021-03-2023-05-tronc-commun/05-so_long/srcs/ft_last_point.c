/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_last_point.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/15 08:56:52 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/15 08:57:18 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_point	*ft_last_point(t_point *point)
{
	if (!point)
		return (NULL);
	while (point->next)
		point = point->next;
	return (point);
}
