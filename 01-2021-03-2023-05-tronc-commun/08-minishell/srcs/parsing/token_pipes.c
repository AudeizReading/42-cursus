/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token_pipes.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:40:36 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/14 21:45:42 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	get_nb_pipes(t_tok *token)
{
	int		nb;
	t_tok	*tmp;

	tmp = token;
	nb = 0;
	while (tmp)
	{
		if (tmp->type == PIPE)
			nb++;
		tmp = tmp->next;
	}
	return (nb);
}

int	check_pipe_type(t_tok **tmp)
{
	if ((*tmp)->pos == 0 && (*tmp)->type == WHITE_SPACE)
	{
		while ((*tmp) && (*tmp)->type == WHITE_SPACE)
		{
			(*tmp) = (*tmp)->next;
			if ((*tmp) && (*tmp)->type == PIPE)
				return (0);
		}
	}
	else if ((*tmp) && (*tmp)->type == PIPE)
	{
		if ((*tmp)->pos == 0)
			return (0);
		(*tmp) = (*tmp)->next;
		while ((*tmp) && (*tmp)->type == WHITE_SPACE)
			(*tmp) = (*tmp)->next;
		if ((*tmp) && (*tmp)->type == PIPE)
			return (0);
	}
	else
		(*tmp) = (*tmp)->next;
	return (1);
}

int	parse_pipe_type(t_tok *tok)
{
	t_tok	*tmp;

	tmp = tok;
	while (tmp)
	{
		if (!check_pipe_type(&tmp))
			return (0);
	}
	return (1);
}
