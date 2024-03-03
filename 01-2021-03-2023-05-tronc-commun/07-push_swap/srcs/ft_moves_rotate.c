/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_moves_rotate.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/30 21:41:33 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/04 13:06:23 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

void	ft_rotate_stack(t_stk **stack)
{
	t_stk_elt	*p_stack;

	if ((*stack)->size > 1)
	{
		p_stack = ft_pop_stack(stack);
		p_stack->stack_name = ft_strdup((*stack)->stk_name);
		ft_stkadd_front(stack, p_stack);
		if (!ft_strcmp((*stack)->stk_name, "a"))
			ft_putendl("ra");
		else if (!ft_strcmp((*stack)->stk_name, "b"))
			ft_putendl("rb");
	}
}

void	rr(t_stk **a, t_stk **b)
{
	ft_rotate_stack(a);
	ft_rotate_stack(b);
}

void	ft_rotate_reverse_stack(t_stk **stack)
{
	t_stk_elt	*p_stack;

	if ((*stack)->size > 1)
	{
		p_stack = ft_deq_stack(stack);
		p_stack->stack_name = ft_strdup((*stack)->stk_name);
		ft_stkadd_back(stack, p_stack);
		if (!ft_strcmp((*stack)->stk_name, "a"))
			ft_putendl("rra");
		else if (!ft_strcmp((*stack)->stk_name, "b"))
			ft_putendl("rrb");
	}
}

void	rrr(t_stk **a, t_stk **b)
{
	ft_rotate_reverse_stack(a);
	ft_rotate_reverse_stack(b);
}
