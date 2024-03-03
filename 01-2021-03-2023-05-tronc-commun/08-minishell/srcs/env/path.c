/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   path.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:35:57 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/16 15:30:48 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_joinpath(char *paths, char *cmd)
{
	char	*path;

	if (!paths)
		return (NULL);
	path = ft_strjoin(paths, "/");
	path = ft_concat(path, cmd);
	if (!path)
		return (NULL);
	return (path);
}

char	**ft_getpaths(char **env, char *name)
{
	char	**paths;
	char	*paths_str;

	if (!env || !name)
		return (NULL);
	paths_str = ft_getenv_arr(name, env);
	if (!paths_str)
		return (NULL);
	paths = ft_split(paths_str, ':');
	free(paths_str);
	if (!paths)
		return (NULL);
	return (paths);
}

char	*ft_getpath(char **env, char *name, int mode, char *cmd)
{
	int		i;
	char	**paths;
	char	*path;

	if (!env || !name)
		return (NULL);
	paths = ft_getpaths(env, name);
	if (!paths)
		return (NULL);
	i = -1;
	while (paths[++i])
	{
		path = ft_joinpath(paths[i], cmd);
		if (!path || !access(path, mode))
		{
			free_char_array(paths);
			if (path)
				return (path);
			return (NULL);
		}
		free(path);
	}
	free_char_array(paths);
	return (NULL);
}

void	handle_mspath(char *path, char ***env)
{
	char	*cwd;
	char	*mspath;

	cwd = ft_getcwd(*env);
	cwd = ft_concat(cwd, path + 1);
	mspath = ft_getenv_arr("?cwd", *env);
	if (!strcmp(cwd, mspath))
		increment_shlvl(env);
	free(cwd);
	free(mspath);
}

char	*get_cmd_path(char *cmd, char ***env)
{
	char	*path;

	if (!cmd || !env)
		return (NULL);
	path = NULL;
	if (cmd[0] == '/' || !ft_strncmp(cmd, "./", 2))
	{
		path = ft_strdup(cmd);
		if (!ft_strcmp(cmd, "./minishell"))
			handle_mspath(path, env);
	}
	else if (!ft_strcmp(cmd, ""))
		path = ft_strdup("");
	else
		path = ft_getpath(*env, "PATH", X_OK, cmd);
	return (path);
}
