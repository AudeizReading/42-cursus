/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_check_invalid_base.c                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/27 14:10:26 by alellouc          #+#    #+#             */
/*   Updated: 2021/06/27 14:27:03 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

t_bool	ft_check_invalid_base(char *base, int *base_2_convert)
{
	while (base[*base_2_convert])
	{
		if (base[*base_2_convert] == base[*base_2_convert + 1] \
				|| base[*base_2_convert] == 43 || base[*base_2_convert] == 45 \
				|| base[*base_2_convert] <= 32 || base[*base_2_convert] >= 126)
			return (1);
		(*base_2_convert)++;
	}
	if (*base_2_convert < 2)
		return (true);
	return (false);
}
