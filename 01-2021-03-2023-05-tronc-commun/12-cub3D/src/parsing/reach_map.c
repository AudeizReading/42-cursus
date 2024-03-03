/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   reach_map.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 10:23:37 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 10:23:37 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"
#include "types.h"

#include <stdlib.h>

int	*convert_xpm(char *tok, t_data *m);

static size_t	count_values(char const *s)
{
	size_t	count;

	count = 0;
	while (s && *s)
		if (*s++ == ',')
			count++;
	return (count + 1);
}

static int	_strnisdigit(char const *s, size_t len)
{
	while (s && --len)
		if (_isdigit(*s++) == 0)
			return (0);
	return (1);
}

static int	set_color(char *s, unsigned char rgb[2][3], int dir)
{
	int		value;
	size_t	count;
	size_t	digits;

	count = 1;
	if (count_values(s) == 3)
	{
		digits = _strcspn(s, ",");
		while (digits > 0 && digits < 4 && _strnisdigit(s, digits + 1))
		{
			value = _atoi(s);
			if (value < 0 || value > 255)
				break ;
			rgb[dir][count - 1] = value;
			s += digits + 1;
			digits = _strcspn(s, ",");
			if (count++ == 3)
				return (1);
		}
	}
	return (0);
}

static int	p_assign(char *tok, t_data *data)
{
	char const	*names[] = {"NO ", "SO ", "WE ", "EA ", "F ", "C ", 0};
	int			ret;
	int			i;

	i = -1;
	ret = 0;
	tok += _strspn(tok, " ");
	while (names[++i])
	{
		if (_strncmp(tok, names[i], 3) == 0 || \
			_strncmp(tok, names[i], 2) == 0)
		{
			tok += _strspn(tok, (char *) names[i]);
			tok += _strspn(tok, " ");
			if (i < 4)
				data->tex[i] = convert_xpm(tok, data);
			else if (i < 6 && !set_color(tok, data->rgb, (i + 1) % 2))
				break ;
			ret = i + 1;
		}
	}
	return (ret);
}

char	*reach_map(char const *buf, t_data *m)
{
	char	*ret;
	char	*tok;
	int		param;
	int		total;

	ret = 0;
	param = 0;
	total = 0;
	tok = _strtok((char *) buf, "\n");
	while (tok)
	{
		param = p_assign(tok, m);
		if (param == 0)
			break ;
		total += param;
		if (total == 21)
		{
			ret = _strdup(tok + _strcspn(tok, "\n") + 1);
			break ;
		}
		else
			tok = _strtok(NULL, "\n");
	}
	free((char *) buf);
	return (ret);
}
