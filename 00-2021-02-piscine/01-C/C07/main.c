/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alellouc <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/02/24 10:08:14 by alellouc          #+#    #+#             */
/*   Updated: 2021/03/03 16:16:32 by alellouc         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <unistd.h>
#include <stdio.h>
#include <limits.h>
#include <stdlib.h>

char	*ft_strdup(char *src);
int		ft_strlen(char *str);
int		*ft_range(int min, int max);
int		ft_ultimate_range(int **range, int min, int max);
char	*ft_strjoin(int size, char **strs, char *sep);
void	ft_putstr(char *str);

void	ft_putstr(char *str)
{
	while (*str)
		write(1, str++, 1);
}

int main(void)
{
/*	char	*dest;
	int		*tab;
	int		i;
	int		min;
	int		max;

	i = 0;
	min = 15;
	max = 165;
	dest = ft_strdup("Hello");
	printf("%d\n", ft_strlen(dest));
	printf("%s\n", ft_strdup(dest));
	ft_ultimate_range(&tab, min, max);
		while (i < (max - min))
		{
			printf("valeur:%d\n", tab[i++]);
			printf("i: %d", i);
		}
	free(tab);
	free(dest);*/
/*	char	*sep = "*-*";*/
	/*char	*strs[8] = {"Hello","Everybody", "42"};*/
	char	*strs[8] = {"","", ""};
	int		size = 3;
	
	printf("%s\n", ft_strjoin(size, strs, ""));
	return (0);
}
