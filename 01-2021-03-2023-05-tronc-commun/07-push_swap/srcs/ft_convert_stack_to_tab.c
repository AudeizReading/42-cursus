/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_convert_stack_to_tab.c                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/01 15:43:27 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 11:35:16 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

char	**ft_stack_to_tab(t_stk *stack)
{
	char		**dst;
	t_stk_elt	*tmp;
	int			i;

	if (!stack)
		return (NULL);
	i = 0;
	dst = (char **)malloc(sizeof(*dst) * (stack->size + 1));
	if (!dst)
		return (NULL);
	tmp = stack->top;
	while (tmp)
	{
		dst[i] = ft_ltoa(tmp->value);
		if (!dst[i])
		{
			while (dst[i--])
				free(dst[i]);
			free(dst);
		}
		i++;
		tmp = tmp->prev;
	}
	dst[i] = NULL;
	return (dst);
}

t_stk	*ft_tab_to_stack(char **args)
{
	t_stk		*a;
	t_stk_elt	*a_elt;
	int			i;

	a = ft_init_stack("a");
	if (!a)
	{
		ft_free_args(args);
		return (NULL);
	}
	i = 0;
	while (args[i])
	{
		a_elt = ft_init_stk_elt(ft_atol(args[i++]), 0, a->stk_name);
		if (!a_elt)
		{
			ft_pop_clear_stk(&a);
			return (NULL);
		}
		ft_stkadd_front(&a, a_elt);
	}
	return (a);
}
