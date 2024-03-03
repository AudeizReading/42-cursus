/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_file.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 19:35:57 by alellouc          #+#    #+#             */
/*   Updated: 2021/02/28 15:46:58 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FT_FILE_H
# define FT_FILE_H

int		ft_open(char *file);
int		ft_read(int fd, char *c);
int		ft_close(int fd);
int		ft_size_line(int fd);
int		ft_count_line(int fd);
char	*ft_get_file(int fd);
#endif
