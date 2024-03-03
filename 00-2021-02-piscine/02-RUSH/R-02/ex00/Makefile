# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alellouc <marvin@42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/02/20 08:46:41 by alellouc          #+#    #+#              #
#    Updated: 2021/02/28 15:52:34 by alellouc         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

CC=gcc
CFLAGS=-Wall -Werror -Wextra 
DEP_CFLAGS=-MM
RM=-rm -rf
NAME=rush-02
src=main.c ft_strings.c ft_errors.c ft_file.c ft_line.c algos_sort.c
obj=$(src:.c=.o)
dep=$(src:.c=.d)

.PHONY: all clean fclean re

all: $(NAME) 

$(NAME): $(obj)
	$(CC) $^ -o $@; chmod +x $@

%.o:%.c
	$(CC) -c $< $(CFLAGS) -o $@

%.d:%.c
	$(CC) $< $(DEP_CFLAGS) $(CFLAGS) -o $@

clean:
	$(RM) $(obj) $(dep)

fclean: clean
	$(RM) $(NAME)

re: fclean all

-include $(dep)
