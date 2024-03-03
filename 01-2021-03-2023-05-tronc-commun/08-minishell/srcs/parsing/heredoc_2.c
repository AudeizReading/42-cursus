/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   heredoc_2.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/18 20:28:19 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 20:28:49 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

/* 
** When SIGINT is intercepted inside heredoc, we need to quit
** but readline is waiting for the \n input user (only keyboard \n, cannot put
** it inside a write stdout for get backing inside readline, closing stdin gets
** me unexpected behavior also)
** the only way I've found for quitting without hitting \n on keyboard is to set
** rl_done to a non-zero value, like that it returns the current input buffer
** value immediatly. But the var rl_done is only checked on the event loop (var
** rl_event_hook), so when we set it to an empty event, it only checks the value
** of rl_done and exits, and it works, that's why I use the way.
** Be careful, they are not unallowed functions, they are global variables of
** the readline library, and that's why we can use them, like the norm allows us
** check the slack threads about global var of authorized libraries if you do not
** believe me.
*/
int	event_heredoc(void)
{
	return (0);
}

int	rl_heredoc(char **input, char **big_input, char *keyword, int *line)
{
	*input = readline(" > ");
	if (!*input)
		return (0);
	if (!strcmp(*input, ""))
	{
		free(*big_input);
		free(*input);
		toggle_signals(1);
		return (-1);
	}
	if (strcmp(*input, keyword))
	{
		if (line)
			*big_input = ft_concat(*big_input, "\n");
		*big_input = ft_concat(*big_input, *input);
		line++;
	}
	if (!strcmp(*input, keyword))
		return (1);
	free(*input);
	return (2);
}

void	make_exit_status_sigint_heredoc(void)
{
	char	*sigint;
	pid_t	pid;

	sigint = get_env_var("?heredoc");
	pid = 0;
	if (!sigint)
		return ;
	if (!ft_strcmp(sigint, "sigint"))
	{
		free(sigint);
		set_exitstatus(1);
		set_env_var("?heredoc", "");
		pid = fork();
		if (pid == 0)
			execve_minishell();
	}
}

int	is_sigint_heredoc(void)
{
	char	*status;

	status = get_env_var("?heredoc");
	if (status)
	{
		if (!ft_strcmp(status, "sigint"))
		{
			free(status);
			return (1);
		}
		free(status);
	}
	return (0);
}
