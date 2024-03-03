/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strndup.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/12/11 13:39:08 by alellouc          #+#    #+#             */
/*   Updated: 2021/12/11 13:39:22 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

char	*ft_strndup(char *s1, int n)
{
	char	*dest;

	dest = (char *)ft_calloc((n + 1), sizeof(char));
	if (!dest)
	{
		dest = NULL;
		return (dest);
	}
	ft_strncpy(dest, s1, n);
	return (dest);
}
