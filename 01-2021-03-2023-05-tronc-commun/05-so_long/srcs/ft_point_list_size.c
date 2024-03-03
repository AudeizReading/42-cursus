/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_point_list_size.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/15 08:56:06 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:29:47 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	ft_point_list_size(t_point *point)
{
	int		size;

	size = 0;
	while (point)
	{
		size++;
		point = point->next;
	}
	return (size);
}
