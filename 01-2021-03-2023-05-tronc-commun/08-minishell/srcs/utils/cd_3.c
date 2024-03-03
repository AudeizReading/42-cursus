/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cd_3.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:43:21 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:43:24 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*ft_get_new_cwd(char *arg_path)
{
	char	*path_search;
	char	*path_link;
	char	*abs_path;
	int		is_symlnk;

	is_symlnk = ft_parse_paths(&path_search, &path_link, arg_path);
	if (is_symlnk == -1)
	{
		errno = ENOENT;
		return (NULL);
	}
	abs_path = ft_get_abs_path(&is_symlnk, path_search, path_link);
	free(path_search);
	free(path_link);
	if (!abs_path)
		return (NULL);
	return (abs_path);
}

int	ft_set_new_cwd(char ***env, char *old_pwd, char *cwd)
{
	if (!access(cwd, X_OK))
	{
		if (old_pwd)
			ft_setenv_arr("OLDPWD", old_pwd, env);
		if (cwd)
			ft_setenv_arr("PWD", cwd, env);
	}
	else
	{
		errno = ENOENT;
		return (0);
	}
	if (old_pwd)
		free(old_pwd);
	if (cwd)
		free(cwd);
	return (1);
}

char	*ft_get_abs_path(int *is_symlnk, char *search, char *link)
{
	char	*abs_path;

	if (!ft_check_path_flags(search, is_symlnk))
		return (NULL);
	if (!ft_strncmp(search, "/", ft_strlen(search)))
		abs_path = ft_strdup("/");
	else if (is_symlnk)
		abs_path = ft_strdup(link);
	else
		abs_path = ft_strdup(link);
	if (!abs_path)
		return (NULL);
	return (abs_path);
}
