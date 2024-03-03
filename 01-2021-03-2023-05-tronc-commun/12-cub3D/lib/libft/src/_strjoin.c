/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strjoin.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:55 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:56 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *s);
char	*_strnjoin(char const *str, char const *add, size_t len);

char	*_strjoin(char const *str, char const *add)
{
	return (_strnjoin(str, add, _strlen(add)));
}
