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

# -----------------------------------------------------------------------------
#                            GCC FLAGS
# -----------------------------------------------------------------------------
CFLAGS=-Wall -Werror -Wextra
CHEADERS= -I ./includes
ALL_FLAGS= $(CHEADERS) $(CFLAGS)
LDFLAGS= -L $(LIBFT_PATH) -lft -L $(GNL_PATH) -lgnl -L $(MLX_PATH) -lmlx -framework OpenGL -framework AppKit

# -----------------------------------------------------------------------------
#                            LIBS PATH
# -----------------------------------------------------------------------------
LIBFT_PATH=./lib/libft
GNL_PATH=./lib/gnl
MLX_PATH=./lib/minilibx_mms_20200219

# -----------------------------------------------------------------------------
#                            FILES
# -----------------------------------------------------------------------------
SRCS=$(addprefix srcs/, $(addsuffix .c, \
	 main\
	 ))\
	 $(addprefix srcs/ft_, $(addsuffix .c, \
	 basic_error\
	 map_errors\
	 check_map\
	 get_map\
	 init_line\
	 map_size\
	 last_line\
	 map_addback\
	 map_delone\
	 map_clear\
	 print_map\
	 init_point\
	 point_list_size\
	 last_point\
	 point_addback\
	 point_clear\
	 print_point_list\
	 init_map\
	 check_valid_characters\
	 check_wall\
	 has_object\
	 is_rectangular_map\
	 clean_map\
	 get_objects_pos\
	 parse_map\
	 get_colors\
	 init_mlx\
	 mlx_pixel_put\
	 draw_screen\
	 hook_close_mlx\
	 handle_player\
	 draw_objects\
	 print_stats\
	 handle_image\
	 handle_screen\
	 hook_key_mlx\
	 handle_game\
	 handle_minimap\
	 drawing_legend\
	 ))
OBJ=$(SRCS:.c=.o)
NAME=so_long

# -----------------------------------------------------------------------------
#                            RULES
# -----------------------------------------------------------------------------
.PHONY: all clean fclean re test debug debug-full libft gnl mlx libftclean gnlclean mlxclean sani 

all: $(NAME)

$(NAME): $(OBJ)
	@$(MAKE) libft
	@$(MAKE) gnl
	@$(MAKE) mlx 
	cp $(MLX_PATH)/libmlx.dylib .
	@$(ECHO) "$(GRE)"
	$(CC) $(LDFLAGS) $^ -o $@
	@$(ECHO) "$(NO_COL)"

libft:
	@$(ECHO) "$(YEL)"
	$(MAKE) -C $(LIBFT_PATH) all
	@$(ECHO) "$(NO_COL)"

gnl:
	@$(ECHO) "$(MAG)"
	$(MAKE) -C $(GNL_PATH) all
	@$(ECHO) "$(NO_COL)"

mlx:
	@$(ECHO) "$(BLU)"
	$(MAKE) -C $(MLX_PATH) all
	@$(ECHO) "$(NO_COL)"

test: $(NAME)
#	./$(NAME) maps/13x5_invalid_char.ber
#	./$(NAME) maps/13x5_invalid_wall.ber
#	./$(NAME) maps/13x5_multi_collectibles.ber
#	./$(NAME) maps/13x5_no_collectibles.ber
#	./$(NAME) maps/13x5_no_mandatory_chars.ber
#	./$(NAME) maps/13x5_no_starting_pos.ber
#	./$(NAME) maps/13x5_not_rectangular_map.ber
#	./$(NAME) maps/13x5_valid_map.ber
#	./$(NAME) maps/13x5_valid_map.bera
#	./$(NAME) maps/13x6_invalid_blank_line.ber
	./$(NAME) maps/15x15_valid_map.ber
#	./$(NAME) maps/15x15_invalid_start_pos.ber
#	./$(NAME) maps/15x15_invalid_exit_pos.ber
#	./$(NAME) maps/34x6_valid_map.ber
#	./$(NAME) maps/80x25_valid_map.ber
#	./$(NAME) maps/80x25_valid_map.invalid.ext
#	./$(NAME) maps/foireux.ber
#	./$(NAME) maps/directory.ber
#	./$(NAME) maps/directory.ber/13x5_valid_map.ber
#	./$(NAME) maps/inexistant.ber
	@$(MAKE) fclean
	@$(MAKE) mlxclean
	
sani: $(OBJ)
	@$(MAKE) libft
	@$(MAKE) gnl
	@$(MAKE) mlx
	cp $(MLX_PATH)/libmlx.dylib .
	@$(ECHO) "$(GRE)"
	$(CC) -g -fsanitize=address -fno-omit-frame-pointer -static-libsan $(LDFLAGS) $^ -o $(NAME) 
	@$(ECHO) "$(NO_COL)"
#	./$(NAME) maps/13x5_valid_map.ber
	./$(NAME) maps/15x15_valid_map.ber
#	./$(NAME) maps/34x6_valid_map.ber
#	./$(NAME) maps/80x25_valid_map.ber
	@$(MAKE) clean
	@$(MAKE) libftclean
	@$(MAKE) gnlclean
	@$(MAKE) mlxclean
	@$(ECHO) "$(RED)"
	$(RM) $(NAME) debug.dSYM libmlx.dylib.dSYM
	@$(ECHO) "$(NO_COL)"

debug: $(OBJ)
	@$(MAKE) libft
	@$(MAKE) gnl
	@$(MAKE) mlx
	cp $(MLX_PATH)/libmlx.dylib .
	@$(ECHO) "$(BLU)"
	$(CC) -g $(LDFLAGS) $^ -o $@
	@$(ECHO) "$(NO_COL)"
	valgrind ./$@ maps/15x15_valid_map.ber
	@$(MAKE) clean
	@$(MAKE) libftclean
	@$(MAKE) gnlclean
	@$(MAKE) mlxclean
	@$(ECHO) "$(RED)"
	$(RM) $@ debug.dSYM
	$(RM) $@ libmlx.dylib.dSYM
	@$(ECHO) "$(NO_COL)"

debug-full: $(OBJ)
	@$(MAKE) libft
	@$(MAKE) gnl
	@$(MAKE) mlx
	cp $(MLX_PATH)/libmlx.dylib .
	@$(ECHO) "$(BLU)"
	$(CC) -g $(LDFLAGS) $^ -o $@
	@$(ECHO) "$(NO_COL)"
	valgrind --leak-check=full --show-leak-kinds=all ./$@ maps/15x15_valid_map.ber
	@$(MAKE) clean
	@$(MAKE) libftclean
	@$(MAKE) gnlclean
	@$(MAKE) mlxclean
	@$(ECHO) "$(RED)"
	$(RM) $@ debug-full.dSYM
	$(RM) $@ libmlx.dylib.dSYM
	@$(ECHO) "$(NO_COL)"

%.o: %.c
	@$(ECHO) "$(GRE)"
	$(CC) $(ALL_FLAGS) -c $< -o $@
	@$(ECHO) "$(NO_COL)"

clean:
	@$(ECHO) "$(RED)"
	$(RM) $(OBJ)
	@$(ECHO) "$(NO_COL)"

libftclean: 
	@$(ECHO) "$(RED)"
	$(RM) $(LIBFT_PATH)/libft.a
	@$(ECHO) "$(NO_COL)"

gnlclean:
	@$(ECHO) "$(RED)"
	$(RM) $(GNL_PATH)/libgnl.a
	@$(ECHO) "$(NO_COL)"

mlxclean:
	@$(ECHO) "$(RED)"
	$(RM) libmlx.dylib $(MLX_PATH)/libmlx.dylib
	@$(ECHO) "$(NO_COL)"

fclean: clean libftclean gnlclean mlxclean
	@$(ECHO) "$(RED)"
	$(RM) $(NAME)
	@$(ECHO) "$(NO_COL)"

fclean-debug: fclean
	@$(ECHO) "$(RED)"
	$(RM) so_long.dSYM
	$(RM) debug debug.dSYM
	$(RM) debug-full debug-full.dSYM
	$(RM) $@ libmlx.dylib $(MLX_PATH)/libmlx.dylib libmlx.dylib.dSYM
	@$(ECHO) "$(NO_COL)"

re: fclean all
