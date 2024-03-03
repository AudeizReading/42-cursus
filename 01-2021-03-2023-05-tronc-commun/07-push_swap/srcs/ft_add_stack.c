/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_add_stack.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/27 11:09:18 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:34:45 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

t_stk	*ft_init_stack(char *stack_name)
{
	t_stk		*stack;

	stack = (t_stk *)malloc(sizeof(*stack));
	if (!stack)
		return (NULL);
	stack->stk_name = ft_strdup(stack_name);
	if (!stack->stk_name)
	{
		free(stack);
		return (NULL);
	}
	stack->size = 0;
	stack->top = NULL;
	stack->base = NULL;
	return (stack);
}

t_stk_elt	*ft_init_stk_elt(long value, int grp, char *stk_name)
{
	t_stk_elt	*elt;

	if (!stk_name)
		return (NULL);
	elt = (t_stk_elt *)malloc(sizeof(*elt));
	if (!elt)
		return (NULL);
	elt->stack_name = ft_strdup(stk_name);
	elt->grp = grp;
	elt->value = value;
	elt->prev = NULL;
	elt->next = NULL;
	return (elt);
}

void	ft_stkadd_back(t_stk **stack, t_stk_elt *elt)
{
	t_stk_elt	*tmp;

	if (!*stack)
		return ;
	if (!(*stack)->size)
	{
		(*stack)->base = elt;
		(*stack)->top = elt;
		(*stack)->size++;
		return ;
	}
	tmp = (*stack)->top;
	elt->prev = tmp;
	tmp->next = elt;
	(*stack)->top = elt;
	(*stack)->size++;
}

void	ft_stkadd_front(t_stk **stack, t_stk_elt *elt)
{
	t_stk_elt	*tmp;

	if (!*stack)
		return ;
	if (!(*stack)->size)
	{
		(*stack)->base = elt;
		(*stack)->top = elt;
		(*stack)->size++;
		return ;
	}
	tmp = (*stack)->base;
	elt->next = tmp;
	tmp->prev = elt;
	(*stack)->base = elt;
	(*stack)->size++;
}
