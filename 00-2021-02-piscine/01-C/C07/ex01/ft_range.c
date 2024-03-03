/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_range.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/01 00:14:52 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/02 20:27:53 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>

int		*ft_range(int min, int max)
{
	int		gap;
	int		*tab;
	int		i;

	i = 0;
	gap = max - min;
	if ((min >= max || (tab = (int *)malloc(sizeof(int) * gap)) < 0))
		return ((int *)0);
	while (i < gap)
	{
		*(tab + i++) = min++;
	}
	return (tab);
}
