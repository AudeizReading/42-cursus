/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parse_builtins.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:34:27 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/17 07:43:41 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	get_builtin_error(t_cmd *cmd, t_builtin *arr, int status)
{
	if (ft_strcmp(cmd->args[0], "exit") && cmd->nb_cmd == cmd->pos)
	{
		ft_print_error(cmd);
		ft_print_usage(cmd, arr);
	}
	if (!ft_strcmp(cmd->args[0], "exit") && cmd->nb_cmd == cmd->pos
		&& status == 255)
	{
		errno = EINVAL;
		ft_print_error(cmd);
	}
}

void	ft_search_builtin(t_cmd *cmd, t_builtin *arr)
{
	int		i;
	int		status;

	i = 0;
	status = 0;
	while (arr[i].name != NULL)
	{
		if (!ft_strcmp(arr[i].name, cmd->args[0]))
		{
			status = arr[i].builtin(cmd);
			if (status)
				get_builtin_error(cmd, &arr[i], status);
			exit(status);
		}
		i++;
	}
}

int	ft_parse_builtin(t_cmd *cmd)
{
	static t_builtin	arr[] = {
	{"cd", "cd [directory | -]", &ft_cd},
	{"echo", "echo [-n] [arg...]", &ft_echo},
	{"env", "env", &ft_env},
	{"exit", "exit [num]", &ft_exit},
	{"pwd", "pwd", &ft_pwd},
	{"export", "export [name[=word]] ...", &ft_export},
	{"unset", "unset [name1 [name2 ...]]", &ft_unset},
	{NULL, NULL, NULL}
	};

	ft_search_builtin(cmd, arr);
	return (0);
}
