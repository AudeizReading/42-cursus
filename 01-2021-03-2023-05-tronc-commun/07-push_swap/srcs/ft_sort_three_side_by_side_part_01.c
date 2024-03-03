/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_sort_three_side_by_side_part_01.c               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/11 15:28:58 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:37:15 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

void	ft_push_stack_nb(t_stk *src, t_stk *dst, int nb)
{
	if (!nb || !src->size || !dst->size)
		return ;
	while (nb--)
		ft_push_stack(&src, &dst);
}

/* tgl is for toggle -> thank you the norm */
void	ft_swap_bef_push_stack(t_stk *src, t_stk *dst, t_bool tgl, int nb)
{
	if (!src->size || !dst->size)
		return ;
	if (tgl)
		ft_swap_stack(dst);
	else
		ft_swap_stack(src);
	ft_push_stack_nb(src, dst, nb);
}

void	ft_sort_descending_order(t_stk *src, t_stk *dst)
{
	if (!src->size || !dst->size)
		return ;
	ft_swap_bef_push_stack(src, dst, e_false, 1);
	ft_swap_bef_push_stack(src, dst, e_false, 1);
	ft_swap_bef_push_stack(src, dst, e_true, 1);
}

void	ft_sort_231_or_213(t_stk *src, t_stk *dst)
{
	if (!src->size || !dst->size)
		return ;
	ft_push_stack(&src, &dst);
	ft_swap_bef_push_stack(src, dst, e_false, 1);
	ft_swap_bef_push_stack(src, dst, e_true, 1);
}

t_bool	ft_sort_3_elts_side_by_side(t_stk *src, t_stk *dst)
{
	t_bool	cond_1;
	t_bool	cond_2;
	t_bool	cond_3;

	if (!src || !dst || src->size < 3)
		return (e_false);
	cond_1 = (ft_sort_t_p_pp(src, dst) || ft_sort_t_pp_p(src, dst));
	if (cond_1)
		return (e_true);
	cond_2 = (ft_sort_p_pp_t(src, dst) || ft_sort_p_t_pp(src, dst));
	if (cond_2)
		return (e_true);
	cond_3 = (ft_sort_pp_t_p(src, dst) || ft_sort_pp_p_t(src, dst));
	if (cond_3)
		return (e_true);
	return (e_false);
}
