/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_moves_others.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/30 21:41:33 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/04 13:05:14 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

void	ft_swap_stack(t_stk *stack)
{
	if (!stack || stack->size < 2)
		return ;
	ft_swap(&stack->top->value, &stack->top->prev->value);
	ft_swap(&stack->top->grp, &stack->top->prev->grp);
	if (!ft_strcmp(stack->stk_name, "a"))
		ft_putendl("sa");
	else if (!ft_strcmp(stack->stk_name, "b"))
		ft_putendl("sb");
}

void	ss(t_stk *a, t_stk *b)
{
	ft_swap_stack(a);
	ft_swap_stack(b);
}

void	ft_push_stack(t_stk **stack_1, t_stk **stack_2)
{
	t_stk_elt	*p_stack;

	if ((*stack_1)->size > 0)
	{
		p_stack = ft_pop_stack(stack_1);
		free(p_stack->stack_name);
		p_stack->stack_name = ft_strdup((*stack_2)->stk_name);
		ft_stkadd_back(stack_2, p_stack);
		if (!ft_strcmp((*stack_2)->stk_name, "a"))
			ft_putendl("pa");
		else if (!ft_strcmp((*stack_2)->stk_name, "b"))
			ft_putendl("pb");
	}
}
