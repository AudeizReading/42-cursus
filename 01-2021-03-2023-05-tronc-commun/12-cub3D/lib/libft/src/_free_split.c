/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _free_split.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:09 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:10 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>

void	*_free_split(char **str)
{
	char	**tmp;

	tmp = str;
	while (*tmp)
		free(*tmp++);
	free(str);
	return (NULL);
}