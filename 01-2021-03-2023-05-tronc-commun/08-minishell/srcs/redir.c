/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redir.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:48:09 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/17 20:44:15 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	handle_redir_cmd(t_cmd *cmd)
{
	if (cmd->args[0][0] == '<' || cmd->args[0][0] == '>'
			|| cmd->input == -1)
	{
		if (cmd->status == 1)
			cmd->status = 0;
		else
		{
			cmd->status = 1;
			errno = ENOENT;
		}
		set_exitstatus(cmd->status);
		execve_minishell();
	}
}

int	open_pipes(t_cmd *cmd)
{
	if (cmd->next)
	{
		if (pipe(cmd->pipes) == -1)
		{
			perror("minishell: pipe");
			return (0);
		}
	}
	return (1);
}

void	handle_pipes(t_cmd *cmd)
{
	dup2(cmd->output, STDOUT_FILENO);
	dup2(cmd->input, STDIN_FILENO);
	if (cmd->next)
	{
		close(cmd->pipes[0]);
		dup2(cmd->pipes[1], cmd->output);
		close(cmd->pipes[1]);
	}
	if (cmd->prev)
	{
		dup2(cmd->prev->pipes[0], cmd->input);
		close(cmd->prev->pipes[0]);
	}
}

void	close_pipes(t_cmd *cmd)
{
	if (cmd->next)
		close(cmd->pipes[1]);
	if (cmd->prev)
		close(cmd->prev->pipes[0]);
}
