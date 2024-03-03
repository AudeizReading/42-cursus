/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strcmp.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:51 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:52 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);
int		_strncmp(char const *s1, char const *s2, size_t len);

int	_strcmp(char const *s1, char const *s2)
{
	return (_strncmp(s1, s2, _strlen(s2)));
}
