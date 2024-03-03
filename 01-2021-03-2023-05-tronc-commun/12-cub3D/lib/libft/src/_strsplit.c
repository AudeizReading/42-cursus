/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strsplit.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:09 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:09 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>
#include <stdlib.h>

char	*_strdup(char const *s);
char	*_strtok(char *s, char const *delim);
void	*_free_split(char **split);
void	*_calloc(size_t count, size_t size);

static char	*skip(char const *s, char c)
{
	while (*s && *s == c)
		s++;
	return ((char *) s);
}

static size_t	count_words(char const *s, char c)
{
	size_t	count;

	count = 0;
	if (!(*s))
		return (0);
	s = skip(s, c);
	while (*s)
	{
		if (*s == c)
		{
			count++;
			s = skip(s, c);
			continue ;
		}
		s++;
	}
	if (*(s - 1) != c)
		count++;
	return (count);
}

static char	**join_words(char **ret, char *s, char c)
{
	char const	*dup = _strdup(s);
	char const	d[2] = {c, 0};
	char		**it;
	char		*tmp;
	char		*tok;

	it = ret;
	tmp = (char *) dup;
	tok = _strtok((char *) dup, d);
	while (tok)
	{
		*it++ = _strdup(tok);
		tok = _strtok(NULL, d);
	}
	free(tmp);
	return (ret);
}

char	**_strsplit(char const *s, char c)
{
	size_t const	count = count_words((char *) s, c);
	char			**ret;

	ret = 0;
	if (s)
	{
		ret = _calloc(1 + count, sizeof(*ret));
		if (ret)
			ret = join_words(ret, (char *) s, c);
		else
			_free_split(ret);
	}
	return (ret);
}
