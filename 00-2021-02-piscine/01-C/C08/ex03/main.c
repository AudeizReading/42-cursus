/******************************************************************************/
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   filename ex03/main.c                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   by: alellouc  alellouc <marvin@42.fr>          +#+  +:+        +#+       */
/*                                                +#+#+#+#+#+    +#+          */
/*   Created: 2021/03/10 22:18:54 by alellouc          #+#     #+#            */
/*   Updated: yyyy/mm/dd hh:mm:ss by                  ###   ########.fr       */
/*                                                                            */
/******************************************************************************/

#include "ft_point.h"

void		set_point(t_point *point)
{
	point->x = 42;
	point->y = 21;
}

int			main(void)
{
	t_point		point;
	set_point(&point);
	return (0);
}
