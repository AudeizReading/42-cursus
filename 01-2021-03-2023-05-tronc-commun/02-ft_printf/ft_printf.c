/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_printf.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/09 08:12:37 by alellouc          #+#    #+#             */
/*   Updated: 2021/07/07 17:07:05 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libftprintf.h"

int	ft_printf(const char *format, ...)
{
	int			sum;
	const char	*p_format;
	va_list		args;

	p_format = format;
	sum = 0;
	va_start(args, format);
	while (*p_format)
	{
		if (*p_format == '%' && *(++p_format))
		{
			if (ft_is_indicator(*p_format))
				sum += ft_parse_ind(*p_format, args);
		}
		else
			sum += ft_int_putchar_fd(*p_format, 1);
		p_format++;
	}
	va_end(args);
	return (sum);
}
