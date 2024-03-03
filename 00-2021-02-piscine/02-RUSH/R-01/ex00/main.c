/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/20 10:24:38 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/20 19:54:31 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "functions.h"
#include <stdio.h>

int		main(int argc, char **argv)
{
	if (argc > 1)
	{
		ft_putstr("We should have our program if we have found a solution.\n");
		ft_putstr("We should have handled the pointer argv[1] ");
		ft_putstr("because it is full, as the condition detects it :\n");
		ft_putstr(argv[1]);
		ft_putstr("\n");
	}
	else
	{
		displays_error();
		ft_putstr("\n");
	}
	return (0);
}
