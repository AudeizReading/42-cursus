/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_substr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/04/03 23:07:31 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/12 17:51:50 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_substr(char const *s, unsigned int start, size_t len)
{
	char	*dst;
	size_t	len_s;

	if (!s)
		return (NULL);
	len_s = ft_strlen(s);
	if (len > len_s || (len + start > len_s && start < len_s))
		len = len_s - start;
	if (start >= len_s)
		len = 0;
	dst = (char *)ft_calloc((len + 1), sizeof(*dst));
	if (!dst)
		return (NULL);
	ft_memcpy(dst, s + start, len);
	return (dst);
}
