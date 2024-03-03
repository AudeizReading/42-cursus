/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_three_part_01.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/02 18:14:23 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/04 13:09:35 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

/* 1 2 3 */
t_bool	ft_sort_top_mid_base(t_stk *stack)
{
	long	top;
	long	mid;
	long	base;

	if (!stack || stack->size < 3)
		return (e_false);
	top = stack->top->value;
	mid = stack->top->prev->value;
	base = stack->base->value;
	if (top < mid && top < base && mid < base)
	{
		if (!ft_strcmp(stack->stk_name, "a"))
			return (e_true);
		else if (!ft_strcmp(stack->stk_name, "b"))
		{
			ft_swap_stack(stack);
			ft_rotate_reverse_stack(&stack);
			return (e_true);
		}
	}
	return (e_false);
}

/* 3 2 1 */
t_bool	ft_sort_base_mid_top(t_stk *stack)
{
	long	top;
	long	mid;
	long	base;

	if (!stack || stack->size < 3)
		return (e_false);
	top = stack->top->value;
	mid = stack->top->prev->value;
	base = stack->base->value;
	if (top > mid && top > base && mid > base)
	{
		if (!ft_strcmp(stack->stk_name, "b"))
			return (e_true);
		else if (!ft_strcmp(stack->stk_name, "a"))
		{
			ft_swap_stack(stack);
			ft_rotate_reverse_stack(&stack);
			return (e_true);
		}
	}
	return (e_false);
}

/* 2 3 1 */
t_bool	ft_sort_mid_base_top(t_stk *stack)
{
	long	top;
	long	mid;
	long	base;

	if (!stack || stack->size < 3)
		return (e_false);
	top = stack->top->value;
	mid = stack->top->prev->value;
	base = stack->base->value;
	if (top < mid && top > base && mid > base)
	{
		if (!ft_strcmp(stack->stk_name, "a"))
		{
			ft_rotate_stack(&stack);
			return (e_true);
		}
		else if (!ft_strcmp(stack->stk_name, "b"))
		{
			ft_swap_stack(stack);
			return (e_true);
		}
	}
	return (e_false);
}
