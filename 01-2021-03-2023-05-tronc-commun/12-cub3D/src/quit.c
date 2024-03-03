/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   quit.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi and allelouc                       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:22:28 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:22:32 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "types.h"
#include "libft.h"

#include <stdlib.h>

void	quit(t_data *d, int code, char *msg)
{
	int	i;

	i = -1;
	if (d->map)
		_free_split(d->map);
	if (d->int_map)
		free(d->int_map);
	while (++i < 4)
		if (d->tex[i])
			free(d->tex[i]);
	if (msg)
		_putnl(msg);
	exit(code);
}
