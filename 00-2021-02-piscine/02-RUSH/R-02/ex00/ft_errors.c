/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_errors.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 16:34:26 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 14:27:29 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_strings.h"
#include "ft_errors.h"

void	ft_error_arg(int error)
{
	if (error == 2)
	{
		ft_usage();
		ft_putstr("Not enough arguments\n");
	}
	if (error == 3)
	{
		ft_usage();
		ft_putstr("Too many arguments\n");
	}
	if (error == -1)
	{
		ft_usage();
		ft_putstr("Can not open the file you have submitted\n");
	}
	if (error == -2)
	{
		ft_usage();
		ft_putstr("Your input is not compliant to the standard awaited\n");
	}
}

void	ft_error(void)
{
	ft_putstr("Error\n");
}

void	ft_usage(void)
{
	ft_error();
	ft_putstr("usage:\n\t./rush-02 [source_file] value\n");
}
