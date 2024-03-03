################################################################################
#                                                                              #
#                                COMMANDES                                     #
#                                                                              #
################################################################################

red = \033[1;31m
gre = \033[1;32m
yel = \033[1;33m
blu = \033[1;34m
mag = \033[1;35m
cya = \033[1;36m
raz = \033[0m

arch = $(shell uname)
author = alellouc
campus = 42 Nice
as = nasm
cc = gcc
rm = rm -rf
ar = ar
echo = printf
make = make -s --no-print-directory -i

warning_options = -Wall -Werror
debug_options = -g
compil_options = -Wall -Werror -Wextra
archive_options = crs

ifeq (${arch},Darwin)
	format := -f macho64 -D MACOSX
OS := -D MACOSX
else
	format := -f elf64 -D LINUX 
OS := -D LINUX
endif

################################################################################
#                                                                              #
#                                  FILES                                       #
#                                                                              #
################################################################################

NAME = libasm.a
TESTER = libasm_tester
SRCS = $(addprefix ft_, $(addsuffix .s, \
			strlen\
			strcpy\
			strcmp\
			strdup\
			write\
			read\
	   ))
OBJS = $(SRCS:.s=.o)

BONUS_SRCS = $(addprefix ft_, $(addsuffix _bonus.s, \
			atoi_base\
			list_push_front\
			list_size\
			list_sort\
			list_remove_if\
	   ))
BONUS_OBJS = $(BONUS_SRCS:.s=.o)

TEST_SRCS_PATH = tester/srcs/
TEST_SRCS_LL_PATH = tester/srcs/linked_list/
TEST_HDRS_PATH = tester/includes/
TEST_HDRS = $(addprefix $(TEST_HDRS_PATH), $(addsuffix .h, \
				libasm_tester\
			))
TEST_INCL_FLAGS = -I $(TEST_HDRS_PATH)
TEST_LD_FLAGS = -L $(TEST_HDRS_PATH) 
TEST_SRCS = $(addprefix $(TEST_SRCS_PATH), $(addsuffix .c, \
				tests_strlen\
				tests_strcpy\
				tests_strcmp\
				tests_strdup\
				tests_read_write\
				tests_ft_atoi_base\
				tests_ft_list_push_front\
				tests_ft_list_size\
				tests_ft_list_sort\
				tests_ft_list_remove_if\
				tests_maker\
				compare_file\
				main\
			)) $(addprefix $(TEST_SRCS_PATH)ft_, $(addsuffix .c, \
				split\
				atoi_base\
				read_file\
				free_char_array\
			)) $(addprefix $(TEST_SRCS_LL_PATH)ft_, $(addsuffix .c, \
				create_elem\
				list_push_front\
				list_size\
				list_sort\
				list_remove_if\
			))
TEST_OBJS = $(TEST_SRCS:.c=.o)

REG_OUTS = $(addprefix tester/assets/regular_outputs/, $(addsuffix .output, \
				reawri-output\
				reawri\
				strcmp\
				strcpy\
				strdup\
				strlen\
				leaks\
			))

FT_OUTS = $(addprefix tester/assets/ft_outputs/, $(addsuffix .output, \
				reawri-output\
				reawri\
				strcmp\
				strcpy\
				strdup\
				strlen\
				leaks\
			))

bonus_rule = all
regular_size=70
ifdef BONUS
	OBJS += $(BONUS_OBJS)
	compil_options += -DBONUS="\"C\'est la bonus party\""
ifeq (${arch},Darwin)
	compil_options += -Wno-deprecated-non-prototype
endif
	bonus_rule = bonus
	regular_size=200
	_bonus = bonus
REG_OUTS += $(addprefix tester/assets/regular_outputs/, $(addsuffix .output, \
				pushfl\
				sizell\
				sortll\
				remvll\
				atoi_b\
			))

FT_OUTS += $(addprefix tester/assets/ft_outputs/, $(addsuffix .output,\
				pushfl\
				sizell\
				sortll\
				remvll\
				atoi_b\
		   ))
endif
################################################################################
#                                                                              #
#                                  RULES                                       #
#                                                                              #
################################################################################

.PHONY: all clean clean_bonus fclean fclean_bonus re bonus test test_bonus fclean_test

all: $(NAME)

# $?: the name of all the prerequisites that are newer than the target with
# spaces between them, for archive members, only the named member is used (the
# part retrieved with $% or %)
$(NAME): $(OBJS)
	@$(echo) " *** Creating archive: \t\t$(gre)%30.30s$(raz)\n\t$(gre)%-$(regular_size).$(regular_size)s$(raz)\n\r" "$@ $(_bonus)" "$?"
	@$(ar) $(archive_options) $@ $?

# $(as): 					commande assembleur, ici nasm
# $(format): 				si Linux => elf64, si MACOSX => macho64
# $(warning_options):		-Wall -Werror (-Wextra does not work with nasm)
# $<						name of the first prerequisite
%.o: %.s 
	@$(echo) " *** Creating object files:\t$(cya)%30.30s$(raz)\n\r" "$(<:.s=.o)"
	@$(as) $(format) $(warning_options) $< -o $(<:.s=.o)

clean:
	@$(echo) " *** Deleting object files:\n\t$(mag)%-70.70s$(raz)\n\r" "$(OBJS)"
	@$(rm) $(OBJS)

clean_bonus: clean
	@$(echo) " *** Deleting bonus object files:\n\t$(mag)%-120.120s$(raz)\n\r" "$(BONUS_OBJS)"
	@$(rm) $(BONUS_OBJS)

fclean: clean
	@$(echo) " *** Deleting archive\t$(red)%30.30s$(raz)\n\r" "$(NAME) $(_bonus)"
	@$(rm) $(NAME)

fclean_bonus: clean_bonus
	@$(echo) " *** Deleting bonus archive\t$(red)%30.30s$(raz)\n\r" "$(NAME) bonus"
	@$(rm) $(NAME)

re: fclean all

bonus: 
	@make $(NAME) BONUS=1

################################################################################
#                                                                              #
#                                  TESTS                                       #
#                                                                              #
################################################################################

ARGV1 = "Solutions nearly always come from the direction you least expect, which means there's no point trying to look in that direction because it won't be coming from there."
test: fclean_test $(bonus_rule) $(TEST_SRCS) $(TEST_HDRS)
	@$(echo) " *** Starting testing: \t\t$(blu)%30.30s$(raz)\n\r" "$(NAME) $(_bonus) - $(TESTER)"
# libasm
	@$(echo) " *** $(blu)PHASE ONE: $(blu)%-70.70s$(raz)\n\r" "Apply $(NAME) $(_bonus) functions on the tester"
	@mkdir -p tester/assets/ft_outputs tester/assets/regular_outputs
	@$(cc) $(compil_options) -DPHASE_ONE -DLIBASM $(TEST_SRCS) $(TEST_INCL_FLAGS) $(TEST_LD_FLAGS) -L . -lasm -o $(TESTER)
	@./$(TESTER) ${ARGV1}
	@valgrind --log-file="tester/assets/ft_outputs/leaks.output" --leak-check=full --show-leak-kinds=all ./$(TESTER) ${ARGV1}
	@$(make) fclean_test
# regular
	@$(echo) " *** $(blu)PHASE ONE: $(blu)%-70.70s$(raz)\n\r" "Apply libc functions (or hardcoded functions for bonus) on the tester"
	@$(cc) $(compil_options) -DPHASE_ONE $(TEST_SRCS) $(TEST_INCL_FLAGS) $(TEST_LD_FLAGS) -o $(TESTER)
	@./$(TESTER) ${ARGV1}
	@valgrind --log-file="tester/assets/regular_outputs/leaks.output" --leak-check=full --show-leak-kinds=all ./$(TESTER) ${ARGV1} 
	@$(make) fclean_test
	@$(echo) " *** $(blu)PHASE TWO: $(blu)%-70.70s$(raz)\n\r" "Interpret results $(NAME) $(_bonus)"
	@$(cc) $(compil_options) $(OS) -DPHASE_TWO $(TEST_SRCS) $(TEST_INCL_FLAGS) $(TEST_LD_FLAGS) -o $(TESTER)
	@./$(TESTER) "$(author)" "$(campus)" && $(rm) -f $(REG_OUTS) $(FT_OUTS)
#	valgrind --leak-check=full --show-leak-kinds=all ./$(TESTER)
#	@$(rm) tester/assets/{ft_outputs,regular_outputs}/{strlen,strcmp,strcpy,strdup,reawri,reawri-output,pushfl,sizell,sortll,remvll,atoi_b,leaks}.output

test_bonus:
	@$(make) test BONUS=1

fclean_test:
	@if [ -f $(NAME) ]; then make fclean_bonus; fi
	@$(echo) " *** Deleting tester\t\t$(red)%30.30s$(raz)\n\r" "$(TESTER)"
	@${rm} $(TESTER) $(TEST_OBJS) $(TESTER).dSYM
