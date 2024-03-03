/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   signals.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:45:01 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:45:03 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

void	ft_wait_4_sig(int sig, void (*handler)(int, siginfo_t *, void *))
{
	struct sigaction	sa;

	sa.sa_sigaction = handler;
	sa.sa_flags = SA_SIGINFO;
	sigemptyset(&(sa.sa_mask));
	sigaddset(&(sa.sa_mask), sig);
	if (sigaction(sig, &sa, NULL))
	{
		perror(strerror(sig));
		exit(EXIT_FAILURE);
	}
}

void	ft_ignore_signal(int signal)
{
	struct sigaction	sa;

	sa.sa_handler = SIG_IGN;
	sa.sa_flags = 0;
	sigemptyset(&(sa.sa_mask));
	sigaddset(&(sa.sa_mask), signal);
	if (sigaction(signal, &sa, NULL))
	{
		perror(strerror(signal));
		exit(EXIT_FAILURE);
	}
}
