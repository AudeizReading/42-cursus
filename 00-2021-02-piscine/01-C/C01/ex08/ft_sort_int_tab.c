/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_int_tab.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/15 09:27:03 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/16 17:04:05 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

void	ft_swap(int *tab, int i, int j)
{
	int		temp;

	temp = tab[i];
	tab[i] = tab[j];
	tab[j] = temp;
}

void	ft_sort_int_tab(int *tab, int size)
{
	int		i;
	int		j;
	int		gap;

	gap = size / 2;
	while (gap > 0)
	{
		i = gap;
		while (i < size)
		{
			j = i - gap;
			while (j >= 0 && tab[j] >= tab[j + gap])
			{
				ft_swap(tab, j, j + gap);
				j -= gap;
			}
			i++;
		}
		gap /= 2;
	}
}
