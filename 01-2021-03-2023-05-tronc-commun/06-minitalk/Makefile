# -----------------------------------------------------------------------------
#                            TO-DO LIST
# -----------------------------------------------------------------------------
#  * bonus rule, adding it into all ?
#  * sani rule
#  * test rule
#  * debug rule & debug-full rule
#  *
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
ECHO=-echo
RM=-rm -rf
MAKE=make

CFLAGS=-Wall -Werror -Wextra
CHEADERS= -I ./includes
ALL_FLAGS= $(CHEADERS) $(CFLAGS)

# -----------------------------------------------------------------------------
#                                  FILES
# -----------------------------------------------------------------------------
SRCS_CLT=$(addprefix srcs/, $(addsuffix .c, \
	 client\
	 utils\
	 ))
SRCS_SRV= $(addprefix srcs/, $(addsuffix .c, \
	 server\
	 utils\
	 ))

SRCS_BONUS_CLT=$(addprefix srcs/, $(addsuffix _bonus.c, \
	 client\
	 utils\
	 ))
SRCS_BONUS_SRV= $(addprefix srcs/, $(addsuffix _bonus.c, \
	 server\
	 utils\
	 ))

ifdef BONUS
	OBJ_SRV=$(SRCS_BONUS_SRV:.c=.o)
	OBJ_CLT=$(SRCS_BONUS_CLT:.c=.o)
else
	OBJ_SRV=$(SRCS_SRV:.c=.o)
	OBJ_CLT=$(SRCS_CLT:.c=.o)
endif

NAME=minitalk
CLIENT=client
SERVER=server

# -----------------------------------------------------------------------------
#                            RULES
# -----------------------------------------------------------------------------
.PHONY: all clean fclean re $(NAME) bonus

all: $(NAME)

$(NAME): server client

bonus:
	@make BONUS=1 $(NAME)

client: $(OBJ_CLT)
	@$(ECHO) "$(GRE)"
	$(CC) $(LDFLAGS) $^ -o $@
	@$(ECHO) "$(NO_COL)"

server: $(OBJ_SRV)
	@$(ECHO) "$(GRE)"
	$(CC) $(LDFLAGS) $^ -o $@
	@$(ECHO) "$(NO_COL)"

%.o: %.c
	@$(ECHO) "$(GRE)"
	$(CC) $(ALL_FLAGS) -c $< -o $@
	@$(ECHO) "$(NO_COL)"

clean:
	@$(ECHO) "$(RED)"
	$(RM) $(OBJ_CLT) $(OBJ_SRV)
	@$(ECHO) "$(NO_COL)"

fclean: clean
	@$(ECHO) "$(RED)"
	$(RM) $(SERVER) $(CLIENT)
	@$(ECHO) "$(NO_COL)"

re: fclean all
