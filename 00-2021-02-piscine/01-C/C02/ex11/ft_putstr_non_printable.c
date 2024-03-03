/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putstr_non_printable.c                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/15 15:27:33 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/21 12:49:06 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

void	ft_putstr_non_printable(char *str)
{
	char	*hexa;

	hexa = "0123456789abcdef";
	while (*str)
	{
		if (*str >= 32 && *str != 127)
			ft_putchar(*str);
		else
		{
			ft_putchar('\\');
			ft_putchar(hexa[*str / 16]);
			ft_putchar(hexa[*str % 16]);
		}
		str++;
	}
}
