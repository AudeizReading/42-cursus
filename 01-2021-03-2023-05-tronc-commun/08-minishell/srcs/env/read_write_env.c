/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   read_write_env.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:36:14 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/17 08:13:10 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_write_env(char *name, char **env)
{
	int			fd;

	if (!name)
		return (0);
	fd = open(name, O_WRONLY | O_CREAT | O_TRUNC, 0777);
	if (fd < 0)
		return (0);
	ft_print_char_array_fd(env, fd);
	close(fd);
	return (1);
}

char	**ft_read_env(char *name)
{
	char		**env;
	int			fd;

	if (!name)
		return (NULL);
	fd = open(name, O_RDONLY, 0777);
	if (fd < 0)
		return (NULL);
	ft_read_char_array_fd(&env, fd);
	close(fd);
	if (!env)
		return (NULL);
	return (env);
}

int	init_env_file(void)
{
	extern char	**environ;
	char		**env;
	char		*cwd;

	cwd = NULL;
	env = ft_arrstrdup(environ);
	if (!env)
		return (0);
	cwd = ft_getenv_arr("PWD", env);
	cwd = ft_concat(cwd, "/minishell");
	ft_setenv_arr("SHELL", "minishell", &env);
	ft_setenv_arr("?", "0", &env);
	ft_setenv_arr("?cwd", cwd, &env);
	ft_write_env(ENV_FILE, env);
	free_char_array(env);
	free(cwd);
	return (1);
}
