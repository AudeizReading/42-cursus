/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _isascii.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:43:20 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:22 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

int	_isascii(int c)
{
	if (c >= 0 && c <= 127)
		return (1);
	else
		return (0);
}
