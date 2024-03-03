/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   prompt.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:47:53 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/16 12:19:59 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

/*
**	get_input:
**
**		if (!input)					=>		^D
**		if (!ft_strlen(input))		=>		\n
**		return (-1)					=>		parsing error
**		return (-2)					=>		builtin exit
*/
int	get_input(void)
{
	char	*input;
	t_cmd	*cmd;
	int		ret;

	ret = 1;
	cmd = NULL;
	input = readline("\e[30;47;3m minishell > \e[0m ");
	if (!input)
		return (0);
	if (!ft_strlen(input))
		return (1);
	add_history(input);
	ret = parse_input(input, &cmd);
	if (ret == -1 || ret == 1)
	{
		clear_cmd(&cmd);
		free(input);
		return (ret);
	}
	free(input);
	if (!executor(cmd))
		ret = -2;
	ft_chdir();
	clear_cmd(&cmd);
	return (ret);
}

void	clean_minishell(int status)
{
	char	*shlvl;
	int		lvl;

	shlvl = get_env_var("SHLVL");
	lvl = ft_atoi(shlvl);
	free(shlvl);
	if (lvl == 1)
		unlink(ENV_FILE);
	if (lvl > 1)
	{
		lvl--;
		shlvl = ft_itoa(lvl);
		set_env_var("SHLVL", shlvl);
		free(shlvl);
	}
	rl_clear_history();
	exit(status);
}

int	prompt(void)
{
	int	ret;

	ret = 0;
	while (1)
	{
		ret = get_input();
		if (!ret)
		{
			ft_putendl_fd("\e[A\e[14Cexit", STDOUT_FILENO);
			clean_minishell(0);
		}
		else if (ret == -1)
			ft_putendl_fd("minishell: syntax error", STDERR_FILENO);
		else if (ret == -2)
			clean_minishell(get_exitstatus());
	}
	return (1);
}
