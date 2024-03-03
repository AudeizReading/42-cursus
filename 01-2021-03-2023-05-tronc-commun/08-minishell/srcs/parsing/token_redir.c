/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token_redir.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:40:51 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:40:53 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	set_redirs_tok_v2(t_tok **tokens, t_tok **redirs, int *err)
{
	copy_token(*tokens, redirs, (*tokens)->pos);
	while ((*tokens)->next->type == WHITE_SPACE)
		(*tokens) = (*tokens)->next;
	if ((*tokens)->next->type == WORD)
	{
		copy_token((*tokens)->next, redirs, (*tokens)->next->pos);
		(*tokens) = (*tokens)->next->next;
	}
	else
	{
		clear_token(redirs);
		(*err) = 1;
		return (0);
	}
	return (1);
}

t_tok	*get_redirs_tok_v2(t_tok *tokens, int *err)
{
	t_tok	*redirs;

	redirs = NULL;
	while (tokens)
	{
		while (tokens && tokens->type != PIPE)
		{
			if (is_redir(tokens->type))
			{
				if (!set_redirs_tok_v2(&tokens, &redirs, err))
					return (NULL);
			}
			else
				tokens = tokens->next;
		}
		if (tokens && tokens->type == PIPE)
		{
			copy_token(tokens, &redirs, tokens->pos);
			tokens = tokens->next;
		}
	}
	return (redirs);
}

void	free_tokenss(t_tok **tokens, int nb_cmd)
{
	int	i;

	i = 0;
	while (i < nb_cmd)
	{
		clear_token(&tokens[i]);
		i++;
	}
	free(tokens);
}

int	set_redirs_tok_v3(t_tok *tokens, t_tok **redirs, int *cnt, int *err)
{
	while (tokens)
	{
		redirs[*cnt] = NULL;
		while (tokens && tokens->type != PIPE)
		{
			if (is_redir(tokens->type))
			{
				if (!set_redirs_tok_v2(&tokens, &redirs[*cnt], err))
					return (0);
			}
			else
				tokens = tokens->next;
		}
		if (tokens && tokens->type == PIPE)
		{
			tokens = tokens->next;
			(*cnt)++;
		}
	}
	return (1);
}

t_tok	**get_redirs_tok_v3(t_tok *tokens, int *err)
{
	t_tok	**redirs;
	int		nb_cmd;
	int		cnt;

	cnt = 0;
	nb_cmd = get_nb_pipes(tokens) + 1;
	redirs = malloc(sizeof(*redirs) * (nb_cmd + 1));
	if (!redirs)
		return (NULL);
	if (!set_redirs_tok_v3(tokens, redirs, &cnt, err))
		return (NULL);
	return (redirs);
}
