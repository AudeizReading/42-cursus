/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strjoin.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/03/02 09:53:01 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/04 14:14:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <stdio.h>

int			ft_strlen(char *str)
{
	int			len;

	len = 0;
	while (str[len])
		len++;
	return (len);
}

int			ft_size_2_join(char **strs, char *sep, int *nb_strs)
{
	int			len;

	len = 0;
	*nb_strs = 0;
	while (*strs)
	{
		len += ft_strlen(*strs);
		strs++;
		(*nb_strs)++;
	}
	len += ft_strlen(sep) * (*nb_strs - 1);
	return (len);
}

void		ft_join(char *src1, char **src2, int nb_strs, char *tab)
{
	int			i;
	int			j;
	int			nb_chars;

	/**tab = '\0';*/
	i = 0;
	nb_chars = 0;
	while (i < nb_strs)
	{
		j = 0;
		while (src2[i][j])
			*(tab + nb_chars++) = src2[i][j++];
		j = 0;
		while (i < (nb_strs - 1) && *(src1 + j))
			*(tab + nb_chars++) = *(src1 + j++);
		*(tab + nb_chars) = '\0';
		i++;
	}
}

char		*ft_strjoin(int size, char **strs, char *sep)
{
	char		*tab;
	int			i;
	int			j;
	int			nb_strs;

	i = 0;
	j = ft_size_2_join(strs, sep, &nb_strs);
	if (size == 0 || j == 0)
	{
		tab = (char *)malloc(sizeof(char) * 0);
		*tab = '\0';
	}
	else if ((tab = (char *)malloc(sizeof(char) * j + 1)) == 0)
		return ((char *)0);
	ft_join(sep, strs, nb_strs, tab);
	return (tab);
}
/*Make a segfault like this, so to be continued */
