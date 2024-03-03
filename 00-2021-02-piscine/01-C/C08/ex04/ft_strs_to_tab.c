#include "ft_stock_str.h"
#include <stdio.h>
#include <stdlib.h>
#include <sys/errno.h>

void					ft_show_tab(struct s_stock_str *par);

int						ft_strlen(char *str)
{
	int				len;

	len = 0;
	while (str[len])
		len++;
	return (len);
}

char					*ft_strdup(char *src)
{
	int				i;
	int				size;
	char			*dest;

	i = 0;
	size = ft_strlen(src);
	if ((dest = (char *)malloc(sizeof(char) * size + 1)) == 0)
	{
		errno = ENOMEM;
		return ((char *)0);
	}
	while ((dest[i] = src[i]) != '\0')
		i++;
	dest[i] = '\0';
	return (dest);
}

struct s_stock_str		*ft_strs_to_tab(int ac, char **av)
{
	int				i;
	t_stock_str		*tab;

	i = 0;
	if ((tab = (t_stock_str *)malloc(sizeof(t_stock_str[ac + 1]))) == 0)
		return ((t_stock_str *)0);
	while (i < ac)
	{
			tab[i].str = ft_strdup(av[i]);
			tab[i].size = ft_strlen(tab[i].str);
			tab[i].copy = ft_strdup(tab[i].str);
			i++;
	}
	tab[i].str = '\0';
	return (tab);
}

int		main(int argc, char **argv)
{
	t_stock_str		*tab;

	tab = ft_strs_to_tab(argc, argv); 
	ft_show_tab(tab);
	free(tab);
	return (0);
}
