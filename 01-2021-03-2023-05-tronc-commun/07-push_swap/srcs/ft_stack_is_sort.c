/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_stack_is_sort.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/01 15:26:50 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/04 13:33:47 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

t_bool	ft_stack_a_is_sort(t_stk *stack)
{
	t_stk_elt	*tmp;

	if (!stack)
		return (e_false);
	tmp = stack->top;
	while (tmp->prev)
	{
		if (tmp->value > tmp->prev->value)
			return (e_false);
		tmp = tmp->prev;
	}
	return (e_true);
}

t_bool	ft_stack_b_is_sort(t_stk *stack)
{
	t_stk_elt	*tmp;

	if (!stack)
		return (e_false);
	tmp = stack->top;
	while (tmp->prev)
	{
		if (tmp->value < tmp->prev->value)
			return (e_false);
		tmp = tmp->prev;
	}
	return (e_true);
}

t_bool	ft_stack_is_sort(t_stk *stack)
{
	if (!ft_strcmp(stack->stk_name, "a"))
	{
		if (!ft_stack_a_is_sort(stack))
			return (e_false);
	}
	else if (!ft_strcmp(stack->stk_name, "b"))
	{
		if (!ft_stack_b_is_sort(stack))
			return (e_false);
	}
	return (e_true);
}
