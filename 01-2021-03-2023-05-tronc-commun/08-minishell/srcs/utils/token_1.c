/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token_1.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:45:34 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:45:36 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

t_tok	*init_token(int type, int pos, char *content)
{
	t_tok	*token;

	token = malloc(sizeof(*token));
	if (!token)
		return (NULL);
	token->type = type;
	token->pos = pos;
	token->next = NULL;
	token->content = ft_strdup(content);
	if (!token->content)
	{
		free(token);
		return (NULL);
	}
	return (token);
}

t_tok	*get_last_token(t_tok *tok)
{
	if (!tok)
		return (NULL);
	while (tok->next)
		tok = tok->next;
	return (tok);
}

int	get_nb_token(t_tok *tok)
{
	int		nb_tok;

	nb_tok = 0;
	while (tok)
	{
		nb_tok++;
		tok = tok->next;
	}
	return (nb_tok);
}

void	addback_token(t_tok **tok, t_tok *new)
{
	t_tok	*last;

	if (!*tok)
	{
		*tok = new;
		return ;
	}
	last = get_last_token(*tok);
	last->next = new;
}

void	clear_token(t_tok **tok)
{
	t_tok	*tmp;

	while (*tok)
	{
		tmp = (*tok)->next;
		free((*tok)->content);
		free(*tok);
		(*tok) = tmp;
	}
}
