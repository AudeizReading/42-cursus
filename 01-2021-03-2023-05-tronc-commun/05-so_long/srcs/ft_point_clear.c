/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_point_clear.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/15 08:58:52 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/15 08:59:06 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_point_clear(t_point **point, void (*del)(void *))
{
	t_point	*tmp;

	while (*point)
	{
		tmp = (*point)->next;
		(*del)(*point);
		(*point) = tmp;
	}
}
