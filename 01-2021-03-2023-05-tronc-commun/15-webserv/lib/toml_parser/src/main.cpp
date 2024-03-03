/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/05 17:21:51 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/05 17:33:53 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>
#include <string>
#include <vector>
#include "tests.hpp"

int	main(int argc, const char *argv[])
{
	if (first_tests(argc, argv) != 0)
		return 1;
	if (iterator_tests(argc, argv) != 0)
		return 1;
}
