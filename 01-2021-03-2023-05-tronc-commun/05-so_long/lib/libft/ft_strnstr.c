/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strnstr.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/29 11:19:33 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/31 08:58:42 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strnstr(const char *s1, const char *s2, size_t len)
{
	size_t	i;
	size_t	len_s2;

	i = 0;
	len_s2 = ft_strlen(s2);
	if (!*s2)
		return ((char *)s1);
	if (!len || !*s1)
		return ((char *)0);
	while (s1[i] && (i + len_s2) <= len)
	{
		if (ft_strncmp((s1 + i), s2, len_s2) == 0)
			return ((char *)(s1 + i));
		i++;
	}
	return ((char *)0);
}
