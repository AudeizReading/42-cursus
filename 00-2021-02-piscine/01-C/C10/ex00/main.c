#include <ft_functions.h>

int		main(int argc, char **argv)
{
	if (argc == 1)
		ft_puterr("File name missing");
	else if (argc > 2)
		ft_puterr("Too many arguments");
	else
		ft_display_file(argv[1]);
	return (0);
}
