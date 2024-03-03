/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _getline.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:12 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:13 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

#ifndef BUFFER_SIZE
# define BUFFER_SIZE 128
#endif

void		_bzero(void *p, size_t len);
char		*_strjoin(char const *str, char const *add);
char		*_stpcpy(char *dst, char const *src);
char		*_strchr(char const *str, int c);
char		*_strdup(char const *str);

static char	*my_strchr(char *str, char c);
static char	*my_strjoin(char *dst, char const *src);

char	*_getline(int const fd)
{
	static char	buf[FOPEN_MAX][BUFFER_SIZE + 1];
	char		*line;
	char		*found;
	size_t		bytes;

	bytes = BUFFER_SIZE;
	line = _strdup("");
	while (BUFFER_SIZE > 0 && line && !read(fd, buf[fd], 0))
	{
		found = my_strchr(buf[fd], '\n');
		line = my_strjoin(line, buf[fd]);
		if (found)
		{
			_stpcpy(buf[fd], found);
			return (my_strjoin(line, "\n"));
		}
		_bzero(buf[fd], BUFFER_SIZE);
		if (bytes != BUFFER_SIZE)
			return (line);
		bytes = read(fd, buf[fd], BUFFER_SIZE);
		if (bytes < 1 && !(*line))
			break ;
	}
	free(line);
	return (NULL);
}

static char	*my_strchr(char *str, char c)
{
	char	*found;

	found = _strchr(str, c);
	if (found)
		*found++ = 0;
	return (found);
}

static char	*my_strjoin(char *dst, char const *src)
{
	char const	*ret = _strjoin(dst, src);

	if (ret)
		free(dst);
	return ((char *) ret);
}
