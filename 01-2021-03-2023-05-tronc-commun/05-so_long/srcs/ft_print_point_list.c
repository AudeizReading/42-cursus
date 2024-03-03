/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_point_list.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/15 08:59:53 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 14:31:28 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_print_point_list(t_point *point)
{
	while (point)
	{
		ft_putnbr_fd(point->pos, 1);
		ft_putendl_fd(" pos", 1);
		ft_putnbr_fd(point->x, 1);
		ft_putendl_fd(" x", 1);
		ft_putnbr_fd(point->y, 1);
		ft_putendl_fd(" y", 1);
		point = point->next;
	}
}
