/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_has_valid_sign_ato.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/20 22:26:52 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/20 22:27:04 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

t_bool	ft_has_valid_sign_ato(char **s, int *polarity)
{
	int	sign;

	sign = 0;
	if (!s)
		return (e_false);
	while (**s == 43 || **s == 45)
	{
		if (**s == 45)
			*polarity *= -1;
		sign++;
		(*s)++;
	}
	if (sign > 1)
		return (e_false);
	return (e_true);
}
