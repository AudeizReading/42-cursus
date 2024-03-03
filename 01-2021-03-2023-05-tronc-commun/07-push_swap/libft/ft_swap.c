/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_swap.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/23 13:22:30 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 14:44:46 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_swap(void *a, void *b)
{
	double	tmp;
	double	*p_a;
	double	*p_b;

	p_a = (double *)a;
	p_b = (double *)b;
	tmp = *p_a;
	*p_a = *p_b;
	*p_b = tmp;
}

void	ft_swap_tab(void *tab[], int a, int b)
{
	void	*tmp;

	tmp = tab[a];
	tab[a] = tab[b];
	tab[b] = tmp;
}

void	ft_long_swap(long *a, long *b)
{
	long	tmp;

	tmp = *a;
	*a = *b;
	*b = tmp;
}
