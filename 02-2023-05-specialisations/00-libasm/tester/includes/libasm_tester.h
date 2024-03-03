#ifndef LIBASM_TESTER_H
# define LIBASM_TESTER_H

# include <stdio.h>
# include <string.h>
# include <stdlib.h>
# include <sys/fcntl.h>
# include <unistd.h>
# include <errno.h>
# include <fcntl.h>
# include <stdarg.h>
# include <limits.h>
# include <assert.h>
# include <ctype.h>
# include <sys/types.h>
# include <sys/stat.h>

# define BUFFER_SIZE				4096

# define RED						"\033[31m"
# define RED_ALT					"\033[31;1m"
# define GREEN						"\033[32m"
# define GREEN_ALT					"\033[32;1m"
# define YELLOW						"\033[33m"
# define YELLOW_ALT					"\033[33;1m"
# define BLUE						"\033[34m"
# define BLUE_ALT					"\033[34;1m"
# define MAGENTA					"\033[35m"
# define MAGENTA_ALT				"\033[35;1m"
# define CYAN						"\033[36m"
# define CYAN_ALT					"\033[36;1m"
# define GREY						"\033[35m"
# define GREY_ALT					"\033[35;1m"
# define WHITE						"\033[36m"
# define WHITE_ALT					"\033[36;1m"
# define RESET						"\033[0m"

# define CONCAT_NX(s1, s2)			s1 s2
# define CONCAT(s1, s2)				CONCAT_NX(s1, s2)
# define STRINGIFY(x)				#x
# define EXPAND_STRINGIFY(x)		STRINGIFY(x)

# define _FILE_DATAS_FORMAT			"%s:%d:"
# ifdef BONUS
#  define FILE_DATAS_FORMAT			CYAN_ALT _FILE_DATAS_FORMAT RESET
# else
#  define FILE_DATAS_FORMAT			MAGENTA_ALT _FILE_DATAS_FORMAT RESET
# endif // BONUS

# define DPRINTF(fd, str, args...)	dprintf(fd, str, args);
# define PRINT_TEST(fd, s, args...)	DPRINTF(fd, CONCAT(FILE_DATAS_FORMAT, s), __FILE__, __LINE__, args)

# ifdef	PHASE_TWO
#  ifdef BONUS
#   define COLOR_RES					CYAN_ALT
#  else
#   define COLOR_RES					MAGENTA_ALT
#  endif // BONUS
#  define RES_FORMAT					"%3d."	COLOR_RES " %-35s" RESET ":\t%s"
#  define PRINT_RES(id, name, res, s, args...)	printf(CONCAT(RES_FORMAT, s), id, name, res, args)
# endif //PHASE_TWO

# define OK							GREEN_ALT "[OK]" RESET
# define KO							RED_ALT "[KO]" RESET

# define TEST_ASSETS_DIR			"./tester/assets/"
# define TEST_FT_OUTPUTS_DIR		TEST_ASSETS_DIR "ft_outputs/"
# define TEST_REGULAR_OUTPUTS_DIR	TEST_ASSETS_DIR "regular_outputs/"
# define TEST_RESULT_DIR			TEST_ASSETS_DIR "results/"
# define TEST_MISC_DIR				TEST_ASSETS_DIR "misc/"
# define OUTPUT_EXT					".output"
# define TEST_STRLEN_NAME			"strlen" OUTPUT_EXT
# define TEST_STRCPY_NAME			"strcpy" OUTPUT_EXT
# define TEST_STRCMP_NAME			"strcmp" OUTPUT_EXT
# define TEST_STRDUP_NAME			"strdup" OUTPUT_EXT
# define TEST_REAWRI_NAME			"reawri" OUTPUT_EXT
# define TEST_OUTPUT_NAME			"reawri-output" OUTPUT_EXT
# define TEST_LEAKS_NAME			"leaks" OUTPUT_EXT
# ifdef BONUS
# define TEST_PUSHFL_NAME			"pushfl" OUTPUT_EXT
#  define TEST_SIZELL_NAME			"sizell" OUTPUT_EXT
#  define TEST_SORTLL_NAME			"sortll" OUTPUT_EXT
#  define TEST_REMVLL_NAME			"remvll" OUTPUT_EXT
#  define TEST_ATOI_B_NAME			"atoi_b" OUTPUT_EXT
# endif // BONUS

# ifdef LIBASM
#  define OUTPUT_PATH				TEST_FT_OUTPUTS_DIR
# else
#  define OUTPUT_PATH				TEST_REGULAR_OUTPUTS_DIR
# endif //LIBASM

# define FILE_TITLE					TEST_MISC_DIR "title.ascii"

# define FILE_TEST_WRITE			TEST_MISC_DIR "lorem_ipsum_65536.txt"
# define REAWRI_OUTP_FILE			OUTPUT_PATH TEST_OUTPUT_NAME
# define STRLEN_TEST_FILE			OUTPUT_PATH TEST_STRLEN_NAME
# define STRCPY_TEST_FILE			OUTPUT_PATH TEST_STRCPY_NAME
# define STRCMP_TEST_FILE			OUTPUT_PATH TEST_STRCMP_NAME
# define STRDUP_TEST_FILE			OUTPUT_PATH TEST_STRDUP_NAME
# define REAWRI_TEST_FILE			OUTPUT_PATH TEST_REAWRI_NAME

# ifdef BONUS
#  define PUSHFL_TEST_FILE			OUTPUT_PATH TEST_PUSHFL_NAME
#  define SIZELL_TEST_FILE			OUTPUT_PATH TEST_SIZELL_NAME
#  define SORTLL_TEST_FILE			OUTPUT_PATH TEST_SORTLL_NAME
#  define REMVLL_TEST_FILE			OUTPUT_PATH TEST_REMVLL_NAME
#  define ATOI_B_TEST_FILE			OUTPUT_PATH TEST_ATOI_B_NAME
# endif // BONUS

# ifdef PHASE_TWO
#  define REG_STRLEN				TEST_REGULAR_OUTPUTS_DIR TEST_STRLEN_NAME
#  define REG_STRCPY				TEST_REGULAR_OUTPUTS_DIR TEST_STRCPY_NAME
#  define REG_STRCMP				TEST_REGULAR_OUTPUTS_DIR TEST_STRCMP_NAME
#  define REG_STRDUP				TEST_REGULAR_OUTPUTS_DIR TEST_STRDUP_NAME
#  define REG_REAWRI				TEST_REGULAR_OUTPUTS_DIR TEST_REAWRI_NAME
#  define REG_OUTPRW				TEST_REGULAR_OUTPUTS_DIR TEST_OUTPUT_NAME
#  define REG_LEAKS					TEST_REGULAR_OUTPUTS_DIR TEST_LEAKS_NAME
#  define FT_STRLEN					TEST_FT_OUTPUTS_DIR TEST_STRLEN_NAME
#  define FT_STRCPY					TEST_FT_OUTPUTS_DIR TEST_STRCPY_NAME
#  define FT_STRCMP					TEST_FT_OUTPUTS_DIR TEST_STRCMP_NAME
#  define FT_STRDUP					TEST_FT_OUTPUTS_DIR TEST_STRDUP_NAME
#  define FT_REAWRI					TEST_FT_OUTPUTS_DIR TEST_REAWRI_NAME
#  define FT_OUTPRW					TEST_FT_OUTPUTS_DIR TEST_OUTPUT_NAME
#  define FT_LEAKS					TEST_FT_OUTPUTS_DIR TEST_LEAKS_NAME
#  ifdef BONUS
#   define REG_PUSHFL				TEST_REGULAR_OUTPUTS_DIR TEST_PUSHFL_NAME
#   define REG_SIZELL				TEST_REGULAR_OUTPUTS_DIR TEST_SIZELL_NAME
#   define REG_SORTLL				TEST_REGULAR_OUTPUTS_DIR TEST_SORTLL_NAME
#   define REG_REMVLL				TEST_REGULAR_OUTPUTS_DIR TEST_REMVLL_NAME
#   define REG_ATOI_B				TEST_REGULAR_OUTPUTS_DIR TEST_ATOI_B_NAME
#   define FT_PUSHFL				TEST_FT_OUTPUTS_DIR TEST_PUSHFL_NAME
#   define FT_SIZELL				TEST_FT_OUTPUTS_DIR TEST_SIZELL_NAME
#   define FT_SORTLL				TEST_FT_OUTPUTS_DIR TEST_SORTLL_NAME
#   define FT_REMVLL				TEST_FT_OUTPUTS_DIR TEST_REMVLL_NAME
#   define FT_ATOI_B				TEST_FT_OUTPUTS_DIR TEST_ATOI_B_NAME
#  endif // BONUS
# endif // PHASE_TWO

enum e_functions {
	TEST_STRLEN,
	TEST_STRCPY,
	TEST_STRCMP,
	TEST_STRDUP,
	TEST_READ,
	TEST_WRITE,
	TEST_ATOI_BASE,
	TEST_FT_LIST_PUSH_FRONT,
	TEST_FT_LIST_SIZE,
	TEST_FT_LIST_REMOVE_IF,
	TEST_FT_LIST_SORT,
	TEST_LEAKS
}; // e_functions

enum e_errors {
	NO_ERROR,
	READ_ERROR,
	WRITE_ERROR,
}; // e_errors

typedef struct	s_bytes {
	int	read;
	int write;
	int _errno;
	int error_type;
}				t_bytes;

extern	size_t						ft_strlen(const char *s);
extern	char						*ft_strcpy(char *dst, const char *src);
extern	int							ft_strcmp(const char *s1, const char *s2);
extern	char						*ft_strdup(const char *s);
extern	ssize_t						ft_write(int fildes, const void *buffer, size_t iovcnt);
extern	ssize_t						ft_read(int fildes, const void *buffer, size_t iovcnt);

char								**ft_split(char const *s, char c);
char								*ft_substr(char const *s, unsigned int start, size_t len);
char								*read_file(char *filename);
void								tests_strlen(char **strs);
void								tests_strcpy(char **strs);
void								tests_strcmp(char **strs1, char **strs2);
void								tests_strdup(char **strs);
void								tests_read_and_write(char *filename);
void								select_test(enum e_functions type_test, ...);
int									compare_files(enum e_functions type_test, ...);
void								ft_free_char_array(char **arr);

# ifdef LIBASM // On utilise les fn de libasm
#  define STRLEN(s)					ft_strlen(s)
#  define STRCPY(dst, src)			ft_strcpy(dst, src)
#  define STRCMP(s1, s2)			ft_strcmp(s1, s2)
#  define _STRCMP					ft_strcmp
#  define STRDUP(s)					ft_strdup(s)
#  define READ(x, y, z)				ft_read(x, y, z)
#  define WRITE(x, y, z)			ft_write(x, y, z)
#  define VERSION					"ft_version"
#  define VERSION_STRLEN			"----- FT_STRLEN ------------------------"
#  define VERSION_STRCPY			"----- FT_STRCPY ------------------------"
#  define VERSION_STRCMP			"----- FT_STRCMP ------------------------"
#  define VERSION_STRDUP			"----- FT_STRDUP ------------------------"
#  define VERSION_REAWRI			"----- FT_READ / FT_WRITE ---------------"
#  define VERSION_READ  			"----- FT_READ --------------------------"
#  define VERSION_WRITE  			"----- FT_WRITE -------------------------"
# else // On utilise les fonctions C, de la lib standard qd c'est possible, sinon recodees
#  define STRLEN(s)					strlen(s)
#  define STRCPY(dst, src)			strcpy(dst, src)
#  define STRCMP(s1, s2)			strcmp(s1, s2)
#  define _STRCMP					strcmp
#  define STRDUP(s)					strdup(s)
#  define READ(x, y, z)				read(x, y, z)
#  define WRITE(x, y, z)			write(x, y, z)
#  define VERSION					"regular_version"
#  define VERSION_STRLEN			"-------- STRLEN ------------------------"
#  define VERSION_STRCPY			"-------- STRCPY ------------------------"
#  define VERSION_STRCMP			"-------- STRCMP ------------------------"
#  define VERSION_STRDUP			"-------- STRDUP ------------------------"
#  define VERSION_REAWRI			"-----    READ /    WRITE ---------------"
#  define VERSION_READ  			"-----    READ --------------------------"
#  define VERSION_WRITE  			"-----    WRITE -------------------------"
# endif // LIBASM

# ifdef BONUS

typedef struct						s_list {
	void			*data;
	struct s_list	*next;
}									t_list;

t_list								*ft_create_elem(void *data);
void								tests_atoi_base();
void								tests_ft_list_push_front(t_list **begin, char *str_to_split);
void								tests_ft_list_size(t_list **begin);
void								tests_ft_list_sort(t_list **begin, char *str_to_split);
void								tests_ft_list_remove_if(t_list **begin);

#  ifdef LIBASM	// On utilise les fns de libasm
# define VERSION_ATOI_B				"----- FT_ATOI_BASE - ASSEMBLY ----------"
# define VERSION_PUSH_L  			"----- FT_LIST_PUSH - ASSEMBLY ----------"
# define VERSION_SIZE_L  			"----- FT_LIST_SIZE - ASSEMBLY ----------"
# define VERSION_SORT_L  			"----- FT_LIST_SORT - ASSEMBLY ----------"
# define VERSION_REMO_L  			"----- FT_LIST_REMOVE_IF - ASSEMBLY -----"
extern	int							ft_atoi_base(char *str, char *base);
extern	void						ft_list_push_front(t_list **begin_list, void *data);
extern	int							ft_list_size(t_list *begin_list);
extern	void						ft_list_sort(t_list **begin_list, int (*cmp)());
extern	void						ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)(), void (*free_fn)(void *));
#  else	// On utilise les fns de tester/srcs
# define VERSION_ATOI_B				"----- FT_ATOI_BASE - C FUNCTION --------"
# define VERSION_PUSH_L  			"----- FT_LIST_PUSH - C FUNCTION --------"
# define VERSION_SIZE_L  			"----- FT_LIST_SIZE - C FUNCTION --------"
# define VERSION_SORT_L  			"----- FT_LIST_SORT - C FUNCTION --------"
# define VERSION_REMO_L  			"----- FT_LIST_REMOVE_IF - C FUNCTION ---"
int									ft_atoi_base(char *str, char *base);
void								ft_list_push_front(t_list **begin_list, void *data);
int									ft_list_size(t_list *begin_list);
void								ft_list_sort(t_list **begin_list, int (*cmp)());
void								ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)(), void (*free_fn)(void *));
#  endif // LIBASM
# endif // BONUS
#endif // LIBASM_TESTER_H
