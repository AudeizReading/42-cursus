/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cmd_1.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:44:11 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/15 12:49:52 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

t_cmd	*init_cmd(void)
{
	t_cmd	*cmd;

	cmd = malloc(sizeof(*cmd));
	if (!cmd)
		return (NULL);
	ft_bzero(cmd, sizeof(*cmd));
	return (cmd);
}

t_cmd	*get_last_cmd(t_cmd *cmd)
{
	if (!cmd)
		return (NULL);
	while (cmd->next)
		cmd = cmd->next;
	return (cmd);
}

int	get_nb_cmd(t_cmd *cmd)
{
	int		nb_cmd;

	nb_cmd = 0;
	while (cmd)
	{
		nb_cmd++;
		cmd = cmd->next;
	}
	return (nb_cmd);
}

void	addback_cmd(t_cmd **cmd, t_cmd *new)
{
	t_cmd	*last;

	if (!*cmd)
	{
		new->pos = 1;
		*cmd = new;
		return ;
	}
	last = get_last_cmd(*cmd);
	new->pos = last->pos + 1;
	new->prev = last;
	last->next = new;
}

void	clear_cmd(t_cmd **cmd)
{
	t_cmd	*tmp;

	close_fd(cmd);
	while (*cmd)
	{
		tmp = (*cmd)->next;
		free_char_array((*cmd)->args);
		clear_redir(&(*cmd)->redir);
		free(*cmd);
		(*cmd) = tmp;
	}
}
