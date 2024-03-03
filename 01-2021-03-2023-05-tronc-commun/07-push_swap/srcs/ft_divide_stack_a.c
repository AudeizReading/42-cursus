/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_divide_stack_a.c                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/04 20:16:56 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 12:30:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

void	ft_a_inf_med(t_stk *a, t_stk *b, int grp)
{
	ft_push_stack(&a, &b);
	b->top->grp = grp;
}

void	ft_parse_stack_a(t_stk *a, t_stk *b, int grp)
{
	int				size;
	char			**args;
	t_piv			pivot;

	size = a->size;
	args = ft_stack_to_tab(a);
	pivot = ft_get_median(args, size);
	if (size < 15)
		pivot.q1 = pivot.me;
	while (size--)
	{
		if (a->top->value > pivot.q1)
			ft_rotate_stack(&a);
		else if (a->top->value <= pivot.q1)
			ft_a_inf_med(a, b, grp);
		else if (a->base->value <= pivot.q1)
		{
			ft_rotate_reverse_stack(&a);
			ft_a_inf_med(a, b, grp);
		}
	}
	ft_free_args(args);
}

void	ft_divide_stack_a(t_stk *a, t_stk *b)
{
	static int		grp = 1;

	if (!a)
		return ;
	if (a->size > 3)
	{
		ft_parse_stack_a(a, b, grp);
		grp++;
		ft_divide_stack_a(a, b);
	}
	else if (a->size == 2)
		ft_sort_two(a);
	else
		ft_sort_three(a);
}
