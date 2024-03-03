/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   libft.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <kjaoudi@student.42nice.fr>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/15 10:47:40 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/06 15:24:19 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef LIBFT_H
# define LIBFT_H

# include <stddef.h>

char	*_strjoin(char const *str, char const *add);
char	*_strnjoin(char const *str, char const *add, size_t len);
char	*_strnstr(char const *str, char const *find, size_t len);
char	*_strchr(char const *str, int c);
char	*_strrchr(char const *str, int c);
char	*_strtok(char *str, char const *delim);
char	*_stpcpy(char *dst, char const *src);
char	*_stpncpy(char *dst, char const *src, size_t len);
char	*_strmapi(char const *str, char (*f)(unsigned int, char));
size_t	_strlen(char const *str);
size_t	_strnlen(char const *str, size_t maxlen);
size_t	_strlcpy(char *dst, char const *src, size_t len);
size_t	_strlcat(char *dst, char const *src, size_t len);
int		_strcmp(char const *s1, char const *s2);
int		_strncmp(char const *s1, char const *s2, size_t len);
size_t	_strspn(char *str, char *set);
size_t	_strcspn(char *str, char *set);

char	*_strdup(char const *str);
char	*_strndup(char const *src, size_t len);
char	*_substr(char const *str, size_t start, size_t len);
char	*_strtrim(char const *str, char const *set);
char	*_getline(int const fd);
char	*_getfile(char const *path);
char	**_strsplit(char const *str, char c);

int		_atoi(char const *str);
long	_atol(char const *str);
char	*_itoa(int n);

void	_bzero(void *p, size_t len);
void	*_memccpy(void *dst, void const *src, int c, size_t len);
void	*_memchr(void const *p, int c, size_t n);
void	*_memcpy(void *dst, void const *src, size_t len);
void	*_memmove(void *dst, void const *src, size_t len);
void	*_memset(void *p, int val, size_t len);
int		_memcmp(void const *p1, void const *p2, size_t n);
void	*_calloc(size_t count, size_t size);
void	*_free_split(char **split);
void	*_free(void *p);

void	_putc(char c);
void	_puts(char const *str);
void	_putnl(char const *str);
void	_putn(long n);

int		_isalnum(int c);
int		_isascii(int c);
int		_isprint(int c);
int		_isalpha(int c);
int		_isdigit(int c);
int		_isspace(int c);
int		_islower(int c);
int		_isupper(int c);
int		_tolower(int c);
int		_toupper(int c);

#endif
