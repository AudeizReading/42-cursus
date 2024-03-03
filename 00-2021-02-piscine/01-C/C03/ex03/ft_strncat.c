/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strncat.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/18 14:46:42 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/21 18:41:43 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

char		*ft_strncat(char *dest, char *src, unsigned int nb)
{
	char			*p_dest;
	unsigned int	i;

	p_dest = dest;
	i = 0;
	while (*p_dest)
	{
		p_dest++;
	}
	while (src[i] && i < nb)
	{
		*p_dest++ = src[i++];
	}
	*p_dest = '\0';
	return (dest);
}
