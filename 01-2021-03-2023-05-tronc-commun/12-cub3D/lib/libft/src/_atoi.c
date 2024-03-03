/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   _atoi.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: kjaoudi <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/07 09:42:28 by kjaoudi           #+#    #+#             */
/*   Updated: 2022/04/07 09:42:34 by kjaoudi          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

int	_isspace(int c);
int	_isdigit(int c);

int	_atoi(const char *str)
{
	int	res;
	int	neg;

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
