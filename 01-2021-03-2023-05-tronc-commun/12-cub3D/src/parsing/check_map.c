/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check_map.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:23:31 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:23:32 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"
#include "types.h"

#include <stdlib.h>

char	**surround_map(char const *s, t_data *data);

static int	blank_line(char const *buf)
{
	char	*find;
	char	*tmp;
	int		ret;

	ret = 0;
	tmp = _strdup(buf);
	find = tmp + _strspn(tmp, "\n");
	while (find)
	{
		find = _strchr(find + 1, '\n');
		if (find && find[1] == '\n')
		{
			ret = 1;
			break ;
		}
	}
	free(tmp);
	return (ret);
}

static int	unclosed(char **strs, int x, int y, t_data *data)
{
	char const	*valid = "NSEW01";

	if (x == 0 || x == data->rows)
		return (1);
	if (strs[x][y - 1] && !_strchr(valid, strs[x][y - 1]))
		return (1);
	else if (strs[x][y + 1] && !_strchr(valid, strs[x][y + 1]))
		return (1);
	else if (strs[x - 1][y] && !_strchr(valid, strs[x - 1][y]))
		return (1);
	else if (strs[x + 1][y] && !_strchr(valid, strs[x + 1][y]))
		return (1);
	return (0);
}

static int	closed_map(char **ptr, t_data *data)
{
	size_t	pos;
	size_t	line;
	char	*zero;

	line = 0;
	while (ptr[line])
	{
		zero = _strchr(ptr[line], '0');
		while (zero)
		{
			pos = zero - ptr[line];
			if (unclosed(ptr, line, pos, data))
				return (0);
			zero = _strchr(zero + 1, '0');
		}
		line++;
	}
	return (1);
}

static int	count_player(char const *buf)
{
	size_t	count;

	count = 0;
	while (*buf)
	{
		if (_strchr("NSEW", *buf++))
			count++;
	}
	return (count);
}

char	**check_map(char const *buf, t_data *data)
{
	char		**ret;

	if (count_player(buf) != 1 || blank_line(buf))
		return (0);
	ret = surround_map(buf, data);
	if (closed_map(ret, data))
		return (ret);
	_free_split(ret);
	return (0);
}
