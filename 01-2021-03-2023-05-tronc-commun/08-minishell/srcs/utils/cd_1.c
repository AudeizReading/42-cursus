/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cd_1.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:42:52 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:42:53 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_get_nb_dir(char **paths)
{
	int			nb_dir;

	nb_dir = -1;
	if (!paths)
		return (0);
	while (paths[++nb_dir])
		;
	return (nb_dir);
}

char	*ft_init_search_path(char *arg_path)
{
	char		*search;
	char		*cwd;
	char		**env;

	search = NULL;
	cwd = NULL;
	env = ft_read_env(ENV_FILE);
	if (arg_path[0] == '/')
		search = ft_strdup("/");
	else
	{
		cwd = ft_getcwd(env);
		if (!cwd)
			return (NULL);
		search = ft_strdup(cwd);
		free(cwd);
	}
	free_char_array(env);
	if (!search)
		return (NULL);
	return (search);
}

int	ft_split_paths(char ***paths, int *nb_dir, char *arg_path)
{
	*paths = ft_split(arg_path, '/');
	if (!*paths)
	{
		errno = EFAULT;
		return (0);
	}
	*nb_dir = ft_get_nb_dir(*paths);
	return (1);
}

int	ft_check_path_flags(char *path, int *is_symlnk)
{
	struct stat	buf;

	errno = 0;
	if (lstat(path, &buf) < 0)
		errno = ENOENT;
	if (S_ISLNK(buf.st_mode))
		*is_symlnk = 1;
	if (S_ISREG(buf.st_mode))
		errno = ENOTDIR;
	else if (!S_ISDIR(buf.st_mode) && !*is_symlnk)
		errno = ENOTDIR;
	else if (!(S_IXUSR & buf.st_mode))
		errno = EACCES;
	if (errno)
		return (0);
	return (1);
}

/* 
** when I check S_IXUSR & b.st_mode, it triggers an error sometimes
** I think that is a kind of process handle error
** because we have made the choice of not execute it into the father process
** so I deactivate it
*/
int	ft_bind_paths(char **path, char *component)
{
	struct stat	b;

	if (ft_strlen(*path) > 1)
		*path = ft_concat(*path, "/");
	*path = ft_concat(*path, component);
	if (!*path)
	{
		errno = EFAULT;
		return (0);
	}
	if (lstat(*path, &b) < 0)
	{
		errno = ENOENT;
		return (0);
	}
	if (!((S_ISDIR(b.st_mode) || S_ISLNK(b.st_mode))))
	{
		errno = ENOTDIR;
		return (0);
	}
	return (1);
}
