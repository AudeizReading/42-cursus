#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <ft_functions.h>

void	ft_display_file(char *file)
{
	int			fd;
	const int	BUFSIZE = 4096;
	char		buffer[BUFSIZE];

	if ((fd = open(file, O_RDONLY, 0)) == -1)
		ft_puterr("Cannot read file");
	while (read(fd, buffer, BUFSIZE) > 0)
		ft_putstr(buffer);
	close(fd);
}
