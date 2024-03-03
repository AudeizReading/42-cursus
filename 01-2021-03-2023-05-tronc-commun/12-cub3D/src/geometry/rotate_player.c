/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rotate_player.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 15:18:06 by alellouc          #+#    #+#             */
/*   Updated: 2022/04/06 15:22:48 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "types.h"
#include "defines.h"

#include <math.h>

void	rotate_player(t_data *data, int dir)
{
	if (dir == LEFT)
	{
		data->p.a -= 0.2;
		if (data->p.a < 0)
			data->p.a += PI * 2;
	}
	if (dir == RIGHT)
	{
		data->p.a += 0.2;
		if (data->p.a > (2 * PI))
			data->p.a -= 2 * PI;
	}
	data->p.dx = cos(data->p.a) * 15;
	data->p.dy = sin(data->p.a) * 15;
}
