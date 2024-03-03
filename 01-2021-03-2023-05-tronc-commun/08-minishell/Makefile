NAME		=	minishell

#------------------------------------------------------------------------------#
#                  COLORS                                                      # 
#------------------------------------------------------------------------------#
RED			=	\033[1;31m
GRE			=	\033[1;32m
YEL			=	\033[1;33m
BLU			=	\033[1;34m
MAG			=	\033[1;35m
CYA			=	\033[1;36m
NO_COL		=	\033[0m

#------------------------------------------------------------------------------#
#                  LIBS PATH                                                   # 
#------------------------------------------------------------------------------#
LIBFT		=	libft
LIBFT_PATH	=	./$(LIBFT)

#------------------------------------------------------------------------------#
#                  COMMANDS                                                    # 
#------------------------------------------------------------------------------#
CC			=	-gcc
ECHO		=	-printf
RM			=	-rm -rf
MAKE		=	-make -s --no-print-directory -i

CFLAGS		=	-Wall -Werror -Wextra -g -static-libsan
CHEADERS	=	 -I ./include
LDFLAGS		=	-L$(LIBFT_PATH) -lft -lreadline -lncurses 
ALL_FLAGS	=	$(CHEADERS) $(CFLAGS)

#------------------------------------------------------------------------------#
#                  FILES                                                       # 
#------------------------------------------------------------------------------#
SRCS		= $(addprefix srcs/, $(addsuffix .c, \
			  builtins/cd\
			  builtins/echo\
			  builtins/env\
			  builtins/exit\
			  builtins/export\
			  builtins/parse_builtins\
			  builtins/pwd\
			  builtins/unset\
			  env/get_env\
			  env/path\
			  env/read_write_env\
			  env/set_env\
			  env/status\
			  env/unset_env\
			  env/utils_env\
			  errors\
			  executor\
			  fds\
			  lexer\
			  main\
			  parsing/args\
			  parsing/avoid_kill_ms\
			  parsing/cmd\
			  parsing/heredoc\
			  parsing/heredoc_2\
			  parsing/last_input_char\
			  parsing/parser\
			  parsing/quotes_1\
			  parsing/redir\
			  parsing/special_chars\
			  parsing/token\
			  parsing/token_pipes\
			  parsing/token_redir\
			  parsing/token_redir_last_pos\
			  parsing/token_redir_type\
			  parsing/word\
			  prompt\
			  redir\
			  signals\
			  terminal\
			  utils/cd_1\
			  utils/cd_2\
			  utils/cd_3\
			  utils/char_array_1\
			  utils/char_array_2\
			  utils/cmd_1\
			  utils/export\
			  utils/redir_1\
			  utils/signals\
			  utils/status_1\
			  utils/token_1\
			  ))

OBJ 		= $(SRCS:.c=.o)

#------------------------------------------------------------------------------#
#                  RULES                                                       # 
#------------------------------------------------------------------------------#
all: $(NAME)

$(NAME): $(OBJ)
	@$(MAKE) $(LIBFT)
	@$(ECHO) "$(GRE)"
	@$(ECHO) "linking object... %-31.31s\r" $^
	@$(ECHO) "producing exec... %-50.50s\r" $@
ifdef MACOS_CATALINA
	@$(CC) $(ALL_FLAGS) $(LDFLAGS) -L${HOME}/.brew/opt/readline/lib $^ -o $@
else
	@$(CC) $(ALL_FLAGS) $(LDFLAGS) -L${HOME}/.brew/opt/readline/lib -I ${HOME}/.brew/opt/readline/include $^ -o $@
endif
	@$(ECHO) "\t\t\t\t\t\t\tdone.\r"
	@$(ECHO) "\n"
	@$(ECHO) "$(NO_COL)"

$(LIBFT):
	@$(ECHO) "$(YEL)"
	@$(MAKE) -C $(LIBFT_PATH) all
	@$(ECHO) "$(NO_COL)"

%.o: %.c
	@$(ECHO) "$(GRE)"
	@$(ECHO) "producing object... %-31.31s\r" $@
	@$(CC) $(ALL_FLAGS) -I${HOME}/.brew/opt/readline/include -c $< -o $@
	@$(ECHO) "$(NO_COL)"

clean:
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting .o... %-31.31s\r" $(OBJ)
	@$(RM) $(OBJ)
	@$(ECHO) "$(NO_COL)"

libftclean: 
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting libft.a... %-31.31s\r" " "
	@$(RM) $(LIBFT_PATH)/libft.a
	@$(ECHO) "$(NO_COL)"

fclean: clean libftclean
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting exec... %-31.31s\r" $(NAME)
	@$(ECHO) "\n"
	@$(RM) $(NAME) $(NAME).dSYM
	@$(ECHO) "$(NO_COL)"

fclean-debug: fclean
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting dSYM... %-32.32s\r" $(NAME).dSYM
	@$(ECHO) "\n"
	@$(RM) $(NAME).dSYM debug.dSYM debug-child.dSYM debug-full.dSYM
	@$(ECHO) "$(NO_COL)"

re: fclean all

test: $(NAME)
	./$(NAME)

catalina:
	make MACOS_CATALINA=1 minishell
	make test

debug: $(OBJ)
	@$(MAKE) $(LIBFT)
	@$(ECHO) "$(GRE)"
	@$(ECHO) "linking object... %-21.14s\r" $^
	@$(ECHO) "producing exec... %-50.50s\r" $(NAME)
	@$(CC) $(LDFLAGS) -L${HOME}/.brew/opt/readline/lib $^ -o $(NAME)
	@$(ECHO) "\t\t\t\t\tdone.\r"
	@$(ECHO) "\n"
	@$(ECHO) "$(NO_COL)"
	valgrind ./$(NAME)
	@$(MAKE) fclean-debug

debug-full: $(OBJ)
	@$(MAKE) $(LIBFT)
	@$(ECHO) "$(GRE)"
	@$(ECHO) "linking object... %-21.14s\r" $^
	@$(ECHO) "producing exec... %-50.50s\r" $(NAME)
	@$(CC) $(LDFLAGS) -L${HOME}/.brew/opt/readline/lib $^ -o $(NAME) 
	@$(ECHO) "\t\t\t\t\tdone.\r"
	@$(ECHO) "\n"
	@$(ECHO) "$(NO_COL)"
	valgrind --leak-check=full ./$(NAME)
	@$(MAKE) fclean-debug

debug-child: $(OBJ)
	@$(MAKE) $(LIBFT)
	@$(ECHO) "$(GRE)"
	@$(ECHO) "linking object... %-21.14s\r" $^
	@$(ECHO) "producing exec... %-50.50s\r" $(NAME)
	@$(CC) $(LDFLAGS) -L${HOME}/.brew/opt/readline/lib $^ -o $(NAME) 
	@$(ECHO) "\t\t\t\t\tdone.\r"
	@$(ECHO) "\n"
	@$(ECHO) "$(NO_COL)"
	valgrind --trace-children=yes --leak-check=full ./$(NAME)
	@$(MAKE) fclean-debug

.PHONY: all $(LIBFT) clean libftclean fclean re test catalina debug debug-full debug-child
