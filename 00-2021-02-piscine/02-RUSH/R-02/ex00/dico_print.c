/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   nans_lHomme_beau.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nsavorni <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 12:02:31 by nsavorni          #+#    #+#             */
/*   Updated: 2021/02/28 19:18:59 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "data_struct.h"
#include "ft_strings.h"

void	dico_print(t_dico_data *dico, long long nbr)
{
	int		c;
	int		mem;

	c = 0;
	mem = 0;
	if (nbr)
	{
		while (dico[c].key < nbr)
		{
			mem = dico[c].key;
			c++;
		}
		dico_print(dico, nbr / mem);
		if (c)
			ft_putstr(dico[c - 1].value);
		dico_print(dico, nbr % mem);
	}
}
