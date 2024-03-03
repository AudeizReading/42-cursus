/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   exit.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:33:37 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:33:40 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

t_bool	ft_is_valid_num(char *s)
{
	int	sign;

	sign = 0;
	if (!s)
		return (e_false);
	while (*s == 43 || *s == 45)
	{
		sign++;
		s++;
	}
	while (ft_isdigit(*s))
		s++;
	if (sign > 1 || *s)
		return (e_false);
	return (e_true);
}

int	ft_exit(t_cmd *cmd)
{
	int	fd;
	int	status;

	status = 0;
	if (!cmd->args[0])
		exit(126);
	if (cmd->args[1])
	{
		if (ft_is_valid_num(cmd->args[1]))
			status = (unsigned char)ft_atoi(cmd->args[1]);
		else
			status = 255;
	}
	if (cmd->pos == 1 && cmd->nb_cmd == 1)
	{
		fd = open("/dev/stdin", O_WRONLY, 0777);
		ft_putendl_fd("exit", fd);
		close(fd);
	}
	return (status);
}
