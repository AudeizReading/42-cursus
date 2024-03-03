/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/10/13 10:40:55 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 15:21:04 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/push_swap.h"

int	main(int argc, char **argv)
{
	int	push_swap;

	push_swap = -1;
	if (argc > 1)
	{
		argv++;
		push_swap = ft_push_swap(argc, argv);
		if (push_swap == -1)
			return (-1);
		else
			return (0);
	}
	return (0);
}
