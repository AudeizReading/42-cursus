/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   status.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:37:13 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 20:19:03 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	add_exitstatus(int status, int pid, int exit, t_stat **status_lst)
{
	t_stat	*elt;

	elt = init_status(status, exit, pid);
	addback_status(status_lst, elt);
}

/* Like man waitpid said under section NOTES :
**
**	"If a signal is caught while any of the wait() calls is pending,
**	the call may be interrupted or restarted when the signal-catching
**	routine returns, depending on the options in effect for the signal;
**	see intro(2), System call restart."
**
**	It is exactly what is happening here when ^C or ^\ are sent: the waitpid call
**	is interrupted and I only get back the exit status at the next call of fn
**	executor - a bit late in some case. Worst, the process concerned is not
**	killed correctly ans stay as zombie. It will be killed at the next time, but
**	what if there is no next time ?
**
**	Maybe I'm on the wrong way for resolving that, but the only idea that I have
**	had that works, is to call 2 times waitpid : first time for the normal exit
**	and the second time for signaled interruptions, and it works.
*/

t_stat	*get_status(void)
{
	int		status;
	char	*exit_status;
	t_stat	*status_lst;
	pid_t	pid;

	exit_status = NULL;
	status_lst = NULL;
	pid = waitpid(0, &status, 0);
	while (0 <= pid)
	{
		if (WIFEXITED(status))
			add_exitstatus(WEXITSTATUS(status), pid, 1, &status_lst);
		pid = waitpid(0, &status, 0);
	}
	pid = waitpid(0, &status, 0);
	while (0 <= pid)
	{
		if (WIFSIGNALED(status))
		{
			add_exitstatus(128 + WTERMSIG(status), pid, 0, &status_lst);
			errno = EINTR;
		}
		pid = waitpid(0, &status, 0);
	}
	return (status_lst);
}

t_cmd	*get_last_stat_cmd(t_cmd **cmd, t_stat *status_lst)
{
	t_cmd	*tmp_cmd;
	t_stat	*tmp_stat;
	t_cmd	*last;

	tmp_stat = status_lst;
	tmp_cmd = *cmd;
	while (tmp_cmd)
	{
		while (tmp_stat)
		{
			if (tmp_stat->pid == tmp_cmd->pid)
			{
				tmp_cmd->status = tmp_stat->value;
				tmp_cmd->exit = tmp_stat->normal_exit;
			}
			tmp_stat = tmp_stat->next;
		}
		if (!tmp_stat)
			tmp_stat = status_lst;
		if (!tmp_cmd->next)
			last = tmp_cmd;
		tmp_cmd = tmp_cmd->next;
	}
	return (last);
}

char	*get_final_status(t_cmd **cmd)
{
	char	*exit_status;
	t_stat	*status_lst;
	t_cmd	*last;

	status_lst = get_status();
	last = get_last_stat_cmd(cmd, status_lst);
	if (last->exit)
		exit_status = ft_itoa(last->status);
	else
	{
		if (status_lst)
			exit_status = ft_itoa(status_lst->value);
		else
			exit_status = ft_itoa(127);
	}
	clear_status(&status_lst);
	return (exit_status);
}

void	set_status(t_cmd **cmd)
{
	char	*exit_status;
	char	**env;

	exit_status = get_final_status(cmd);
	env = ft_read_env(ENV_FILE);
	ft_setenv_arr("?", exit_status, &env);
	ft_write_env(ENV_FILE, env);
	free(exit_status);
	free_char_array(env);
}
