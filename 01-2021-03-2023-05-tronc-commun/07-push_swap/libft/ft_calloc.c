/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_calloc.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/23 13:52:23 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/28 20:39:03 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	*ft_calloc(size_t count, size_t size)
{
	unsigned char	*buffer;

	if (!count || !size)
	{
		count = 1;
		size = 1;
	}
	buffer = malloc(size * count);
	if (buffer == NULL)
		return (NULL);
	ft_bzero(buffer, size * count);
	return ((void *)buffer);
}
