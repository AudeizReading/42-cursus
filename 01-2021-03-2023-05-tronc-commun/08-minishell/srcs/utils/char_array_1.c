/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   char_array_1.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <alellouc@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/11 23:43:42 by alellouc          #+#    #+#             */
/*   Updated: 2022/01/11 23:43:44 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "minishell.h"

size_t	ft_get_arr_size(char **array)
{
	size_t	size;

	size = 0;
	if (!array)
		return (0);
	while (array[size] != NULL)
		size++;
	return (size);
}

void	ft_print_char_array_fd(char **array, int fd)
{
	char	**p_array;

	if (!array)
	{
		ft_putendl("(null)");
		return ;
	}
	p_array = array;
	while (*p_array)
	{
		ft_putendl_fd(*p_array, fd);
		p_array++;
	}
}

void	ft_print_char_array(char **array)
{
	ft_print_char_array_fd(array, STDOUT_FILENO);
}

int	ft_read_char_array_fd(char ***array, int fd)
{
	int		n;
	char	buf[2];
	char	*tmp;

	n = 1;
	tmp = NULL;
	if (fd)
	{
		while (n > 0)
		{
			n = read(fd, buf, 1);
			if (n == EOF)
				break ;
			if (n == -1)
				return (1);
			buf[n] = 0;
			tmp = ft_concat(tmp, buf);
		}
	}
	*array = ft_split(tmp, '\n');
	free(tmp);
	if (!array)
		return (1);
	return (0);
}

void	free_char_array(char **array)
{
	int		i;

	if (!array)
		return ;
	i = 0;
	while (array[i])
		free(array[i++]);
	free(array);
}
