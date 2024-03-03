/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.h                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/05/12 08:45:29 by alellouc          #+#    #+#             */
/*   Updated: 2021/06/07 09:52:56 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef GET_NEXT_LINE_H
# define GET_NEXT_LINE_H
# include <unistd.h>
# include <stdlib.h>
# include <limits.h>
# include <sys/errno.h>

int		get_next_line(int fd, char **line);
char	*ft_strdup(const char *s1);
size_t	ft_strlen(const char *s);
void	*ft_calloc(size_t count, size_t size);
char	*ft_search(const char *s, int c);
void	*ft_ccpy(void *dst, const void *src, int c, size_t n);
char	*ft_concat(char const *s1, char const *s2);
char	*ft_parse_buf(size_t bytes, char *buf, char **newline);
int		ft_check_mem(char *new_ptr, char **used_ptr);
#endif
