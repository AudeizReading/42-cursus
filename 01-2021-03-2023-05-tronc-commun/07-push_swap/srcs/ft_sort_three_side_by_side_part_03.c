/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_three_side_by_side_part_03.c               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/11 15:50:03 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:22:13 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

/* t is for top value, p is for previous value and p is for previous previous */
/* value. Thank you the norm */

/* 3 1 2 */
t_bool	ft_sort_p_pp_t(t_stk *src, t_stk *dst)
{
	long	top;
	long	prev;
	long	pprev;

	if (!src->size || !dst->size)
		return (e_false);
	top = src->top->value;
	prev = src->top->prev->value;
	pprev = src->top->prev->prev->value;
	if (top > prev && top > pprev && pprev > prev)
	{
		if (!ft_strcmp(src->stk_name, "b"))
		{
			ft_push_stack(&src, &dst);
			ft_swap_bef_push_stack(src, dst, e_false, 2);
			return (e_true);
		}
		else if (!ft_strcmp(src->stk_name, "a"))
		{
			ft_swap_bef_push_stack(src, dst, e_false, 1);
			ft_swap_bef_push_stack(src, dst, e_false, 2);
			return (e_true);
		}
	}
	return (e_false);
}
