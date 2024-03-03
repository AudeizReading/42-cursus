/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strcapitalize.c                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/15 14:41:52 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/23 12:19:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

char	*ft_strcapitalize(char *str)
{
	char	*p_str;
	int		inside_wrd;

	p_str = str;
	inside_wrd = 0;
	while (*p_str != '\0')
	{
		if ((*p_str >= 97 && *p_str <= 122) || (*p_str >= 48 && *p_str <= 57)\
					|| (*p_str >= 65 && *p_str <= 90))
		{
			if (!inside_wrd && *p_str >= 97)
				*p_str -= 32;
			else if (*p_str >= 65 && *p_str <= 90)
				*p_str += 32;
			inside_wrd = 1;
		}
		else if (inside_wrd)
		{
			inside_wrd = 0;
		}
		p_str++;
	}
	return (str);
}
