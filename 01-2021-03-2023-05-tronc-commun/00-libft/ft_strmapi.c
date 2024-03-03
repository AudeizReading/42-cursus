/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strmapi.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/04/03 22:47:50 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/09 22:46:47 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strmapi(char const *s, char (*f)(unsigned int, char))
{
	size_t	len_s;
	char	*dst;

	if (s == NULL)
		return (NULL);
	len_s = ft_strlen(s);
	dst = (char *)ft_calloc((len_s + 1), sizeof(*dst));
	if (dst == NULL)
		return (NULL);
	while (len_s--)
		dst[len_s] = (*f)(len_s, s[len_s]);
	return (dst);
}
