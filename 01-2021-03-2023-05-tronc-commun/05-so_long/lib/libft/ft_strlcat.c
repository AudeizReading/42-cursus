/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strlcat.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/31 10:45:05 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/01 16:51:36 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

size_t	ft_strlcat(char *dst, const char *src, size_t size)
{
	size_t	len_dst;
	size_t	len_src;
	size_t	result;

	len_dst = ft_strlen(dst);
	len_src = ft_strlen(src);
	result = len_dst + len_src;
	if (len_dst >= size)
		return (size + len_src);
	dst += len_dst;
	size -= len_dst;
	if (len_src >= size)
		len_src = size - 1;
	ft_memcpy(dst, src, len_src);
	dst[len_src] = '\0';
	return (result);
}
