/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_map_errors.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 19:28:42 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/14 15:32:01 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_parse_map_error(int errnum)
{
	int				i;
	static t_error	tab_err[] = {
		{1024, "Problem encountered while setting map's line", e_true},
		{1025, "No map available", e_true},
		{1026, "Not a .ber map", e_true},
		{1027, "Map is not rectangular", e_true},
		{1028, "Map is not entirely closed by walls", e_true},
		{1029, "Map contains invalid characters", e_true},
		{1030, "Map does not have any exit", e_true},
		{1031, "Map does not have any collectible", e_true},
		{1032, "Map does not have any starting position", e_true},
		{1033, "Map has got more than one starting position", e_true},
		{1034, "Map has got more than one exit", e_true},
		{-1, NULL, e_false}
	};

	i = -1;
	while (tab_err[i++].num != -1)
	{
		if (tab_err[i].num == errnum)
			ft_puterr(tab_err[i].message, tab_err[i].must_exit);
	}
	if (errnum < 1024)
		ft_puterr(strerror(errnum), e_true);
}
