/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strtrim.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/04/04 17:21:01 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/12 13:39:26 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strtrim(char const *s1, char const *set)
{
	char	*dst;
	size_t	start;
	size_t	len_dst;

	if (!s1)
		return (NULL);
	if (!set)
		return ((char *)ft_strdup(s1));
	start = 0;
	len_dst = ft_strlen(s1);
	while (ft_ischarset(s1[start], set))
		start++;
	while (ft_ischarset(s1[--len_dst], set))
		;
	len_dst -= start;
	dst = ft_substr(s1, start, ++len_dst);
	if (!dst)
		return (NULL);
	return (dst);
}
