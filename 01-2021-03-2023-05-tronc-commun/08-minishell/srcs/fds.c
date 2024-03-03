/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fds.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:47:07 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 20:17:33 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	open_input_redir(t_cmd **cmd, t_tok *tmp, int last_input_pos)
{
	if (tmp->type == LESS)
	{
		(*cmd)->input = open(tmp->next->content, O_RDONLY, 0644);
		if (tmp->pos != last_input_pos)
			close((*cmd)->input);
	}
	else if (tmp->type == D_LESS)
		init_heredoc(cmd, tmp->next->content, tmp->pos, last_input_pos);
	if ((*cmd)->input < 0)
	{
		errno = ENOENT;
		print_cmd_not_found_err(tmp->next->content, 1);
		return ((*cmd)->input);
	}
	return (1);
}

int	open_output_redir(t_cmd **cmd, t_tok *tmp, int last_output_pos)
{
	if (tmp->type == GREAT)
		(*cmd)->output = open(tmp->next->content,
				O_WRONLY | O_TRUNC | O_CREAT, 0644);
	else if (tmp->type == D_GREAT)
		(*cmd)->output = open(tmp->next->content,
				O_WRONLY | O_APPEND | O_CREAT, 0644);
	if ((*cmd)->output < 0)
	{
		errno = ENOENT;
		print_cmd_not_found_err(tmp->next->content, 1);
		return ((*cmd)->output);
	}
	if (tmp->pos != last_output_pos)
		close((*cmd)->output);
	return (1);
}

int	open_fds(t_cmd **cmd, int last_input_pos, int last_output_pos)
{
	t_tok	*tmp;
	int		ret;

	tmp = (*cmd)->redir->token;
	ret = 0;
	while (tmp)
	{
		if (is_input_redir(tmp->type))
		{
			ret = open_input_redir(cmd, tmp, last_input_pos);
			if (ret < 0)
				return (-1);
		}
		else if (is_output_redir(tmp->type))
		{
			ret = open_output_redir(cmd, tmp, last_output_pos);
			if (ret < 0)
				return (-1);
		}
		if (is_sigint_heredoc())
			return (-2);
		tmp = tmp->next;
	}
	return (1);
}

int	get_status_open(t_cmd **cmd)
{
	int		last_input_pos;
	int		last_output_pos;
	int		status;

	last_input_pos = get_last_input_pos((*cmd)->redir->token);
	last_output_pos = get_last_output_pos((*cmd)->redir->token);
	status = open_fds(cmd, last_input_pos, last_output_pos);
	return (status);
}
