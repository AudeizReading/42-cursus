/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strdup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/28 22:17:31 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/01 00:12:33 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <sys/errno.h>

int		ft_strlen(char *str)
{
	int		len;

	len = 0;
	while (*str++)
		len++;
	return (len);
}

char	*ft_strdup(char *src)
{
	int		i;
	int		size;
	char	*dest;

	i = 0;
	size = ft_strlen(src);
	if ((dest = (char *)malloc(sizeof(char) * (size + 1))) == 0)
	{
		errno = ENOMEM;
		return ((char *)0);
	}
	while ((*(dest + i) = *(src + i)) != '\0')
		i++;
	*(dest + i) = '\0';
	return (dest);
}
