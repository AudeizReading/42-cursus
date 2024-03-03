/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/24 10:08:14 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/02 20:57:22 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>
#include <stdio.h>
#include <limits.h>
#include <stdlib.h>
#include "ex02/ft_abs.h"

void	ft_putstr(char *str);

void	ft_putstr(char *str)
{
	while (*str)
		write(1, str++, 1);
}

int main(void)
{
	printf("ft_abs.h %d\n", ABS(-42));

	return (0);
}
