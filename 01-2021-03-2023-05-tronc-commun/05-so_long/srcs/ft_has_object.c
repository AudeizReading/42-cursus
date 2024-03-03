/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_has_object.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/19 11:34:49 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/19 11:35:01 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_point	*ft_has_object(t_line *line, char c, int i)
{
	char	*p_content;
	t_point	*point;
	t_point	*list;
	int		x;

	list = NULL;
	while (line)
	{
		p_content = line->content;
		x = 0;
		while (*p_content)
		{
			if (*p_content == c)
			{
				point = ft_init_point(x, line->y, i++);
				if (!point)
					return (NULL);
				ft_point_addback(&list, point);
			}
			p_content++;
			x++;
		}
		line = line->next;
	}
	return (list);
}
