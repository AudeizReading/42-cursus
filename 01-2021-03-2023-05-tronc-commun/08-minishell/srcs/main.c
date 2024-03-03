/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:47:36 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 20:26:24 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

int	main(int argc, char **argv)
{
	if (argc == 1)
	{
		init_env_file();
		ft_init_terminal(0);
		ft_ignore_signal(SIGQUIT);
		ft_ignore_signal(SIGTSTP);
		ft_ignore_signal(SIGTTIN);
		ft_ignore_signal(SIGTTOU);
		ft_ignore_signal(SIGTERM);
		ft_ignore_signal(SIGHUP);
		ft_wait_4_sig(SIGINT, ft_receive_sig);
		prompt();
	}
	else
	{
		if (handle_argv_error(argv[1]))
			return (get_exitstatus());
	}
	return (0);
}
