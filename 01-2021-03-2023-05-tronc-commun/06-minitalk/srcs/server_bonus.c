/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server_bonus.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/19 20:12:32 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/20 09:04:47 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minitalk_bonus.h"

void	ft_receive_sig_char(int signal, siginfo_t *info, void *context)
{
	static int				i = 0;
	static unsigned char	c = 0;

	(void)context;
	c |= (signal - SIGUSR1) << i++;
	if (i > 7)
	{
		ft_putchar(c);
		c = 0;
		i = 0;
	}
	kill(info->si_pid, SIGUSR1);
}

void	ft_show_pid(void)
{
	pid_t					pid;

	pid = getpid();
	ft_putstr("server pid: ");
	ft_putnbr(pid);
	ft_putchar('\n');
}

void	ft_listen_clt_sig(void)
{
	struct sigaction		sa;

	sa.sa_sigaction = ft_receive_sig_char;
	sa.sa_flags = SA_SIGINFO | SA_NODEFER;
	sigemptyset(&(sa.sa_mask));
	sigaddset(&(sa.sa_mask), SIGUSR1);
	sigaddset(&(sa.sa_mask), SIGUSR2);
	if (sigaction(SIGUSR1, &sa, NULL) || sigaction(SIGUSR2, &sa, NULL))
	{
		ft_putstr("Error with SIGUSR1 or SIGUSR2\n");
		exit(EXIT_FAILURE);
	}
	while (1)
		pause();
}

int	main(void)
{
	ft_show_pid();
	ft_listen_clt_sig();
	return (0);
}
