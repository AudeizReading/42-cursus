/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   word.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/12 16:34:06 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/12 17:12:21 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	concat_word_tokens(t_tok **tmp, int pos, t_tok **elt)
{
	char	*cont;

	cont = ft_strdup((*tmp)->content);
	while ((*tmp) && (*tmp)->next
		&& (*tmp)->type == WORD && (*tmp)->next->type == WORD)
	{
		cont = ft_concat(cont, (*tmp)->next->content);
		(*tmp) = (*tmp)->next;
	}
	(*elt) = init_token(WORD, pos, cont);
	free(cont);
}

void	search_concat_word(t_tok **tmp, int *pos, t_tok **new_tok)
{
	t_tok	*elt;

	elt = NULL;
	if ((*tmp) && (*tmp)->next
		&& (*tmp)->type == WORD && (*tmp)->next->type == WORD)
		concat_word_tokens(tmp, *pos, &elt);
	else
		if (*tmp)
			elt = init_token((*tmp)->type, *pos, (*tmp)->content);
	if (*tmp)
		(*tmp) = (*tmp)->next;
	addback_token(new_tok, elt);
	(*pos)++;
}

int	parse_word_type(t_tok **token)
{
	t_tok	*new_tok;
	t_tok	*tmp;
	int		pos;

	tmp = *token;
	new_tok = NULL;
	pos = 0;
	while (tmp)
		search_concat_word(&tmp, &pos, &new_tok);
	clear_token(token);
	addback_token(token, new_tok);
	return (1);
}
