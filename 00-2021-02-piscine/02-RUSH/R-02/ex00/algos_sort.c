/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   algos_sort.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 23:36:27 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 14:35:16 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_strings.h"

int		ft_strcmp(char *s1, char *s2)
{
	int		i;

	i = 0;
	while (s1[i] == s2[i])
		i++;
	return (s1[i] - s2[i]);
}

void	ft_swap(char *tab[], int i, int j)
{
	char	*temp;

	temp = tab[i];
	tab[i] = tab[j];
	tab[j] = temp;
}

void	ft_quicksort(char *tab[], int left, int right)
{
	int		i;
	int		last;

	if (left >= right)
		return ;
	ft_swap(tab, left, (left + right) / 2);
	last = left;
	i = left + 1;
	while (i <= right)
	{
		if (ft_strcmp(tab[i], tab[left]) < 0)
			ft_swap(tab, ++last, i);
		i++;
	}
	ft_swap(tab, left, last);
	ft_quicksort(tab, left, last - 1);
	ft_quicksort(tab, last + 1, right);
}
