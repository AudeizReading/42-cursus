/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cd_2.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:43:01 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:43:07 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_is_dirname(char *dirname, char *cmp)
{
	if (!ft_strncmp(dirname, cmp, ft_strlen(dirname)))
		return (1);
	return (0);
}

void	ft_handle_dot_dot(char **transl8_path, char *dirname)
{
	char			**paths;
	int				nb_dir;
	int				i;

	i = -1;
	paths = NULL;
	nb_dir = 0;
	if (!ft_strncmp(dirname, "..", ft_strlen("..")))
	{
		ft_split_paths(&paths, &nb_dir, *transl8_path);
		free(*transl8_path);
		*transl8_path = NULL;
		*transl8_path = ft_concat(*transl8_path, "/");
		while (++i < nb_dir - 1)
			ft_bind_paths(transl8_path, paths[i]);
		free_char_array(paths);
	}
}

void	ft_hdle_linkname(char **tl8_path, char *dirname, char *path)
{
	if (!ft_is_dirname(dirname, ".") && !ft_is_dirname(dirname, ".."))
		ft_bind_paths(tl8_path, path);
	ft_handle_dot_dot(tl8_path, dirname);
}

int	ft_bind_dirs(char *path, char **search, char **link)
{
	struct dirent	*dirp;
	DIR				*dp;

	dp = opendir(*search);
	if (!dp)
		return (0);
	while (1)
	{
		dirp = readdir(dp);
		if (!dirp)
		{
			errno = ENOENT;
			return (0);
		}
		if (!ft_strncmp(dirp->d_name, path, ft_strlen(path)))
		{
			if (!ft_bind_paths(search, path))
				return (0);
			ft_hdle_linkname(link, dirp->d_name, path);
			break ;
		}
	}
	if (closedir(dp) < 0)
		return (0);
	return (1);
}

int	ft_parse_paths(char **search, char **link, char *arg_path)
{
	char		**paths;
	int			nb_dir;
	int			i;
	int			is_symlnk;

	i = 0;
	ft_split_paths(&paths, &nb_dir, arg_path);
	*search = ft_init_search_path(arg_path);
	*link = ft_strdup(*search);
	while (i < nb_dir)
	{
		if (!ft_check_path_flags(*search, &is_symlnk))
			return (-1);
		else if (!ft_bind_dirs(paths[i], search, link))
			return (-1);
		i++;
	}
	free_char_array(paths);
	return (is_symlnk);
}
