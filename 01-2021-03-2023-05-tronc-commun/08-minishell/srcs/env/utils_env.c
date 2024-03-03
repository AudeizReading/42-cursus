/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils_env.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:37:39 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:37:42 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_search_env_value(char *var, char *name)
{
	char	*value;
	char	*offset;
	size_t	off_len;

	if (!var || !name)
		return (NULL);
	offset = ft_strjoin(name, "=");
	if (!offset)
		return (NULL);
	off_len = ft_strlen(offset);
	if (!ft_strncmp(var, offset, off_len))
	{
		value = ft_strdup(var + off_len);
		free(offset);
		if (!value)
			return (NULL);
		return (value);
	}
	free(offset);
	return (NULL);
}

t_bool	ft_is_name_env_arr(char *name, char **env)
{
	char	**p_env;

	p_env = env;
	if (!name || !env)
		return (e_false);
	while (*p_env)
	{
		if (!ft_strncmp(*p_env, name, ft_strlen(name)))
			return (e_true);
		p_env++;
	}
	return (e_false);
}

void	set_nbcmd_envfile(t_cmd *cmd)
{
	char	**env;
	char	*nb_cmd_str;

	env = ft_read_env(ENV_FILE);
	nb_cmd_str = ft_itoa(cmd->nb_cmd);
	ft_setenv_arr("?nb_cmd", nb_cmd_str, &env);
	ft_write_env(ENV_FILE, env);
	free(nb_cmd_str);
	free_char_array(env);
}

void	increment_shlvl(char ***env)
{
	char	*shlvl;
	int		lvl;

	shlvl = ft_getenv_arr("SHLVL", *env);
	lvl = ft_atoi(shlvl);
	lvl++;
	free(shlvl);
	shlvl = ft_itoa(lvl);
	ft_setenv_arr("SHLVL", shlvl, env);
	free(shlvl);
}

void	set_exitstatus(int status)
{
	char	**env;
	char	*exit_status;

	env = ft_read_env(ENV_FILE);
	exit_status = ft_itoa(status);
	ft_setenv_arr("?", exit_status, &env);
	ft_write_env(ENV_FILE, env);
	free(exit_status);
	free_char_array(env);
}
