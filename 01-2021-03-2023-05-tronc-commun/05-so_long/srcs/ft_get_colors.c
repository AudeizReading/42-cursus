/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_get_colors.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/20 10:59:17 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/20 10:59:27 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	ft_get_trgb(int t, int r, int g, int b)
{
	return (t << 24 | r << 16 | g << 8 | b);
}

int	ft_get_t(int trgb)
{
	return (trgb &(0xFF << 24));
}

int	ft_get_r(int trgb)
{
	return (trgb &(0xFF << 16));
}

int	ft_get_g(int trgb)
{
	return (trgb &(0xFF << 8));
}

int	ft_get_b(int trgb)
{
	return (trgb & 0xFF);
}
