/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   errors.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:46:25 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:46:26 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	handle_argv_error(char *argv)
{
	char	*error;

	errno = EINVAL;
	error = ft_strjoin(argv, ": feature not supported");
	if (!error)
		return (1);
	perror(error);
	free(error);
	return (1);
}

/* use of getenv because I'm searching the prog name at the _ place
** aka minishell
*/
void	ft_print_error(t_cmd *cmd)
{
	char	**prog;
	char	*src_error;
	int		i;

	if (!cmd->args[0])
		return ;
	i = -1;
	prog = ft_split(getenv("_"), '/');
	if (!prog)
		return ;
	while (prog[++i])
		;
	src_error = ft_strjoin(prog[i - 1], ": ");
	src_error = ft_concat(src_error, cmd->args[0]);
	src_error = ft_concat(src_error, ": ");
	src_error = ft_concat(src_error, cmd->args[1]);
	if (!src_error)
	{
		free_char_array(prog);
		return ;
	}
	perror(src_error);
	free(src_error);
	free_char_array(prog);
}

void	ft_print_usage(t_cmd *cmd, t_builtin *array)
{
	char	*usage;

	if (!cmd->args[0] || !array->name[0])
		return ;
	usage = ft_strjoin(cmd->args[0], ": usage: ");
	usage = ft_concat(usage, array->usage);
	if (!usage)
		return ;
	ft_putendl_fd(usage, 2);
	free(usage);
}

void	print_cmd_not_found_err(char *cmd, int status)
{
	char	*err;

	if (status == 0)
		return ;
	err = ft_strjoin("minishell: ", cmd);
	if (status == 127)
		err = ft_concat(err, ": command not found");
	else if (status == 126)
		err = ft_concat(err, ": argument found but not executable");
	else if (status == 1)
		err = ft_concat(err, ": No such file or directory");
	ft_putendl_fd(err, STDERR_FILENO);
	free(err);
}
