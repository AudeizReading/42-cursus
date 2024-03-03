/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parser.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:39:27 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/12 16:24:19 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	init_tokens(t_tok **tokens, char *input)
{
	(*tokens) = lexer(input);
	if (!translate_tokens(tokens) || !parse_pipe_type((*tokens)))
	{
		if ((*tokens))
			clear_token(tokens);
		return (0);
	}
	parse_word_type(tokens);
	return (1);
}

int	parse_redirs(t_tok *token)
{
	int		err;
	int		nb_cmd;
	t_tok	*redir;

	err = 0;
	nb_cmd = get_nb_pipes(token) + 1;
	redir = get_redirs_tok_v2(token, &err);
	if (err)
	{
		if (redir)
			clear_token(&redir);
		return (0);
	}
	clear_token(&redir);
	return (1);
}

int	parse_input(char *input, t_cmd **cmd)
{
	t_tok	*tokens;

	if (!init_tokens(&tokens, input) || !parse_redirs(tokens))
	{
		if (tokens)
			clear_token(&tokens);
		return (-1);
	}
	(*cmd) = get_cmds(tokens);
	if (!(*cmd))
	{
		return (1);
	}
	set_nbcmd_envfile((*cmd));
	clear_token(&tokens);
	return (2);
}
