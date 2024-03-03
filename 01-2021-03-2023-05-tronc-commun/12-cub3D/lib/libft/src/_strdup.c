/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _strdup.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:54 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:54 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stddef.h>

size_t	_strlen(char const *str);
char	*_strndup(char const *str, size_t len);

char	*_strdup(char const *str)
{
	return (_strndup(str, _strlen(str)));
}
