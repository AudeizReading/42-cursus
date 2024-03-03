/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   set_env.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:36:49 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:36:51 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_set_new_env_content(char **content, char ***env)
{
	char	**new_env;

	new_env = NULL;
	new_env = ft_arrstrjoin(*env, content);
	if (!new_env)
		return (0);
	free_char_array(*env);
	*env = new_env;
	if (!env)
		return (0);
	return (1);
}

void	ft_free_env_tmp_arrays(char **beg, char **mid, char **end)
{
	if (beg)
		free_char_array(beg);
	if (mid)
		free_char_array(mid);
	if (end)
		free_char_array(end);
}

int	ft_update_env_content(char *name, char **content, char ***env)
{
	char	**begin;
	char	**end;
	char	**tmp;

	if (!name || !content)
		return (0);
	begin = ft_arrstrdup_til_name(*env, name);
	end = ft_arrstrdup_since_name(*env, name);
	if (!begin && !end)
		return (0);
	tmp = ft_arrstrjoin(begin, content);
	if (!tmp)
	{
		ft_free_env_tmp_arrays(begin, tmp, end);
		return (0);
	}
	free_char_array(*env);
	*env = ft_arrstrjoin(tmp, end);
	if (!*env)
	{
		ft_free_env_tmp_arrays(begin, tmp, end);
		return (0);
	}
	ft_free_env_tmp_arrays(begin, tmp, end);
	return (1);
}

int	ft_setenv_arr(char *name, char *value, char ***env)
{
	char	**p_content;

	if (!name || !env)
		return (1);
	p_content = ft_get_new_env_content(name, value);
	if (!ft_is_name_env_arr(name, *env))
	{
		ft_set_new_env_content(p_content, env);
		free_char_array(p_content);
		return (0);
	}
	else
	{
		ft_update_env_content(name, p_content, env);
		free_char_array(p_content);
		return (0);
	}
	free_char_array(p_content);
	return (1);
}

void	set_env_var(char *name, char *value)
{
	char	**env;

	env = ft_read_env(ENV_FILE);
	ft_setenv_arr(name, value, &env);
	ft_write_env(ENV_FILE, env);
	free_char_array(env);
}
