/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_check_valid_characters.c                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/19 11:08:37 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 11:08:55 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_bool	ft_check_valid_characters(t_line *map)
{
	char	*p_content;

	while (map)
	{
		if (!ft_strlen(map->content))
			return (e_false);
		p_content = map->content;
		while (*p_content)
		{
			if (!ft_strchr("01CEP", *p_content))
				return (e_false);
			p_content++;
		}
		map = map->next;
	}
	return (e_true);
}
