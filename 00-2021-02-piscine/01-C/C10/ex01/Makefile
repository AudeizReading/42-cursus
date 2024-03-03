# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alellouc <marvin@42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/03/20 08:46:41 by alellouc          #+#    #+#              #
#    Updated: 2021/03/20 15:32:37 by alellouc         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

CC=gcc
CFLAGS=-Wall -Werror -Wextra
HFLAGS=-I .
RM=-rm -rf
NAME=cat
src=main.c
obj=$(src:.c=.o)

.PHONY: all clean fclean re

all: $(NAME)

$(NAME): $(obj)
	$(CC) $^ -o $@; chmod +x $@

%.o:%.c
	$(CC) -c $< $(CFLAGS) $(HFLAGS) -o $@

clean:
	$(RM) $(obj) $(dep)

fclean: clean
	$(RM) $(NAME)

re: fclean all
