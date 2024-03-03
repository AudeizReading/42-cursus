/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _atol.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:42:59 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:43:01 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

int	_isspace(int c);
int	_isdigit(int c);

long	_atol(const char *str)
{
	long	res;
	int		neg;

	res = 0;
	neg = 1;
	while (*str && _isspace(*str))
		str++;
	if (*str == '-' || *str == '+')
	{
		if (*str == '-')
			neg = -1;
		str++;
	}
	while (_isdigit(*str) && *str)
	{
		res = res * 10 + (*str - '0');
		str++;
	}
	return (res * neg);
}
