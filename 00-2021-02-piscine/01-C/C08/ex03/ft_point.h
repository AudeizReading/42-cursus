/******************************************************************************/
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   filename ex03/ft_point.h                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   by: alellouc  alellouc <marvin@42.fr>          +#+  +:+        +#+       */
/*                                                +#+#+#+#+#+    +#+          */
/*   Created: 2021/03/10 22:05:24 by alellouc          #+#     #+#            */
/*   Updated: yyyy/mm/dd hh:mm:ss by                  ###   ########.fr       */
/*                                                                            */
/******************************************************************************/

#ifndef FT_POINT_H
# define FT_POINT_H

typedef struct		s_point
{
	int		x;
	int		y;
}					t_point;

void				set_point(t_point *point);
#endif
