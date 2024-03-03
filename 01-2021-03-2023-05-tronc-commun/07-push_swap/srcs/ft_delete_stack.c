/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_delete_stack.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/27 11:04:30 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:20:05 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

void	ft_del_stk_elt(t_stk_elt *elt)
{
	if (!elt)
		return ;
	if (elt->stack_name)
		free(elt->stack_name);
	free(elt);
	elt = NULL;
}

/* Clean in top order the stack (top to base) */
void	ft_pop_clear_stk(t_stk **stack)
{
	t_stk_elt	*tmp;

	if (!*stack)
		return ;
	while ((*stack)->size)
	{
		tmp = (*stack)->top->prev;
		ft_del_stk_elt((*stack)->top);
		(*stack)->top = tmp;
		(*stack)->size--;
	}
	free((*stack)->stk_name);
	free(*stack);
}

/* Clean in base order the stack (top to base) */
void	ft_deq_clear_stk(t_stk **stack)
{
	t_stk_elt	*tmp;

	if (!*stack)
		return ;
	while ((*stack)->size)
	{
		tmp = (*stack)->base->next;
		ft_del_stk_elt((*stack)->base);
		(*stack)->base = tmp;
		(*stack)->size--;
	}
	free((*stack)->stk_name);
	free(*stack);
}

/* Keep value of grp, don't delete it here, need for the sort */
t_stk_elt	*ft_pop_stack(t_stk **stack)
{
	t_stk_elt	*elt_pop;

	if (!(*stack)->top)
		return (NULL);
	elt_pop = (*stack)->top;
	if (elt_pop->prev)
	{
		elt_pop->prev->next = NULL;
		(*stack)->top = elt_pop->prev;
		elt_pop->prev = NULL;
		free(elt_pop->stack_name);
		elt_pop->stack_name = NULL;
	}
	else
		(*stack)->top = NULL;
	if ((*stack)->size > 0)
		(*stack)->size--;
	return (elt_pop);
}

/* Keep value of grp, don't delete it here, need for the sort */
t_stk_elt	*ft_deq_stack(t_stk **stack)
{
	t_stk_elt	*elt_deq;

	if (!(*stack)->base)
		return (NULL);
	elt_deq = (*stack)->base;
	if (elt_deq->next)
	{
		elt_deq->next->prev = NULL;
		(*stack)->base = elt_deq->next;
		elt_deq->next = NULL;
		free(elt_deq->stack_name);
		elt_deq->stack_name = NULL;
	}
	else
		(*stack)->base = NULL;
	if ((*stack)->size > 0)
		(*stack)->size--;
	return (elt_deq);
}
