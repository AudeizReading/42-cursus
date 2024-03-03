/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strstr.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/18 14:48:29 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/21 19:30:27 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

char		*ft_strstr(char *str, char *to_find)
{
	int		i;
	int		j;

	i = 0;
	if (!*to_find)
		return (str);
	while (*(str + i))
	{
		j = 0;
		while (*(to_find + j) == *(str + i + j))
		{
			if (!*(to_find + j + 1))
			{
				return (str + i);
			}
			j++;
		}
		i++;
	}
	return ((char *)0);
}
