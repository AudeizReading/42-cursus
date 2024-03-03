/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strlcat.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/18 14:51:07 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/21 19:35:00 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

unsigned int	ft_strlen(char *str)
{
	unsigned int	len;

	len = 0;
	while (*str)
	{
		len++;
		str++;
	}
	return (len);
}

unsigned int	ft_strlcat(char *dest, char *src, unsigned int size)
{
	char			*p_dest;
	unsigned int	dest_len;
	unsigned int	src_len;
	unsigned int	n;

	p_dest = dest;
	dest_len = ft_strlen(dest);
	src_len = ft_strlen(src);
	n = 0;
	while (*p_dest)
		p_dest++;
	while (*src && n < (size - dest_len - 1))
	{
		*p_dest++ = *src++;
		n++;
	}
	if (ft_strlen(dest) < size)
		*p_dest = '\0';
	return (dest_len + src_len);
}
