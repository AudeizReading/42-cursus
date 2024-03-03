/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_int_putstr_fd.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/27 14:08:35 by alellouc          #+#    #+#             */
/*   Updated: 2021/06/27 14:09:54 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_int_putstr_fd(char *str, int fd)
{
	int	sum;

	sum = 0;
	while (*str)
		sum += ft_int_putchar_fd(*str++, fd);
	return (sum);
}
