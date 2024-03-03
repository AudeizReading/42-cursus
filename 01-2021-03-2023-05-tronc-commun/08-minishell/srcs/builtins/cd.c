/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cd.c                                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:32:13 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/16 12:13:29 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_chdir(void)
{
	char	**env;
	char	*cwd;

	env = ft_read_env(ENV_FILE);
	if (!env)
		cwd = getenv("PWD");
	cwd = ft_getenv_arr("PWD", env);
	if (cwd)
		chdir(cwd);
	free_char_array(env);
	free(cwd);
	return (1);
}

int	ft_go_home(char ***env)
{
	char	*home;
	char	*old_pwd;

	home = ft_getenv_arr("HOME", *env);
	if (!home)
	{
		errno = ENOENT;
		return (0);
	}
	old_pwd = ft_getenv_arr("PWD", *env);
	ft_setenv_arr("OLDPWD", old_pwd, env);
	ft_setenv_arr("PWD", home, env);
	free(home);
	free(old_pwd);
	return (1);
}

int	ft_go_arg(t_cmd *cmd, char ***env)
{
	char	*old_pwd;
	char	*abs_path;

	abs_path = ft_get_new_cwd(cmd->args[1]);
	if (!abs_path)
		return (0);
	old_pwd = ft_getenv_arr("PWD", *env);
	if (!old_pwd)
		return (0);
	if (!ft_set_new_cwd(env, old_pwd, abs_path))
		return (0);
	return (1);
}

void	ft_sub_cd(t_cmd *cmd)
{
	char	**env;
	char	*arg;

	env = ft_read_env(ENV_FILE);
	arg = cmd->args[1];
	if (cmd->nb_args == 1)
	{
		if (ft_go_home(&env))
			errno = 0;
	}
	else if (cmd->nb_args > 1 && *arg == '-' && !*(arg + 1))
		errno = ENOENT;
	else
		ft_go_arg(cmd, &env);
	if (cmd->pos == 1 && cmd->nb_cmd == 1)
		ft_write_env(ENV_FILE, env);
	free_char_array(env);
}

int	ft_cd(t_cmd *cmd)
{
	if (cmd->nb_args <= 2)
		ft_sub_cd(cmd);
	else
		errno = EFAULT;
	if (errno)
		return (1);
	return (0);
}
