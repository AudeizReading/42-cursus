/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_three_part_02.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/02 18:17:18 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:36:26 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

/* 2 1 3 */
t_bool	ft_sort_mid_top_base(t_stk *stack)
{
	long	top;
	long	mid;
	long	base;

	if (!stack || stack->size < 3)
		return (e_false);
	top = stack->top->value;
	mid = stack->top->prev->value;
	base = stack->base->value;
	if (top > mid && top < base && mid < base)
	{
		if (!ft_strcmp(stack->stk_name, "b"))
		{
			ft_rotate_stack(&stack);
			return (e_true);
		}
		else if (!ft_strcmp(stack->stk_name, "a"))
		{
			ft_swap_stack(stack);
			return (e_true);
		}
	}
	return (e_false);
}

/* 1 3 2 */
t_bool	ft_sort_top_base_mid(t_stk *stack)
{
	long	top;
	long	mid;
	long	base;

	if (!stack || stack->size < 3)
		return (e_false);
	top = stack->top->value;
	mid = stack->top->prev->value;
	base = stack->base->value;
	if (top < mid && top < base && mid > base)
	{
		if (!ft_strcmp(stack->stk_name, "a"))
		{
			ft_rotate_reverse_stack(&stack);
			ft_swap_stack(stack);
			return (e_true);
		}
		else if (!ft_strcmp(stack->stk_name, "b"))
		{
			ft_rotate_stack(&stack);
			return (e_true);
		}
	}
	return (e_false);
}

/* 3 1 2 */
t_bool	ft_sort_base_top_mid(t_stk *stack)
{
	long	top;
	long	mid;
	long	base;

	if (!stack || stack->size < 3)
		return (e_false);
	top = stack->top->value;
	mid = stack->top->prev->value;
	base = stack->base->value;
	if (top > mid && top > base && mid < base)
	{
		if (!ft_strcmp(stack->stk_name, "b"))
		{
			ft_rotate_reverse_stack(&stack);
			ft_swap_stack(stack);
			return (e_true);
		}
		else if (!ft_strcmp(stack->stk_name, "a"))
		{
			ft_rotate_stack(&stack);
			return (e_true);
		}
	}
	return (e_false);
}

t_bool	ft_sort_three(t_stk *stack)
{
	t_bool	cond_1;
	t_bool	cond_2;
	t_bool	cond_3;

	if (!stack || stack->size < 3)
		return (e_false);
	cond_1 = (ft_sort_top_mid_base(stack) || ft_sort_base_mid_top(stack));
	cond_2 = (ft_sort_mid_base_top(stack) || ft_sort_mid_top_base(stack));
	cond_3 = (ft_sort_top_base_mid(stack) || ft_sort_base_top_mid(stack));
	if (cond_1 || cond_2 || cond_3)
		return (e_true);
	return (e_false);
}
