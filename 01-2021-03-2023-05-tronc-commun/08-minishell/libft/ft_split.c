/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/04/08 16:27:54 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/24 00:09:00 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static char	*ft_slice(char const *s, char c, int *j)
{
	int		i;
	char	*dst;

	i = 0;
	while (s[i] && s[i] != c)
		i++;
	dst = ft_substr(s, 0, i);
	if (!dst)
		return (NULL);
	while (s[i] && s[i] == c)
		i++;
	*j += i;
	return (dst);
}

static int	ft_isfree(char **tab, int index)
{
	if (!tab[index])
	{
		while (--index >= 0)
			free(tab[index]);
		free(tab);
		return (1);
	}
	return (0);
}

char	**ft_split(char const *s, char c)
{
	char	**dst;
	int		nb;
	int		i;
	int		j;

	if (!s)
		return (0);
	i = -1;
	j = 0;
	nb = ft_cntwds((char *)s, (char)c);
	dst = (char **)ft_calloc(sizeof(char *), nb + 1);
	if (!dst)
		return (NULL);
	while (s[j] && s[j] == c)
		j++;
	while (++i < nb)
	{
		dst[i] = ft_slice((s + j), c, &j);
		if (ft_isfree(dst, i))
			return (NULL);
	}
	return (dst);
}
