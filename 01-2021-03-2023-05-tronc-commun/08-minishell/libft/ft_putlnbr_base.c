/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_putlnbr_base.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/09/20 22:02:16 by alellouc          #+#    #+#             */
/*   Updated: 2021/09/20 22:02:39 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_putlnbr_base(long nbr, char *base)
{
	unsigned long	l_nbr;
	int				size_base;

	size_base = 0;
	if (ft_check_invalid_base(base, &size_base))
		return ;
	if (nbr < 0)
	{
		ft_putchar_fd('-', 1);
		nbr = -nbr;
	}
	l_nbr = nbr;
	if (l_nbr >= (unsigned long)size_base)
		ft_putlnbr_base(l_nbr / size_base, base);
	ft_putchar_fd(base[l_nbr % size_base], 1);
}
