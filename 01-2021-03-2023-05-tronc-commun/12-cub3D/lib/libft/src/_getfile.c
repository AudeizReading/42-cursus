/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _getfile.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:11 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:12 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>

char	*_getline(int const fd);
char	*_strdup(char const *s);
char	*_strjoin(char const *s1, char const *s2);

char	*_getfile(char const *path)
{
	int		fd;
	char	*line;
	char	*ret;
	char	*tmp;

	fd = open(path, O_RDONLY);
	if (read(fd, NULL, 0) == 0)
	{
		ret = _strdup("");
		line = _getline(fd);
		while (line)
		{
			tmp = _strdup(ret);
			free(ret);
			ret = _strjoin(tmp, line);
			free(tmp);
			free(line);
			line = _getline(fd);
		}
		close(fd);
		return (ret);
	}
	return (NULL);
}
