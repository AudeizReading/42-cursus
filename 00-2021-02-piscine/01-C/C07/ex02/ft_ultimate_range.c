/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_ultimate_range.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/01 22:44:00 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/03 15:42:02 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>

int		ft_ultimate_range(int **range, int min, int max)
{
	int		gap;
	int		i;

	i = 0;
	gap = max - min;
	if (min >= max)
	{
		*range = (int *)0;
		return (0);
	}
	if ((*range = (int *)malloc(sizeof(int) * gap)) == 0)
	{
		return (-1);
	}
	while (i < gap)
		*(*range + i++) = min++;
	return (i);
}
