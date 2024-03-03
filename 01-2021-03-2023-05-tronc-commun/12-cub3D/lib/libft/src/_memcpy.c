/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _memcpy.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:34 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:43 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

void	*_memcpy(void *dst, const void *src, size_t len)
{
	char		*pt_dst;
	char const	*pt_src = (char *) src;

	pt_dst = (char *)dst;
	while (len--)
		*pt_dst++ = *pt_src++;
	return (dst);
}
