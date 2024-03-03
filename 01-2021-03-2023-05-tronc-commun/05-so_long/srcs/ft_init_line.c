/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_init_line.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 18:51:12 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/14 18:51:18 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_line	*ft_init_line(char *content, int pos)
{
	t_line	*new_line;

	new_line = (t_line *)malloc(sizeof(*new_line));
	if (!new_line)
		return (NULL);
	new_line->content = ft_strdup(content);
	new_line->y = pos;
	new_line->len = ft_strlen(new_line->content);
	new_line->next = NULL;
	return (new_line);
}
