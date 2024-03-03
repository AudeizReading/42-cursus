# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alellouc <marvin@42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/03/23 08:35:31 by alellouc          #+#    #+#              #
#    Updated: 2021/08/11 21:19:03 by alellouc         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

ECHO=-echo
B_GREEN=\033[1;32m
B_RED=\033[1;31m
B_CYAN=\033[1;36m
FANCY_RESET=\033[0m
CC=-gcc
AR=-ar crs
RM=-rm -rf
MAKE=-make
CFLAGS=-Wall -Wextra -Werror
CHEADERS=-I .
SRC=$(addsuffix .c,\
	get_next_line\
	get_next_line_utils\
	)
OBJ=$(SRC:.c=.o)
NAME=libgnl.a

.PHONY: clean fclean re all

all: $(NAME)

$(NAME): $(SRC)
	@$(ECHO) "$(B_GREEN)"
	$(CC) $(CHEADERS) $(CFLAGS) -D BUFFER_SIZE=4096 -c $^
	@$(ECHO) "$(B_CYAN)"
	$(AR) $@ $(OBJ)
	@$(ECHO) "$(FANCY_RESET)"
	@$(MAKE) clean

clean:
	@$(ECHO) "$(B_RED)"
	$(RM) $(OBJ)
	@$(ECHO) "$(FANCY_RESET)"

fclean: clean
	@$(ECHO) "$(B_RED)"
	$(RM) $(NAME)
	@$(ECHO) "$(FANCY_RESET)"

re: fclean all
