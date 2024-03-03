/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   client_bonus.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/19 20:14:00 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/19 20:35:52 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minitalk_bonus.h"

void	ft_send_sig_str(unsigned char *str, int pid)
{
	unsigned long		i;

	while (*str)
	{
		i = 0;
		while (i < 8)
		{
			if (*str >> i & 1)
				kill(pid, SIGUSR2);
			else
				kill(pid, SIGUSR1);
			i++;
			usleep(700);
		}
		str++;
	}
}

void	ft_receive_ack(int signal, siginfo_t *info, void *ctx)
{
	static int			i = 0;

	(void)ctx;
	i++;
	ft_putstr("\tBit Acknowledgment\n");
	if (signal == SIGUSR1 && i == 8)
	{
		ft_putstr("\033[1;45;38mBytes Acknowledgment\n");
		ft_putstr("Received from server who has ");
		ft_putnbr(info->si_pid);
		ft_putstr(" for pid\033[0m\n");
		i = 0;
	}
	usleep(100);
}

void	ft_wait_server_ack(void)
{
	struct sigaction	sa;

	sa.sa_sigaction = ft_receive_ack;
	sa.sa_flags = SA_SIGINFO | SA_NODEFER;
	sigemptyset(&(sa.sa_mask));
	sigaddset(&(sa.sa_mask), SIGUSR1);
	if (sigaction(SIGUSR1, &sa, NULL))
	{
		ft_putstr("Error with SIGUSR1 or SIGUSR2\n");
		exit(EXIT_FAILURE);
	}
}

int	main(int argc, char **argv)
{
	ft_wait_server_ack();
	if (argc == 3)
	{
		ft_send_sig_str((unsigned char *)argv[2], ft_atoi(argv[1]));
		ft_send_sig_str((unsigned char *)"\0", ft_atoi(argv[1]));
	}
	else
	{
		ft_putstr("\tUsage: ./client [server PID] [string]\n");
		exit(EXIT_FAILURE);
	}
	return (0);
}
