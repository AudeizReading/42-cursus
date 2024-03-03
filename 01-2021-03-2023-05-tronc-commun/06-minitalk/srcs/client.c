/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   client.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/19 20:13:25 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/19 20:13:28 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minitalk.h"

void	ft_send_sig_str(unsigned char *str, int pid)
{
	unsigned long	i;

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
			usleep(200);
		}
		str++;
	}
}

int	main(int argc, char **argv)
{
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
