CC=-/bin/gcc
AR=-/bin/ar crs
RM=-/bin/rm -rf
CFLAGS=-Wall -Wextra -Werror
CHEADERS=-I includes
SRC=$(addprefix srcs/, $(addsuffix .c, ft_putchar ft_swap ft_putstr ft_strlen ft_strcmp))
OBJ=$(notdir $(SRC:.c=.o))
NAME=libft.a

.PHONY: clean fclean re all 

all: $(NAME)

$(NAME): $(SRC)
	$(CC) $(HEADERS) $(CFLAGS) -c $^
	$(AR) $@ $(OBJ)
	$(RM) $(OBJ)

clean:
	$(RM) $(OBJ)

fclean: clean
	$(RM) $(NAME)

re: fclean all
