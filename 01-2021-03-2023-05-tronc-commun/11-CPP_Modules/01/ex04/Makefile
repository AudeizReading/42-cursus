NAME = weaksed
TEST = filename
S1 = "chien"
S2 = "chat chat chat chat"

#------------------------------------------------------------------------------#
#                  COLORS                                                      # 
#------------------------------------------------------------------------------#
RED	= \033[1;31m
GRE	= \033[1;32m
YEL	= \033[1;33m
BLU	= \033[1;34m
MAG	= \033[1;35m
CYA	= \033[1;36m
NO_COL = \033[0m

##------------------------------------------------------------------------------#
#                  COMMANDS                                                    # 
#------------------------------------------------------------------------------#
CC = -clang++
ECHO = -printf
RM = -rm -rf
MAKE = -make -s --no-print-directory -i

CFLAGS = -Wall -Werror -Wextra -std=c++98 -pedantic -g -fsanitize=address
CHEADERS = -I .
LDFLAGS =	
ALL_FLAGS = $(CHEADERS) $(CFLAGS)

#------------------------------------------------------------------------------#
#                  FILES                                                       # 
#------------------------------------------------------------------------------#
SRCS = $(addsuffix .cpp, \
			main\
		 )

OBJ = $(SRCS:.cpp=.o)

#------------------------------------------------------------------------------#
#                  RULES                                                       # 
#------------------------------------------------------------------------------#
all: $(NAME)

$(NAME): $(OBJ)
	@$(ECHO) "$(GRE)"
	@$(ECHO) "linking object... %-29.29s\r" $^
	@$(ECHO) "producing exec... %-29.29s\r" $@
	@$(CC) $(ALL_FLAGS) $(LDFLAGS) $^ -o $@
	@$(ECHO) "\t\t\t\t\t\t\tdone.\r"
	@$(ECHO) "\n"
	@$(ECHO) "$(NO_COL)"

%.o: %.cpp
	@$(ECHO) "$(GRE)"
	@$(ECHO) "producing object... %-29.29s\r" $@
	@$(CC) $(ALL_FLAGS) -c $< -o $@
	@$(ECHO) "$(NO_COL)"

clean:
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting .o... %-29.29s\r" $(OBJ)
	@$(RM) $(OBJ)
	@$(ECHO) "$(NO_COL)"

fclean: clean 
	@$(ECHO) "$(RED)"
	@$(ECHO) "deleting exec... %-29.29s\r" $(NAME)
	@$(ECHO) "\n"
	@$(RM) $(NAME) $(NAME).dSYM
	@$(ECHO) "$(NO_COL)"

re: fclean all

test: re
	@echo "J'aime les chiens" > $(TEST)
	@echo "Les chiens, ça sent le chien." >> $(TEST)
	@echo "Chien échaudé craint l'eau froide." >> $(TEST)
	@echo "Quand le CHIEN n'est pas là, les souris dansent" >> $(TEST)
	@echo "chien perché" >> $(TEST)
	@echo "chien chien chien chien chien chien chien chien chien chiensssssssssssssssss" >> $(TEST)
	@cat $(TEST)
	@echo ""
	@./$(NAME) $(TEST) $(S1) $(S2)
	@cat $(TEST).replace
	@$(RM) $(TEST) $(TEST).replace

.PHONY: all clean fclean re 
