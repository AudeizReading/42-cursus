/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   surround_map.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:23:38 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:23:41 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"
#include "types.h"

#include <stdlib.h>

static size_t	count_strs(char **strs)
{
	size_t	count;

	count = 0;
	while (strs && strs[count])
		count++;
	return (count);
}

static size_t	get_maxlen(char **strs)
{
	int		n;
	size_t	len;
	size_t	maxlen;

	n = -1;
	maxlen = _strlen(strs[0]);
	while (strs[++n])
	{
		len = _strlen(strs[n]);
		if (len > maxlen)
			maxlen = len;
	}
	return (maxlen);
}

static void	add_space_tiles(char **strs, size_t maxlen)
{
	int		n;
	size_t	len;
	char	*new;

	n = -1;
	while (strs[++n])
	{
		new = _strjoin(" ", strs[n]);
		free(strs[n]);
		strs[n] = new;
	}
	n = -1;
	while (strs[++n])
	{
		new = _calloc(1 + maxlen, sizeof(char));
		len = _strlen(strs[n]);
		_memset(new, ' ', maxlen);
		_memcpy(new, strs[n], len);
		free(strs[n]);
		strs[n] = new;
	}
}

char	**surround_map(char const *s, t_data *data)
{
	char	**lines;
	size_t	maxlen;

	lines = _strsplit(s, '\n');
	maxlen = 2 + get_maxlen(lines);
	add_space_tiles(lines, maxlen);
	data->cols = maxlen;
	data->rows = count_strs(lines);
	return (lines);
}
