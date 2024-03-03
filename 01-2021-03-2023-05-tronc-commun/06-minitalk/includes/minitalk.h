/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   minitalk.h                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/19 20:12:58 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/19 20:13:01 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef MINITALK_H
# define MINITALK_H
# include <unistd.h>
# include <signal.h>
# include <sys/types.h>
# include <stdlib.h>

/* utils.c */
int		ft_atoi(const char *nptr);
size_t	ft_strlen(char *str);
void	ft_putchar(char c);
void	ft_putstr(char *s);
void	ft_putnbr(int n);

/* server.c */
void	ft_receive_sig_char(int signal);
void	ft_show_pid(void);
void	ft_listen_clt_sig(void);

/* client.c */
void	ft_send_sig_str(unsigned char *str, int pid);
#endif
