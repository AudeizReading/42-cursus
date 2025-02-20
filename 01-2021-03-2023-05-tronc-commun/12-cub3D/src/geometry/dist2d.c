/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   dist2d.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 15:15:51 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/06 15:22:47 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <math.h>

double	dist_2d(double x0, double y0, double x1, double y1)
{
	return (sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)));
}
