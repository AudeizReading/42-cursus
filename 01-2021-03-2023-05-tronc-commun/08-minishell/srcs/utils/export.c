/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   export.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:44:28 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:44:29 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_display_export(char *name, char *value, int fd)
{
	char	*tmp;

	tmp = NULL;
	if (ft_strncmp(name, "_", ft_strlen(name))
		&& ft_strncmp(name, "?", ft_strlen("?")))
	{
		tmp = ft_concat(tmp, name);
		if (ft_strlen(value + 1))
		{
			tmp = ft_concat(tmp, "=\"");
			tmp = ft_concat(tmp, (value + 1));
			tmp = ft_concat(tmp, "\"");
		}
		tmp = ft_concat2("declare -x ", tmp);
		ft_putendl_fd(tmp, fd);
		free(tmp);
		return (1);
	}
	return (0);
}

char	*ft_get_name(char *env_val)
{
	int		i;
	char	*name;

	i = 0;
	while (env_val[i] && env_val[i] != '=')
		i++;
	name = malloc((i + 1) * sizeof(char));
	if (!name)
		return (NULL);
	name[i] = 0;
	while (i--)
		name[i] = env_val[i];
	if (!name)
		return (NULL);
	return (name);
}

int	ft_set_display(char **env, int fd)
{
	char	*name;
	char	*value;
	int		i;

	i = -1;
	while (env[++i])
	{
		name = ft_get_name(env[i]);
		if (!name)
			return (0);
		value = ft_strchr(env[i], '=');
		ft_display_export(name, value, fd);
		free(name);
	}
	return (1);
}

int	ft_display_env(int fd)
{
	char	**env;
	int		i;

	env = ft_read_env(ENV_FILE);
	if (!env)
		return (0);
	i = 0;
	while (env[i])
		i++;
	ft_qsort_tab((void **)env, 0, i - 1, ft_strcmp);
	if (!ft_set_display(env, fd))
		return (0);
	free_char_array(env);
	return (1);
}

int	ft_export_var(char ***env, char *arg)
{
	char	*name;
	char	*value;

	name = ft_get_name(arg);
	if (!name)
		return (0);
	value = ft_strchr(arg, '=');
	if (!value)
		ft_setenv_arr(name, NULL, env);
	else
		ft_setenv_arr(name, value + 1, env);
	free(name);
	return (1);
}
