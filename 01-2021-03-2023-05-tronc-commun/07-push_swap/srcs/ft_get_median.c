/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_get_median.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/25 18:02:25 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 14:43:29 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

/* Warn: definitely sort args in croissant order */
t_piv	ft_get_median(char **args, int end)
{
	t_piv		pivot;
	char		**ag;

	ag = args;
	end--;
	if (end < 0)
		end = 0;
	ft_qsort_tab((void **)ag, 0, end, (int (*)(void *, void *)) ft_lnbrcmp);
	pivot.min = ft_atol(ag[0]);
	pivot.q1 = ft_atol(ag[(14 * end) / 65]);
	pivot.q3 = ft_atol(ag[(5 * end) / 7]);
	pivot.me = ft_atol(ag[end / 2]);
	pivot.max = ft_atol(ag[end]);
	return (pivot);
}

/* return a double linked list with the values of the groups previously created
** by dividing stack A, we get the number of the grp (member grp) and the size
** of the grp (member value), very useful for getting the median value */
t_stk	*ft_get_grp_stk(t_stk *stack)
{
	t_stk		*grp;
	t_stk_elt	*elt;
	t_stk_elt	*tmp;

	grp = ft_init_stack("grp");
	if (!grp || !stack)
		return (NULL);
	tmp = stack->top;
	while (tmp)
	{
		if (tmp->next == NULL || tmp->grp != tmp->next->grp)
		{
			elt = ft_init_stk_elt(0, tmp->grp, grp->stk_name);
			ft_stkadd_front(&grp, elt);
		}
		grp->base->value++;
		tmp = tmp->prev;
	}
	if (!grp->size)
		return (NULL);
	return (grp);
}

t_bool	ft_set_stk_4_med(t_stk *stk, t_stk_elt *elt_grp)
{
	if (!elt_grp)
	{
		ft_pop_clear_stk(&stk);
		return (0);
	}
	return (1);
}

/* return a double linked list with the group, that the num is passed in
** paramters, inside a given stack for setting the median value */
t_stk	*ft_get_stk_4_med(t_stk *stack, int grp)
{
	t_stk		*stk_grp;
	t_stk_elt	*elt_grp;
	t_stk_elt	*tmp;

	tmp = stack->top;
	stk_grp = ft_init_stack("stk_4_med");
	if (!stack || !stack->size || !grp)
		return (NULL);
	if (!stk_grp)
		return (NULL);
	while (tmp)
	{
		if (tmp->grp == grp)
		{
			elt_grp = ft_init_stk_elt(tmp->value, tmp->grp, stk_grp->stk_name);
			if (!ft_set_stk_4_med(stk_grp, elt_grp))
				return (NULL);
			ft_stkadd_front(&stk_grp, elt_grp);
		}
		tmp = tmp->prev;
	}
	if (!stk_grp->size)
		return (NULL);
	return (stk_grp);
}

t_piv	ft_get_median_grp(t_stk *grp)
{
	t_piv		pivot;
	char		**grp_tab;

	if (!grp || !grp->size)
		return ((t_piv){0, 0, 0, 0, 0});
	grp_tab = ft_stack_to_tab(grp);
	pivot = ft_get_median(grp_tab, grp->size);
	ft_free_args(grp_tab);
	return (pivot);
}
