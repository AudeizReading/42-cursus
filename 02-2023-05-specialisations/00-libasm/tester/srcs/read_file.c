
static int	strlen_file_content(char *filename) {
	char	buffer[BUFFER_SIZE] = {0};
	int		res_read_size = 0;
	int		read_size = 0;
	int		fd = open(filename, O_RDONLY);

	while ((res_read_size = READ(fd, buffer, BUFFER_SIZE)) > 0) {
		read_size += res_read_size;
	}
	if (res_read_size == -1) {
		read_size = -1;
	}
	close(fd);
	return read_size;
}

char		*read_file(char *filename) {
	int		content_length = strlen_file_content(filename);
	if (content_length < 1)
		return NULL;
	char	*content = malloc(sizeof(char) * (content_length + 1));
	if (!content)
		return NULL;
	content[content_length] = 0;

	int		fd = open(filename,  O_RDONLY);
	if (READ(fd, content, content_length) < 0)
		return NULL;
	close(fd);
	
	return content;
}
