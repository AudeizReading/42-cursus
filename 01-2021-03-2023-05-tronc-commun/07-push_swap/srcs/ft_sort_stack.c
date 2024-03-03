/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_stack.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/13 10:16:53 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 10:25:33 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

void	ft_sort_little_grp(t_stk *src, t_stk *dst, int size)
{
	if (!src->size || !dst->size || size > 3)
		return ;
	if (size == 1)
		ft_push_stack(&src, &dst);
	else if (size == 2)
	{
		ft_sort_two(src);
		ft_push_stack_nb(src, dst, 2);
	}
	else
		ft_sort_3_elts_side_by_side(src, dst);
}

void	ft_sort_big_grp(t_stk *src, t_stk *dst)
{
	ft_divide_stack(src, dst);
	while (!ft_stack_is_sort(dst))
		ft_divide_stack(dst, src);
}

void	ft_sort_little_stack(t_stk *src, t_stk *dst)
{
	if (!src->size || !dst->size)
		return ;
	if (!ft_sort_three(src))
		ft_sort_two(src);
	while (src->size)
		ft_push_stack(&src, &dst);
}

void	ft_sort_big_stack(t_stk *src, t_stk *dst, int size)
{
	if (!src->size || !dst->size || !size)
		return ;
	if (size > 3)
		ft_sort_big_grp(src, dst);
	else
		ft_sort_little_grp(src, dst, size);
}

t_bool	ft_are_stacks_ready_2_sort(t_stk *a, t_stk *b, char **args)
{
	if (!a || !b)
	{
		if (a)
			ft_pop_clear_stk(&a);
		ft_free_args(args);
		return (e_false);
	}
	return (e_true);
}
