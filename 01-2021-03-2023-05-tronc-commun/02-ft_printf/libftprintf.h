/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   libftprintf.h                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/13 12:44:16 by alellouc          #+#    #+#             */
/*   Updated: 2021/07/07 14:44:45 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef LIBFTPRINTF_H
# define LIBFTPRINTF_H
# include "./libft/libft.h"
# include <stdarg.h>

typedef struct s_func
{
	int		(*p_func)(va_list args);
	char	key;
}				t_func;

int		ft_printf(const char *fmt, ...);
t_bool	ft_is_indicator(int c);
int		ft_set_ind_c(va_list args);
int		ft_set_ind_s(va_list args);
int		ft_set_ind_d(va_list args);
int		ft_set_ind_i(va_list args);
int		ft_set_ind_u(va_list args);
int		ft_set_ind_x(va_list args);
int		ft_set_ind_X(va_list args);
int		ft_set_ind_p(va_list args);
int		ft_set_ind_percent(va_list args);
int		ft_parse_ind(char c, va_list args);

#endif
