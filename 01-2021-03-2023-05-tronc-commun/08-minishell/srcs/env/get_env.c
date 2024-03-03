/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_env.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:35:29 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/19 08:35:14 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_getenv_arr(char *name, char **envp)
{
	char	*value;
	char	**p_envp;

	p_envp = envp;
	while (*p_envp)
	{
		value = ft_search_env_value(*p_envp, name);
		if (value)
			return (value);
		p_envp++;
	}
	return (NULL);
}

char	**ft_get_new_env_content(char *name, char *value)
{
	char	*content;
	char	**cont_arr;

	if (!name)
		return (NULL);
	content = ft_strjoin(name, "=");
	content = ft_concat(content, value);
	if (!content)
		return (NULL);
	cont_arr = ft_split(content, 0);
	free(content);
	if (!cont_arr)
		return (NULL);
	return (cont_arr);
}

char	*get_env_var(char *name)
{
	char	*value;
	char	**env;

	env = ft_read_env(ENV_FILE);
	value = ft_getenv_arr(name, env);
	free_char_array(env);
	return (value);
}

int	get_exitstatus(void)
{
	int		status;
	char	*status_str;
	char	**env;

	env = ft_read_env(ENV_FILE);
	status_str = ft_getenv_arr("?", env);
	if (!status_str)
		status = -1;
	else
		status = ft_atoi(status_str);
	free(status_str);
	free_char_array(env);
	return (status);
}
