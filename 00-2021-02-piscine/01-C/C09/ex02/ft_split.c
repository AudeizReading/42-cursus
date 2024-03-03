#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

void	ft_putchar(char c)
{
	write(1, &c, 1);
}

void	ft_putstr(char *str)
{
	while (*str)
		write(1, str++, 1);
}

void	ft_putnbr(int nbr)
{
	long int n;

	n = nbr;
	if (n < 0)
	{
		ft_putchar('-');
		n = -n;
	}
	if (n >= 10)
		ft_putnbr(n / 10);
	ft_putchar(n % 10 + 48);
}

int		ft_strlen(char *str)
{
	int		len;

	len = 0;
	while (str[len])
		len++;
	return (len);
}

char	*ft_strstr(char *haystack, char *needle)
{
	int		i;
	int		j;

	i = 0;
	if (!*needle)
		return (haystack);
	while (*(haystack + i))
	{
		j = 0;
		while (*(needle + j) == *(haystack + i + j))
		{
			if (!*(needle + j + 1))
			{
				return (haystack + i);
			}
			j++;
		}
		i++;
	}
	return ((char *)0);
}

int		ft_is_charset(char c, char *charset)
{
	while (*charset)
	{
		if (c == *charset)
			return (1);
		charset++;
	}
	return (0);
}

int		ft_count_word(char *str, char *sep)
{
	enum	e_state
	{
		OUTSIDE,
		INSIDE
	};
	int		state;
	int		nb_w;
	
	state = OUTSIDE;
	nb_w = 0;
	while (*str)
	{
		if (ft_is_charset(*str, sep))
			state = OUTSIDE;
		else if (state == OUTSIDE)
		{
			state = INSIDE;
			++nb_w;
		}
		str++;
	}
	return (nb_w);
}

int		ft_strlen_w(char *str, char *sep, int pos)
{
	int		len_w;

	len_w = 0;
	while (str[pos])
	{
		if (!ft_is_charset(str[pos], sep))
			len_w++;
		if (ft_is_charset(str[pos], sep))
			break;
		pos++;
	}
	return (len_w);
}

int		main(int argc, char **argv)
{
	int		nb_w;
	char	*p_str;
	char	p[4][7];
	int		len_w;
/*	char	**p;*/
	int		i;
	int		j;
	int		k;

	i = j = k = nb_w = 0;
	len_w = 0;
	p_str = argv[1];

	if (argc >= 2)
	{
		nb_w = ft_count_word(p_str, "*-*");
		/*p = malloc(sizeof(char[nb_w]));*/
	/*	while (*argv[1])
		{
			if (!ft_is_charset(*argv[1], "*-*"))
				len_w++;
			else
				len_w = 0;
			ft_putnbr(len_w);
			ft_putchar('\n');
			argv[1]++;
		}*/
		/*ft_putnbr(ft_strlen_w(argv[1], "*-*"));
		ft_putchar('\n');*/
		while (argv[1][k] && i < nb_w)
		{
			if (!ft_is_charset(argv[1][k], "*-*"))
			{
				len_w++;
				p[i][j] = argv[1][k];
				j++;
			}
			else
			{
				ft_putnbr(ft_strlen_w(argv[1], "*-*", k));
				ft_putchar('\n');
				ft_putnbr(len_w);
				ft_putchar('\n');
				len_w = 0;
			}
			if (ft_is_charset(argv[1][k], "*-*") && !ft_is_charset(argv[1][k + 1], "*-*"))
			{
				p[i][j] = '\0';
				i++;
				j = 0;
			}
			k++;
		
		}
		i = 0;
		while (i < nb_w)
		{
			ft_putstr(p[i++]);
			ft_putchar('\n');
		}
	}
	return (0);
}
