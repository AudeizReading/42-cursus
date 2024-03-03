/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_basic_error.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/12 13:21:05 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/12 13:21:25 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_puterror(void)
{
	ft_putendl_fd("Error", 2);
}

void	ft_puterr(char *err, t_bool must_exit)
{
	ft_puterror();
	ft_putendl_fd(err, 2);
	if (must_exit)
		exit(EXIT_FAILURE);
}
