NAME 			= ft_containers

#------------------------------------------------------------------------------#
#                  COLORS                                                      # 
#------------------------------------------------------------------------------#
RED				= \033[1;31m
GRE				= \033[1;32m
YEL				= \033[1;33m
BLU				= \033[1;34m
MAG				= \033[1;35m
CYA				= \033[1;36m
NO_COL 			= \033[0m

#------------------------------------------------------------------------------#
#                  COMMANDS                                                    # 
#------------------------------------------------------------------------------#
CC        		= clang++
ECHO      		= printf
RM        		= rm -rf
MAKE      		= make -s --no-print-directory -i

CFLAGS    		= -Wall -Werror -Wextra -std=c++98 -pedantic -g
#CFLAGS   		= -Wall -Werror -Wextra -std=c++98 -pedantic -g -fsanitize=address
CMACROS	  		= -DNO_MLI
CHEADERS  		= -I . -I tests/ -I tests/srcs -I iterators/ -I containers/ -I functors/ -I algorithms/ -I utilities/ -I binary_trees/
LDFLAGS   		= -L . -L tests/ -L tests/srcs -L iterators/ -L containers/ -L functors/ -L algorithms/ -L utilities/ -L binary_trees/
ALL_FLAGS 		= $(CHEADERS) $(CFLAGS) $(CMACROS)

#------------------------------------------------------------------------------#
#                  FILES                                                       # 
#------------------------------------------------------------------------------#
TESTS			= tests/
TESTS_SRCS		= $(TESTS)srcs/

TESTS_VEC_SRCS 	= $(addprefix $(TESTS_SRCS), $(addsuffix .cpp,\
				 		tests_vector\
				 	))

TESTS_STK_SRCS 	= $(addprefix $(TESTS_SRCS), $(addsuffix .cpp,\
				 		tests_stack\
				 	))

TESTS_TMF_SRCS 	= $(addprefix $(TESTS_SRCS), $(addsuffix .cpp,\
				 		check_time\
				 	))

TESTS_MAP_SRCS 	= $(addprefix $(TESTS_SRCS), $(addsuffix .cpp,\
				 		tests_map\
				 	))

TESTS_42	   	= $(addprefix $(TESTS_SRCS), $(addsuffix .cpp,\
				 		tests_42\
				 	))

CHECK_LKS_SRCS 	= $(addprefix $(TESTS_SRCS), $(addsuffix .cpp,\
				 		check_leaks\
				 	))

SRCS    		= $(addsuffix .cpp, \
						binary_trees/NodeBTImpl\
						binary_trees/RBT\
						iterators/RBTIterators\
						$(TESTS_SRCS)timer_utils\
		 			)

CONTS_H 		= $(addprefix containers/, $(addsuffix .hpp, \
		  				map\
	   					stack\
						vector\
					))

ITERS_H 		= $(addprefix iterators/, $(addsuffix .hpp, \
						concrete_iterator\
						iterator_functions\
						iterator_types\
						reverse_iterator\
					))

FUNCS_H 		= $(addprefix functors/, $(addsuffix .hpp, \
						functional\
					))

ALGOS_H 		= $(addprefix algorithms/, $(addsuffix .hpp, \
	   					algorithm\
					))

TESTS_H 		= $(addprefix $(TESTS_SRCS), $(addsuffix .hpp, \
				 		check_time\
				  		display_std_map\
				  		display_utils\
				 		tests_42\
						tests_containers_utils\
						tests_map\
						tests_stack\
						tests_vector\
						timer_utils\
						utils\
					))

UTILS_H 		= $(addprefix utilities/, $(addsuffix .hpp, \
		  				bitwise_manipulation\
						type_traits\
						utility\
					))

BINTS_H 		= $(addprefix binary_trees/, $(addsuffix .hpp, \
				  		RBT\
					))

HDRS    		= 	${ALGOS_H} \
		  			${CONTS_H} \
		  			${ITERS_H} \
		  			${FUNCS_H} \
		  			${BINTS_H} \
		  			${TESTS_H}

#------------------------------------------------------------------------------#
#                  TESTS SETTINGS                                              # 
#------------------------------------------------------------------------------#

# script for making diff (if invoked directly in Makefile, if diff returns
# anything else than 0, make exits... we have to hack this behavior by putting
# instr in a shell script
OUTPUT			= $(TESTS)outputs/
DEEP			= $(OUTPUT)deepthought/deepthought.
LOG				= $(OUTPUT)logs/
SCRIPT			= $(TESTS)scripts/

LOG_EXT			= .out
DIFF_EXT		= .diff$(LOG_EXT)

DIFF_FILE		= $(DEEP)$(RADIX)$(DIFF_EXT)
DIFF_TIME_FILE	= $(DEEP)$(RADIX)_time$(DIFF_EXT)
DIFF_D_TIME_FILE= $(DEEP)$(RADIX)_detail_time$(DIFF_EXT)
# modif ici le path des logs files et la casse des namespaces
TREE_FILE		= $(LOG)FT_$(RADIX)_red_black_tree$(LOG_EXT)
LOG_FILE		= $(LOG)FT_$(RADIX)_compare$(LOG_EXT)
LOG_STD_FILE	= $(LOG)STD_$(RADIX)_compare$(LOG_EXT)
TIME_FILE		= $(LOG)FT_$(RADIX)_time$(LOG_EXT)
TIME_STD_FILE	= $(LOG)STD_$(RADIX)_time$(LOG_EXT)
D_TIME_FILE		= $(LOG)FT_$(RADIX)_detail_time$(LOG_EXT)
D_TIME_STD_FILE	= $(LOG)STD_$(RADIX)_detail_time$(LOG_EXT)
TMFLOG			= $(DEEP)_tmflog_general_$(LOG_EXT)

DIFF_TEST		= $(SCRIPT)/diff.sh

# define the C macros STD needed for making a std programme to compare with my
# ft program
ifdef CMP
	CMACROS 	+= -DSTD
else
	CMACROS		= -DNO_MLI
endif

# this is the main given by 42 
ifdef T42
	OBJ    		+= $(SRCS:.cpp=.o) 
	OBJ    		+= $(TESTS_42:.cpp=.o) 
	RADIX		= t42
	SEED		= 42
endif

ifdef MAP
	OBJ    		+= $(SRCS:.cpp=.o) 
	OBJ    		+= $(TESTS_MAP_SRCS:.cpp=.o) 
	RADIX		= map
endif

ifdef VEC
	OBJ    		+= $(SRCS:.cpp=.o) 
	OBJ    		+= $(TESTS_VEC_SRCS:.cpp=.o) 
	RADIX		= vec
endif

ifdef STK
	OBJ    		+= $(SRCS:.cpp=.o) 
	OBJ    		+= $(TESTS_STK_SRCS:.cpp=.o) 
	RADIX		= stk
endif

ifdef LKS
	OBJ    		+= $(SRCS:.cpp=.o) 
	OBJ    		+= $(CHECK_LKS_SRCS:.cpp=.o) 
	RADIX		= lks
	SEED		= 42424242
endif

ifdef TMF
	OBJ    		+= $(SRCS:.cpp=.o) 
	OBJ    		+= $(TESTS_TMF_SRCS:.cpp=.o) 
	RADIX		= tmf
endif

#------------------------------------------------------------------------------#
#                  RULES                                                       # 
#------------------------------------------------------------------------------#
.PHONY: all clean fclean re map cmp_map vec cmp_vec stk cmp_stk t42 cmp_t42 diff log_ft_seed log_std_seed log_ft log_std tester valgrind treefile timefile tmf lks big_fclean prune

#all: $(NAME)
all: t42

# test rules
#
# make log_ft MAP=1			-> version ft (config les noms des fichiers pour test map)
# make log_std MAP=1		-> version std (config les noms des fichiers pour test map version librairie standard)
# make log_ft_seed T42=1	-> version ft (config les noms des fichiers pour test 42 qui a besoin de passer un arg au programme)
# make log_std_seed T42=1	-> version std
# make map 					-> version ft
# make map CMP=1 			-> version std
# make fclean MAP=1			-> efface les fichiers sources lies a la compil de map
tester:
	@make prune
	@make cmp_stk
	@make cmp_t42
	@make cmp_vec
	@make cmp_map
	@make valgrind LKS=1

diff:
	@./$(DIFF_TEST) $(LOG_FILE) $(LOG_STD_FILE) $(DIFF_FILE)
	@./$(DIFF_TEST) $(D_TIME_FILE) $(D_TIME_STD_FILE) $(DIFF_D_TIME_FILE)
	@./$(DIFF_TEST) $(TIME_FILE) $(TIME_STD_FILE) $(DIFF_TIME_FILE)
	@cat $(DIFF_FILE) $(DIFF_TIME_FILE)
#	@$(RM) $(DIFF_D_TIME_FILE) $(DIFF_FILE) $(DIFF_TIME_FILE)

valgrind:
	@make lks
	@valgrind ./$(NAME) $(SEED)

log_ft:
	@time (./$(NAME))
	@cat $(TIME_FILE) >> $(TMFLOG)
#	You don't want this, believe me
#	@cat $(LOG_FILE) 

log_std:
	@time (./$(NAME))
	@cat $(TIME_STD_FILE) >> $(TMFLOG)
#	You don't want this, believe me
#	@cat $(LOG_STD_FILE) 

log_ft_seed:
	@time (./$(NAME) $(SEED))
	@cat $(TIME_FILE) >> $(TMFLOG)
#	You don't want this, believe me
#	@cat $(LOG_FILE) 

log_std_seed:
	@time (./$(NAME) $(SEED))
	@cat $(TIME_STD_FILE) >> $(TMFLOG)
#	You don't want this, believe me
#	@cat $(LOG_STD_FILE) 

treefile:
	@cat $(TREE_FILE)

timefile:
	@cat $(TMFLOG)

tmf:
	@make timefile
	@make $(NAME) TMF=1
	./$(NAME)
	@make fclean TMF=1

map:
	@make $(NAME) MAP=1 

cmp_map: 
	@make fclean MAP=1
	@make map
	@make log_ft MAP=1
	@make fclean MAP=1
	@make map CMP=1
	@make log_std MAP=1
	@make diff MAP=1
	@make fclean MAP=1

vec:
	@make $(NAME) VEC=1 

cmp_vec: 
	@make fclean VEC=1
	@make vec
	@make log_ft VEC=1
	@make fclean VEC=1
	@make vec CMP=1
	@make log_std VEC=1
	@make diff VEC=1
	@make fclean VEC=1

stk:
	@make $(NAME) STK=1 

cmp_stk: 
	@make fclean STK=1
	@make stk
	@make log_ft STK=1
	@make fclean STK=1
	@make stk CMP=1
	@make log_std STK=1
	@make diff STK=1
	@make fclean STK=1
	@make treefile STK=1

t42:
	@make $(NAME) T42=1

cmp_t42: 
	@make fclean T42=1
	@make t42
	@make log_ft_seed T42=1
	@make fclean T42=1
	@make t42 CMP=1
	@make log_std_seed T42=1
	@make diff T42=1
	@make fclean T42=1

lks: big_fclean
	@make $(NAME) LKS=1

# mandatory rules
$(NAME): $(OBJ) $(HDRS)
	@$(ECHO) "$(GRE)"
	@$(ECHO) "linking object... %-29.29s\r" $^
	@$(ECHO) "producing exec... %-29.29s\r" $@
	@$(CC) $(ALL_FLAGS) $(LDFLAGS) $(OBJ) -o $@
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

big_fclean:
	@make fclean T42=1 STK=1 VEC=1 MAP=1 LKS=1 TMF=1

prune: big_fclean
	@$(RM) $(OUTPUT){logs/*.out,deepthought/*.out} $(TESTS_SRCS)*.o
