/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strlcpy.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/15 14:45:26 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/21 12:24:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

unsigned int	ft_strlcpy(char *dest, char *src, unsigned int size)
{
	unsigned int	length;

	length = 0;
	while ((dest[length] = src[length]) != '\0' && length < size - 1)
	{
		length++;
	}
	if (size > 0)
		dest[length] = '\0';
	length = 0;
	while (src[length])
	{
		length++;
	}
	return (length);
}
