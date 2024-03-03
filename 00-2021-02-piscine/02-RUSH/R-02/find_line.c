/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   find_line.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtaouil <marvin@42.fr>                     +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/27 13:32:39 by mtaouil           #+#    #+#             */
/*   Updated: 2021/02/27 17:33:52 by mtaouil          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "numbers.h"

int		line_len(int fd)
{
	int compteur;
	char c;

	read(fd, &c, 1);
	compteur = 0;
	while (c != '\0' && c != '\n')
	{
		compteur++;
		read(fd, &c, 1);
	}
	return (compteur);
}

char	*find_line(int fd) // a mettre dans une boucle pour recuperer une nouvelle ligne a chaque fois
{
	char c;
	char *line;
	int i;

	line = malloc(sizeof(char) * line_len(fd)); // a check si le curseur ne se met pas a la fin
	read(fd, &c, 1);
	i = 0;
	while (c != '\0' && c != '\n')
	{
		line[i] = c;
		i++;
		read(fd, &c, 1);
	}
	return (line);
}

int		open_file(char *file, char *nb) // le nb sera utilise plus tard
{
	int fd;

	fd = open(file, O_RDONLY);
	if (fd == -1)
	{
		write(1, "Error\n", 6);
		return (-1);
	}
	// appel de(s) fonction(s) pour parcourir le dico
	if (close(fd) == -1)
	{
		write(1, "Error\n", 6);
		return (-1);
	}
	return (fd);
}

int main(void)
{
	open_file("test.txt", "12");
}
