/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   signals.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:48:44 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/18 15:47:51 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	handling_sigquit(int signal)
{
	char	**env;
	char	*nb_cmd;

	(void)signal;
	env = ft_read_env(ENV_FILE);
	if (!env)
		return ;
	nb_cmd = ft_getenv_arr("?nb_cmd", env);
	if (!ft_strcmp(nb_cmd, "1"))
		ft_putendl_fd("Quit: 3", 2);
	free(nb_cmd);
	free_char_array(env);
}

void	handling_sigint(int signal, siginfo_t *info, void *ctx)
{
	(void)info;
	(void)ctx;
	(void)signal;
	ft_putendl("");
}

void	toggle_signals(int toggle)
{
	if (toggle)
	{
		ft_wait_4_sig(SIGINT, handling_sigint);
		ft_wait_4_sig(SIGQUIT, ft_receive_sig);
	}
	else
	{
		ft_wait_4_sig(SIGINT, ft_receive_sig);
		ft_ignore_signal(SIGQUIT);
	}
	ft_init_terminal(toggle);
}

/*
** Function: void rl_redisplay (void)
** Change what’s displayed on the screen to reflect
** the current contents of rl_line_buffer.
**
** Function: int rl_on_new_line (void)
** Tell the update functions that we have moved onto a new (empty) line,
** usually after ouputting a newline.
**
** Function: void rl_replace_line (const char *text, int clear_undo)
** Replace the contents of rl_line_buffer with text.
** The point and mark are preserved, if possible.
** If clear_undo is non-zero, the undo list associated with the current line
** is cleared.
*/

void	ft_receive_sig(int signal, siginfo_t *info, void *ctx)
{
	(void)ctx;
	(void)info;
	if (signal == SIGINT)
	{
		set_exitstatus(1);
		ft_putendl("");
		rl_on_new_line();
		rl_replace_line("", 0);
		rl_redisplay();
	}
	else if (signal == SIGQUIT)
		handling_sigquit(signal);
}

void	ft_receive_sig_heredoc(int signal, siginfo_t *info, void *ctx)
{
	(void)info;
	(void)ctx;
	if (signal == SIGINT)
	{
		set_env_var("?heredoc", "sigint");
		ft_putendl("");
		rl_on_new_line();
		rl_replace_line("", 0);
		rl_done = 1;
	}
}
