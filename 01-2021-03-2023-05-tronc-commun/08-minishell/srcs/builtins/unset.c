/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   unset.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:35:03 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:35:04 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	ft_sub_unset(char ***env, char *arg)
{
	char	*name;

	name = ft_strjoin(arg, "=");
	if (ft_is_name_env_arr(name, *env))
		ft_unsetenv(name, env);
	free(name);
}

int	ft_unset(t_cmd *cmd)
{
	int		i;
	char	**env;

	i = 1;
	env = ft_read_env(ENV_FILE);
	while (cmd->args[i])
	{
		if (!ft_strchr(cmd->args[i], '='))
			ft_sub_unset(&env, cmd->args[i]);
		else
		{
			errno = EINVAL;
			return (126);
		}
		i++;
	}
	if (cmd->pos == 1 && cmd->nb_cmd == 1)
		ft_write_env(ENV_FILE, env);
	free_char_array(env);
	return (0);
}
