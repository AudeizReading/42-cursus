/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pwd.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:34:43 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:34:46 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_getcwd(char **env)
{
	char	*cwd;

	if (!env)
		return (NULL);
	cwd = ft_getenv_arr("PWD", env);
	if (!cwd)
		return (NULL);
	return (cwd);
}

int	ft_pwd(t_cmd *cmd)
{
	char			*working_dir;
	char			**env;

	env = ft_read_env(ENV_FILE);
	working_dir = NULL;
	if (cmd->nb_args > 1 && cmd->args[1][0] == '-')
	{
		free_char_array(env);
		errno = EINVAL;
		return (1);
	}
	else
	{
		working_dir = ft_getcwd(env);
		ft_putendl_fd(working_dir, STDOUT_FILENO);
		free(working_dir);
	}
	if (cmd->pos == 1 && cmd->nb_cmd == 1)
		ft_write_env(ENV_FILE, env);
	free_char_array(env);
	return (0);
}
