/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_check_map.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/08/14 19:29:00 by alellouc          #+#    #+#             */
/*   Updated: 2021/08/14 19:29:03 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

t_bool	ft_is_map_file(char *filename, char *ext)
{
	size_t	name_len;
	size_t	ext_len;

	name_len = ft_strlen(filename);
	ext_len = ft_strlen(ext);
	if (!ft_strncmp(filename + (name_len - ext_len), ext, ext_len))
		return (e_true);
	return (e_false);
}
