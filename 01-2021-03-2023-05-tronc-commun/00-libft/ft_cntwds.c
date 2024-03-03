/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_cntwds.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/04/08 17:18:21 by alellouc          #+#    #+#             */
/*   Updated: 2021/04/11 12:57:59 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	ft_cntwds(char *str, int sep)
{
	int		nb;
	int		state;

	enum e_state
	{
		OUTSIDE_WD,
		INSIDE_WD
	};
	nb = 0;
	state = OUTSIDE_WD;
	while (*str)
	{
		if (ft_ischarset(*str, (char const *)&sep))
			state = OUTSIDE_WD;
		else if (state == OUTSIDE_WD)
		{
			state = INSIDE_WD;
			nb++;
		}
		str++;
	}
	return (nb);
}
