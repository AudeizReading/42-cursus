/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   echo.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:32:41 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/19 09:36:51 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	echo_arg(t_cmd *cmd, void (*print)(char *, int), int i, int j)
{
	char	*args;

	args = NULL;
	while (++j <= i)
	{
		args = ft_concat(args, cmd->args[j]);
		if (j != i)
			args = ft_concat(args, " ");
		if (!args)
		{
			errno = ENOMEM;
			return (1);
		}
	}
	(*print)(args, STDOUT_FILENO);
	free(args);
	return (0);
}

int	ft_echo(t_cmd *cmd)
{
	int		ret;
	int		i;

	ret = 0;
	i = 1;
	if (cmd->nb_args > 1 && (cmd->args[1][0] == '-' && cmd->args[1][1] == 'n'))
	{
		while (cmd->args[i][0] == '-')
			i++;
		ret = echo_arg(cmd, ft_putstr_fd, cmd->nb_args, i - 1);
	}
	else if (cmd->nb_args > 1)
		ret = echo_arg(cmd, ft_putendl_fd, cmd->nb_args, 0);
	else
		ft_putendl_fd("", STDOUT_FILENO);
	if (ret)
		return (1);
	return (0);
}
