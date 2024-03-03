/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   convert_xpm.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:23:34 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:23:35 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "types.h"
#include "libft.h"
#include "mlx.h"
#include <stdlib.h>

int	*convert_xpm(char *tok, t_data *data)
{
	int		x;
	int		y;
	int		*ret;
	int		*data_cast;
	t_data	xpm;

	ret = 0;
	xpm.img = mlx_xpm_file_to_image(data->mlx, tok, &data->tx_w, &data->tx_h);
	if (xpm.img)
	{
		data_cast = (int *) mlx_get_data_addr(xpm.img, \
			&xpm.bpp, &xpm.ll, &xpm.endian);
		ret = _calloc(1 + (data->tx_w * data->tx_h), sizeof(int));
		y = -1;
		while (++y < data->tx_h)
		{
			x = -1;
			while (++x < data->tx_w)
				ret[data->tx_w * y + x] = data_cast[data->tx_w * y + x];
		}
		mlx_destroy_image(data->mlx, xpm.img);
	}
	return (ret);
}
