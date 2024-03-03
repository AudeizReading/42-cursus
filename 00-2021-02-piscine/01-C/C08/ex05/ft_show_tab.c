#include "../ex04/ft_stock_str.h"
#include <unistd.h>

void		ft_putchar(char c)
{
	write(1, &c, 1);
}

void		ft_putstr(char *str)
{
	while (*str)
		ft_putchar(*str++);
}

void		ft_putnbr(int nb)
{
	long int		c;

	c = nb;
	if (c < 0)
	{
		ft_putchar('-');
		c = -c;
	}
	if (c >= 10)
		ft_putnbr(c / 10);
	ft_putchar(c % 10 + '0');
}

void		ft_print(void (*ft_put)(void *input), void *input)
{
	(*ft_put) (input);
	ft_putchar('\n');
}

void		ft_show_tab(struct s_stock_str *par)
{
	while (*par->str != '\0')
	{
		ft_print((void *)ft_putstr, (void *)par->str);
		ft_putnbr((*par).size);
		ft_putchar('\n');
		ft_print((void *)ft_putstr, (void *)par->copy);
		par++;
	}
}
