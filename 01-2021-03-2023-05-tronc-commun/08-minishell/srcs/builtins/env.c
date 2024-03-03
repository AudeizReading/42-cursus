/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   env.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:33:21 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:33:24 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	ft_env(t_cmd *cmd)
{
	char			**p_envp;
	char			**env;

	env = ft_read_env(ENV_FILE);
	p_envp = env;
	if (cmd->nb_args > 1)
	{
		errno = EINVAL;
		return (1);
	}
	else
	{
		while (*p_envp)
		{
			if (ft_strncmp(*p_envp, "?", ft_strlen("?")))
				ft_putendl_fd(*p_envp++, STDOUT_FILENO);
			else
			{
				if (p_envp)
					(p_envp)++;
			}
		}
	}
	free_char_array(env);
	return (0);
}
