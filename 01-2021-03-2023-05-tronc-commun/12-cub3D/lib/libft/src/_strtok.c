/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strtok.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:44:12 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:44:12 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

char	*_strchr(char const *s, int c);
int		_strcspn(char *str, char *set);

char	*_strtok(char *s, char const *delim)
{
	static char		*cursor;

	if (s == 0)
		s = cursor;
	if (*s == '\0')
		return (0);
	while (_strchr(delim, *s))
		if (*s++ == '\0')
			return (0);
	cursor = s + _strcspn(s, (char *) delim);
	if (*cursor != 0)
		*cursor++ = 0;
	return (s);
}
