/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_handle_grp.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/13 09:36:10 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:21:19 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

int	ft_set_grp_b(t_stk *b, t_stk *a, int grp, long piv)
{
	if (!a->size || !b->size)
		return (0);
	if (b->top->value >= piv)
	{
		b->top->grp += grp;
		ft_push_stack(&b, &a);
		ft_sort_two(a);
	}
	else if (b->top->value < piv)
	{
		ft_rotate_stack(&b);
		b->base->grp += grp / 10;
		return (1);
	}
	return (0);
}

int	ft_set_grp_a(t_stk *a, t_stk *b, int grp, long piv)
{
	if (!a->size || !b->size)
		return (0);
	if (a->top->value <= piv)
	{
		a->top->grp += grp;
		ft_push_stack(&a, &b);
		ft_sort_two(b);
	}
	else if (a->top->value > piv)
	{
		ft_rotate_stack(&a);
		a->base->grp += grp / 10;
		return (1);
	}
	return (0);
}

void	ft_put_grp_on_top(t_stk *stk, int *i)
{
	t_stk	*info_grp;

	info_grp = ft_get_grp_stk(stk);
	while ((*i)-- && info_grp->top->prev)
	{
		ft_rotate_reverse_stack(&stk);
		ft_sort_two(stk);
	}
	ft_pop_clear_stk(&info_grp);
}
