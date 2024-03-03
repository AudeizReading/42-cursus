/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strrchr.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/28 14:29:27 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/28 16:52:07 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strrchr(const char *s, int c)
{
	int		len;
	char	*p_s;
	char	c_c;

	len = ft_strlen(s);
	p_s = (char *)s;
	c_c = (char)c;
	while (len >= 0)
		if (p_s[len--] == c_c)
			return ((p_s + (++len)));
	return ((char *)0);
}
