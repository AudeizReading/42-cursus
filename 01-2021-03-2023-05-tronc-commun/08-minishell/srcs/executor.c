/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   executor.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:46:39 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/19 08:39:24 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	execve_minishell(void)
{
	char	*mspath;

	mspath = get_env_var("?cwd");
	execve(mspath, NULL, NULL);
	free(mspath);
}

int	exec_cmd(t_cmd *cmd, char **env)
{
	char	*path;

	handle_redir_cmd(cmd);
	path = get_cmd_path(cmd->args[0], &env);
	if (!path)
		path = ft_strdup("");
	ft_setenv_arr("_", path, &env);
	if (cmd->nb_cmd == 1)
		ft_write_env(ENV_FILE, env);
	if (!ft_parse_builtin(cmd))
	{
		if (path && (path[0] != '<' && path[0] != '>'))
			execve(path, cmd->args, env);
		if (errno == EACCES)
			cmd->status = 126;
		else if (errno == ENOENT)
			cmd->status = 127;
		set_exitstatus(cmd->status);
		print_cmd_not_found_err(cmd->args[0], cmd->status);
		free(path);
		free_char_array(env);
		execve_minishell();
	}
	return (1);
}

int	child_process(t_cmd *cmd, char **env)
{
	pid_t	pid;

	pid = fork();
	if (pid)
		cmd->pid = pid;
	if (pid < 0)
	{
		perror("minishell: fork");
		return (0);
	}
	if (pid == 0)
	{
		handle_pipes(cmd);
		exec_cmd(cmd, env);
	}
	return (1);
}

int	launch_cmd(t_cmd *cmd)
{
	char	**env;

	env = ft_read_env(ENV_FILE);
	while (cmd)
	{
		cmd->status = get_status_open(&cmd);
		if (avoid_kill_minishell(cmd->args, env) || cmd->status == -2)
		{
			if (cmd->status == -2)
				make_exit_status_sigint_heredoc();
			if (env)
				free_char_array(env);
			return (1);
		}
		if (!open_pipes(cmd) || !child_process(cmd, env))
		{
			free_char_array(env);
			return (0);
		}
		close_pipes(cmd);
		cmd = cmd->next;
	}
	free_char_array(env);
	return (1);
}

int	executor(t_cmd *cmd)
{
	t_cmd	*last_cmd;

	toggle_signals(1);
	last_cmd = get_last_cmd(cmd);
	if (!launch_cmd(cmd))
		return (0);
	set_status(&cmd);
	toggle_signals(0);
	if (!ft_strcmp(last_cmd->args[0], "exit") && cmd->nb_cmd == 1)
		return (0);
	return (1);
}
