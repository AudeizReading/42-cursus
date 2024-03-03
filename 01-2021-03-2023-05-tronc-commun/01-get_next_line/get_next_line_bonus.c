/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line_bonus.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/02 10:31:13 by alellouc          #+#    #+#             */
/*   Updated: 2021/06/07 11:22:17 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "get_next_line_bonus.h"

void	*ft_ccpy(void *dst, const void *src, int c, size_t n)
{
	unsigned char		*p_dst;
	unsigned const char	*p_src;
	unsigned char		cc;

	p_dst = dst;
	p_src = src;
	cc = c;
	while (n--)
	{
		*p_dst++ = *p_src;
		if (*p_src++ == cc)
		{
			*--p_dst = 0;
			return ((void *)p_src);
		}
	}
	return (NULL);
}

char	*ft_concat(char const *s1, char const *s2)
{
	char				*dst;
	size_t				len_s1;
	size_t				len_s2;

	len_s1 = ft_strlen(s1);
	len_s2 = ft_strlen(s2);
	dst = ft_calloc(sizeof(*dst), (len_s1 + len_s2 + 1));
	if (dst == NULL)
		return (NULL);
	ft_ccpy(dst, s1, 0, len_s1);
	ft_ccpy((dst + len_s1), s2, 0, len_s2);
	dst[len_s1 + len_s2] = 0;
	free((void *)s1);
	return (dst);
}

char	*ft_parse_buf(size_t bytes, char *buf, char **newline)
{
	char				*end_line;
	size_t				end_len;
	size_t				begin_len;

	end_len = ft_search(buf, '\n') - buf;
	begin_len = bytes - end_len + 1;
	end_line = ft_calloc(sizeof(*end_line), end_len);
	if (!end_line)
		return (NULL);
	ft_ccpy(buf, ft_ccpy(end_line, buf, 10, end_len), 0, begin_len);
	*newline = ft_concat(*newline, end_line);
	if (ft_check_mem(*newline, &end_line))
		return (NULL);
	free(end_line);
	return (*newline);
}

int	ft_check_mem(char *new_ptr, char **used_ptr)
{
	if (!new_ptr)
	{
		free((void *)*used_ptr);
		*used_ptr = NULL;
		return (1);
	}
	return (0);
}

int	get_next_line(int fd, char **line)
{
	int					ret;
	static char			buf[255][BUFFER_SIZE + 1];
	char				*newline;

	if (read(fd, buf[fd], 0) < 0 || !line || BUFFER_SIZE < 1)
		return (-1);
	newline = ft_strdup("");
	ret = ft_strlen(buf[fd]) + 1;
	while (!ft_search(buf[fd], '\n') && ret > 0)
	{
		newline = ft_concat(newline, buf[fd]);
		ret = read(fd, buf[fd], BUFFER_SIZE);
		if (ret == -1 || ft_check_mem(newline, &newline))
			return (-1);
		buf[fd][ret] = 0;
	}
	if (ft_search(buf[fd], '\n'))
		newline = ft_parse_buf(ret, buf[fd], &newline);
	*line = ft_strdup(newline);
	if (ft_check_mem(*line, &newline))
		return (-1);
	free(newline);
	if (ret == 0)
		return (0);
	return (1);
}
