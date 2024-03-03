/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_atol_base.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/20 22:29:24 by alellouc          #+#    #+#             */
/*   Updated: 2021/10/13 14:45:20 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

long	ft_atol_base(char *s, int base)
{
	long	atol;
	int		polarity;

	polarity = 1;
	atol = 0;
	while (ft_isspace(*s))
		s++;
	if (!ft_has_valid_sign_ato(&s, &polarity))
		return (0);
	while (*s && (ft_isdigit(*s) || ft_strchr("abcdef", ft_tolower(*s))))
	{
		if (*s < 58)
			atol = atol * base + (*s - 48);
		else
			atol = atol * base + (ft_tolower(*s) - 87);
		s++;
	}
	atol *= polarity;
	return ((long)atol);
}
