/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_two.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/03 22:16:03 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:17:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

t_bool	ft_sort_top_prev(t_stk *stack)
{
	long	top;
	long	prev;

	if (!stack || stack->size < 2)
		return (e_false);
	top = stack->top->value;
	prev = stack->top->prev->value;
	if (top > prev)
	{
		if (!ft_strcmp(stack->stk_name, "a"))
		{
			ft_swap_stack(stack);
			return (e_true);
		}
		else if (!ft_strcmp(stack->stk_name, "b"))
			return (e_true);
	}
	return (e_false);
}

t_bool	ft_sort_prev_top(t_stk *stack)
{
	long	top;
	long	prev;

	if (!stack || stack->size < 2)
		return (e_false);
	top = stack->top->value;
	prev = stack->top->prev->value;
	if (prev > top)
	{
		if (!ft_strcmp(stack->stk_name, "b"))
		{
			ft_swap_stack(stack);
			return (e_true);
		}
		else if (!ft_strcmp(stack->stk_name, "a"))
			return (e_true);
	}
	return (e_false);
}

t_bool	ft_sort_two(t_stk *stack)
{
	if (!stack || stack->size < 2)
		return (e_false);
	if (ft_sort_top_prev(stack) || ft_sort_prev_top(stack))
	{
		return (e_true);
	}
	return (e_false);
}

void	ft_sort_five(t_stk *a, t_stk *b)
{
	ft_divide_stack_a(a, b);
	if (b->size == 2)
		ft_sort_two(b);
	else if (b->size == 3)
		ft_sort_three(b);
	while (b->size)
		ft_push_stack(&b, &a);
}
