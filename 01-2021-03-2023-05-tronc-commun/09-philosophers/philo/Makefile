# -----------------------------------------------------------------------------
#                            COLORS
# -----------------------------------------------------------------------------
RED=\033[1;31m
GRE=\033[1;32m
YEL=\033[1;33m
BLU=\033[1;34m
MAG=\033[1;35m
CYA=\033[1;36m
NO_COL=\033[0m

# -----------------------------------------------------------------------------
#                            COMMANDS
# -----------------------------------------------------------------------------
CC=-gcc
ECHO=-printf
RM=-rm -rf
MAKE=make -s 

CFLAGS=-Wall -Werror -Wextra
CHEADERS= -I ./include
LDFLAGS= -lpthread
ALL_FLAGS= $(CHEADERS) $(CFLAGS)

# -----------------------------------------------------------------------------
#                                  FILES
# -----------------------------------------------------------------------------
SRCS=$(addprefix srcs/, $(addsuffix .c, \
	 args\
	 death_threads\
	 init\
	 main\
	 philos_threads\
	 utils\
	 ))

OBJ=$(SRCS:.c=.o)
NAME=philo

# -----------------------------------------------------------------------------
#                            RULES
# -----------------------------------------------------------------------------
.PHONY: all clean fclean re leaks

all: $(NAME)

$(NAME): $(OBJ)
	@$(ECHO) "$(GRE)"
	@$(ECHO) "linking object... %-31.31s\r" $^
	@sleep 0.3
	@$(ECHO) "producing exec... %-50.50s\r" $@
	@$(CC) $(CLFAGS) $(LDFLAGS) $^ -o $@
	@$(ECHO) "\t\t\t\t\t\t\tdone.\r"
	@$(ECHO) "\n"
	@$(ECHO) "$(NO_COL)"

%.o: %.c
	@$(ECHO) "$(GRE)"
	@$(ECHO) "producing object... %-31.31s\r" $@
	@sleep 0.1
	@$(CC) $(ALL_FLAGS) -c $< -o $@
	@$(ECHO) "$(NO_COL)"

clean:
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting .o... %-31.31s\r" $(OBJ)
	@sleep 0.5
	@$(RM) $(OBJ)
	@$(ECHO) "$(NO_COL)"

fclean: clean
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting exec... %-31.31s\r" $(NAME)
	@sleep 0.5
	@$(ECHO) "\n"
	@$(RM) $(NAME)
	@$(ECHO) "$(NO_COL)"

re: fclean all
