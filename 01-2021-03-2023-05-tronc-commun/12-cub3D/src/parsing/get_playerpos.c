/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_playerpos.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:23:35 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:23:36 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "types.h"
#include "libft.h"

void	get_playerpos(t_data *data)
{
	int	i;
	int	j;

	i = -1;
	while (++i < data->rows)
	{
		j = -1;
		while (++j < data->cols)
		{
			if (data->int_map[i * data->cols + j] == 2)
			{
				data->p.x = j;
				data->p.y = i;
				data->int_map[i * data->cols + j] = 0;
				return ;
			}
		}
	}
}
