/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _calloc.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:04 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:05 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>

void	_bzero(void *s, size_t n);

void	*_calloc(size_t count, size_t size)
{
	void	*ret;

	ret = malloc(size * count);
	if (ret)
		_bzero(ret, size * count);
	return (ret);
}
