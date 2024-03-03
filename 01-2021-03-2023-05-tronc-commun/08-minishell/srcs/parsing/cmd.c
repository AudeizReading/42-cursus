/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cmd.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:38:13 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 20:22:08 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	close_fd(t_cmd **cmd)
{
	t_cmd	*tmp;

	tmp = *cmd;
	while (tmp)
	{
		if (tmp->redir->i_type == D_LESS)
			unlink(tmp->redir->i_name);
		if (tmp->input > 0)
			close(tmp->input);
		if (tmp->output > 1)
			close(tmp->output);
		tmp = tmp->next;
	}
}

void	set_cmd_redir(t_cmd **elt, t_redir *redir)
{
	if (redir->i_type == LESS)
		(*elt)->input = 0;
	else if (redir->i_type == D_LESS)
		(*elt)->input = 0;
	else
		(*elt)->input = STDIN_FILENO;
	if (redir->o_type == D_GREAT)
		(*elt)->output = 1;
	else if (redir->o_type == GREAT)
		(*elt)->output = 1;
	else
		(*elt)->output = STDOUT_FILENO;
}

void	set_cmd(t_tok *token, t_cmd **cmd, int pipes)
{
	t_cmd	*elt;
	int		err;

	err = 0;
	elt = init_cmd();
	elt->args = get_args(token);
	elt->nb_args = get_nb_args(token);
	elt->nb_cmd = pipes + 1;
	elt->redir = get_redirs(token);
	set_cmd_redir(&elt, elt->redir);
	addback_cmd(cmd, elt);
}

t_cmd	*get_cmds(t_tok *token)
{
	t_cmd	*cmd;
	int		pipes;
	int		i;

	cmd = NULL;
	pipes = get_nb_pipes(token);
	i = 0;
	while (i <= pipes)
	{
		while (token && (token->type == WHITE_SPACE || token->type == PIPE))
			token = token->next;
		if (!token)
			return (NULL);
		set_cmd(token, &cmd, pipes);
		while (token && token->type != PIPE)
			token = token->next;
		i++;
	}
	return (cmd);
}
