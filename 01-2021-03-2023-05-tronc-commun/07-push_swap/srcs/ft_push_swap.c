/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_push_swap.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/13 10:32:50 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 12:26:43 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

void	ft_divide_stack(t_stk *src, t_stk *dst)
{
	t_piv	pivot;
	t_stk	*current_grp;
	int		size;
	int		i;

	if (!src->size || !dst->size)
		return ;
	current_grp = ft_get_stk_4_med(src, src->top->grp);
	pivot = ft_get_median_grp(current_grp);
	size = current_grp->size;
	i = 0;
	while (size--)
	{
		if (!ft_strcmp(src->stk_name, "a"))
			i += ft_set_grp_a(src, dst, 7770, pivot.me);
		else if (!ft_strcmp(src->stk_name, "b"))
			i += ft_set_grp_b(src, dst, 10000, pivot.q3);
	}
	ft_put_grp_on_top(src, &i);
	ft_pop_clear_stk(&current_grp);
}

void	ft_divide_stack_b(t_stk *b, t_stk *a)
{
	t_stk	*current_grp;

	if (!b->size)
		return ;
	current_grp = ft_get_stk_4_med(b, b->top->grp);
	if (!current_grp)
		return ;
	if (ft_stack_is_sort(b))
		while (b->size)
			ft_push_stack(&b, &a);
	else if ((ft_stack_is_sort(a) && !b->size))
		return ;
	else if (b->size < 4)
		ft_sort_little_stack(b, a);
	else if (b->size > 3)
	{
		ft_sort_big_stack(b, a, current_grp->size);
		ft_divide_stack_b(b, a);
	}
	else
		return ;
	ft_pop_clear_stk(&current_grp);
}

t_bool	ft_is_end_bef_begin(t_stk *a, t_stk *b, char **args)
{
	if (a->size < 2 || ft_stack_a_is_sort(a))
	{
		ft_pop_clear_stk(&a);
		ft_pop_clear_stk(&b);
		ft_free_args(args);
		return (e_true);
	}
	return (e_false);
}

int	ft_push_swap(int argc, char **argv)
{
	char	**args;
	t_stk	*a;
	t_stk	*b;

	args = ft_parse_args(argc, argv);
	if (!args)
		return (-1);
	a = ft_tab_to_stack(args);
	b = ft_init_stack("b");
	if (!ft_are_stacks_ready_2_sort(a, b, args))
		return (-1);
	if (ft_is_end_bef_begin(a, b, args))
		return (0);
	ft_divide_stack_a(a, b);
	ft_divide_stack_b(b, a);
	if (a)
		ft_pop_clear_stk(&a);
	if (b)
		ft_pop_clear_stk(&b);
	if (args)
		ft_free_args(args);
	return (1);
}
