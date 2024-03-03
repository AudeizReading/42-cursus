/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   avoid_kill_ms.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/16 18:41:59 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/19 09:38:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

char	*char_arr_to_char(char **arr, char *bound)
{
	char	*dst;
	int		i;

	dst = ft_strdup(arr[0]);
	if (!dst)
		return (NULL);
	i = 0;
	while (arr[++i])
	{
		dst = ft_concat(dst, bound);
		dst = ft_concat(dst, arr[i]);
	}
	return (dst);
}

int	is_minishell_path(char **env)
{
	char	*cwd;
	char	*mspath;

	cwd = ft_getenv_arr("PWD", env);
	cwd = ft_concat(cwd, "/minishell");
	mspath = ft_getenv_arr("?cwd", env);
	if (!ft_strcmp(mspath, cwd))
	{
		if (cwd)
			free(cwd);
		if (mspath)
			free(mspath);
		return (1);
	}
	if (cwd)
		free(cwd);
	if (mspath)
		free(mspath);
	return (0);
}

int	is_destroy_ms_cmd(char *cmd)
{
	size_t	lenms;
	size_t	lencmd;

	if (!cmd)
		return (0);
	lenms = ft_strlen("minishell");
	lencmd = ft_strlen(cmd);
	if ((lencmd - lenms) > 0)
	{
		if ((!ft_strncmp(cmd + (lencmd - lenms), "minishell", lenms)
				&& (!ft_strncmp(cmd, "rm", 2) || !ft_strncmp(cmd, "chmod", 5)))
			|| !ft_strcmp(cmd, "make fclean"))
			return (1);
	}
	return (0);
}

int	avoid_kill_minishell(char **args, char **env)
{
	char	*tmp;

	if (!args)
		return (0);
	if (!is_minishell_path(env))
		return (0);
	tmp = char_arr_to_char(args, " ");
	if (!tmp)
		return (0);
	if (is_destroy_ms_cmd(tmp))
	{
		errno = EPERM;
		perror("minishell: trying to kill me");
		free(tmp);
		return (1);
	}
	free(tmp);
	return (0);
}
