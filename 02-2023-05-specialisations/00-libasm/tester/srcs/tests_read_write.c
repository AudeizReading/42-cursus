#include "libasm_tester.h"

static t_bytes	read_write_file(int fd_in, int fd_out) {
	int		res_read_size = 0;
	int		res_write_size = 0;
	t_bytes	bytes = {0, 0, 0, 0};
	char	buffer[BUFFER_SIZE] = {0};

	while ((res_read_size = READ(fd_in, buffer, BUFFER_SIZE)) > 0) {
		bytes.read += res_read_size;
		if ((res_write_size = WRITE(fd_out, buffer, res_read_size)) < 0) {
			bytes._errno = errno;
			bytes.error_type = WRITE_ERROR;
			return bytes;
		}
		bytes.write += res_write_size;
		buffer[0] = 0;
	}
	if (res_read_size == -1) {
		bytes._errno = errno;
		bytes.error_type = READ_ERROR;
		return bytes;
	}
	return bytes;
}

/*
** filename: fichier depuis lequel lire
**
** Pour des raisons pratiques read et write sont testés en même temps
** Resultat:
** __FILE__:__LINE__:VERSION:VERSION_REAWRI:
** __FILE__:__LINE__:idx_test:errno:chaine_errno:error_read_ou_write:nb_bytes_lus:nb_bytes_ecrits:
*/

void		tests_read_and_write(char *filename) {
	int		fd_test = open(REAWRI_TEST_FILE, O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU|S_IRWXG|S_IRWXO);
	int		fd_outp = open(REAWRI_OUTP_FILE, O_WRONLY|O_CREAT|O_APPEND, S_IRWXU|S_IRWXG|S_IRWXO);
	int		fd = open(filename, O_RDONLY);
	if (fd_test == -1 || fd == -1)
		exit(1);
	// [0] => fd input		[1] => fd output (pour les tests on passe par un fichier pr output, mais ca fonctionne tres
	//								bien sur stdout aussi
	int		fds[][2] = {{fd, fd_outp}, {177, fd_outp}, {fd, 65536}};
	t_bytes	bytes = {0, 0, 0, 0};
	
	PRINT_TEST(fd_test, "%s%s:%s%s:\n", YELLOW_ALT, VERSION, VERSION_REAWRI, RESET);
	for (int i = 0; i < 4; i++) {
		errno = 0;
		bytes = read_write_file(fds[i][0], fds[i][1]);
		PRINT_TEST(fd_test, "%d:%d:%s:%d:%d:%d:\n", i + 1, bytes._errno, strerror(bytes._errno), bytes.error_type, bytes.read, bytes.write);
		bytes.read = bytes.write = bytes._errno = bytes.error_type = 0;
	}
	close(fd);
	close(fd_test);
	close(fd_outp);
}
