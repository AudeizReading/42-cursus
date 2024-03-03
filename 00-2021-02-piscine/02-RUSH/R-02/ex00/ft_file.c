/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_file.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 19:18:31 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 14:35:51 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <fcntl.h>
#include <sys/types.h>
#include <sys/uio.h>
#include <unistd.h>

int		ft_open(char *file)
{
	return (open(file, O_RDONLY, 0));
}

int		ft_read(int fd, char *c)
{
	return (read(fd, c, 1));
}

int		ft_close(int fd)
{
	return (close(fd));
}
