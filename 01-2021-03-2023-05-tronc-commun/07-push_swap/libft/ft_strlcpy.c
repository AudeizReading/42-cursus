/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strlcpy.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/29 08:54:08 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/11 16:31:15 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

size_t	ft_strlcpy(char *dst, const char *src, size_t size)
{
	size_t	len_src;

	if (!src || !dst)
		return (0);
	len_src = ft_strlen(src);
	if (!size)
		return (len_src);
	while (--size && *src)
		*dst++ = *src++;
	*dst = '\0';
	return (len_src);
}
