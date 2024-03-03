/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tests.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/05 17:19:02 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/10 22:36:24 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

#include <iostream>
#include <string>
#include <sstream>

#include "../include/ansi_color.h"

#ifndef P_TYPE
# define P_TYPE(x) (TOML::typeToChar(x))
#endif

inline std::string	centeredString(const std::string& src, std::size_t len)
{
	std::ptrdiff_t	pad_len = len - src.length();
	if (pad_len < 0)
		pad_len = 0;
	std::string	out(pad_len / 2, ' ');

	out += src;
	out.append(pad_len / 2 + pad_len % 2, ' ');
	return (out);
}

inline void	newtest(const char *description = NULL)
{
	static int	i = 1;
	std::stringstream	header;
	header << "===============TEST " << i++ << "===============";

	std::cout << "\e[0;30;47m" << header.str() << "\e[0m" << std::endl;
	if (description)
	{
		std::cout << "\e[30;48;5;245m" << centeredString(description, header.str().length())
		<< "\e[0m" << std::endl;
	}
}

int		first_tests(int argc, const char *argv[]);
int		iterator_tests(int argc, char const *argv[]);
