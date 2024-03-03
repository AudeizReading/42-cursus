/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   special_chars.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:40:12 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:40:14 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

/* $--------------------------------------------------------------------- */
void	transl8_dol_tok(t_tok **tmp, int pos, t_tok **elt)
{
	char	*str_quote;

	(*tmp) = (*tmp)->next;
	str_quote = get_env_var((*tmp)->content);
	(*elt) = init_token(WORD, pos, str_quote);
	free(str_quote);
	str_quote = NULL;
	(*tmp) = (*tmp)->next;
}

/* "--------------------------------------------------------------------- */
int	transl8_quo_tok(t_tok **tmp, int pos, t_tok **elt)
{
	char	*str_quote;
	int		check;

	check = 0;
	str_quote = translate_quotes((*tmp), (*(*tmp)->content));
	(*elt) = init_token(WORD, pos, str_quote);
	(*tmp) = check_closing_quote((*tmp), (*(*tmp)->content), &check);
	free(str_quote);
	str_quote = NULL;
	return (check);
}

/* \--------------------------------------------------------------------- */
void	parse_backslash(t_tok **tmp, int pos, t_tok **elt)
{
	char	*tmp_slash;

	tmp_slash = NULL;
	if ((*tmp)->next->type == WORD)
	{
		tmp_slash = ft_strjoin((*tmp)->content, (*tmp)->next->content);
		(*elt) = init_token(WORD, pos, tmp_slash);
		free(tmp_slash);
		(*tmp) = (*tmp)->next;
	}
	(*tmp) = (*tmp)->next;
}

void	search_translation(t_tok **tmp, int *pos, t_tok **new_tok)
{
	t_tok	*elt;

	elt = NULL;
	if ((*tmp)->type == QUOTE || (*tmp)->type == D_QUOTE)
		transl8_quo_tok(tmp, *pos, &elt);
	else if ((*tmp)->type == DOLLAR && (*tmp)->next)
		transl8_dol_tok(tmp, *pos, &elt);
	else if ((*tmp)->type == BACKSLASH && (*tmp)->next)
		parse_backslash(tmp, *pos, &elt);
	else
	{
		elt = init_token((*tmp)->type, *pos, (*tmp)->content);
		(*tmp) = (*tmp)->next;
	}
	addback_token(new_tok, elt);
	(*pos)++;
}

int	translate_tokens(t_tok **token)
{
	t_tok	*tmp;
	t_tok	*new_tok;
	int		pos;

	pos = 0;
	tmp = *token;
	new_tok = NULL;
	if (!check_quotes(tmp) || !check_last_input_char(tmp))
		return (0);
	while (tmp)
		search_translation(&tmp, &pos, &new_tok);
	clear_token(token);
	addback_token(token, new_tok);
	return (1);
}
