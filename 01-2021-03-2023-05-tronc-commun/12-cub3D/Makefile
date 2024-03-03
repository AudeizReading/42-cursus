NAME        :=cub3D

prefix      :=.
bindir      :=$(prefix)/bin
incdir      :=$(prefix)/inc
srcdir      :=$(prefix)/src
libdir      :=$(prefix)/lib

libftdir    :=$(libdir)/libft
libftinc    :=$(libftdir)/
libft.a     :=$(libftdir)/libft.a

mlxdir      :=$(libdir)/mlx
mlxinc      :=$(mlxdir)/
mlx.a       :=$(mlxdir)/libmlx.a

src         :=$(addprefix $(srcdir)/, $(addsuffix .c, \
	 init\
	 hooks\
	 main\
	 parse\
	 print\
	 quit\
	 $(addprefix geometry/, \
	 	dist2d\
	 	fix_angle\
	 	move_player\
	 	rotate_player\
	 )\
	 $(addprefix parsing/, \
	 	convert_map\
	 	check_map\
	 	convert_xpm\
		reach_map\
		get_playerpos\
		surround_map\
	  )\
 	 $(addprefix draw/, \
	 	draw_background\
		draw_minimap\
		draw_pixel\
		draw_square\
		get_color\
 	  )\
 	 $(addprefix raycasting/, \
	 	draw_ray\
		get_rays\
 	  )\
	))\

obj         :=$(src:.c=.o)
bin         :=$(NAME)
libs        :=$(libft.a) $(mlx.a)

CC          :=gcc
CPPFLAGS    =-I$(incdir) -I$(libftinc) -I$(mlxinc)
CFLAGS      :=-Wall -Wextra -Werror -pipe
LDFLAGS     :=
LDLIBS      :=$(libs) -lm -framework OpenGL -framework AppKit

.PHONY: all bonus

all: $(libs) $(NAME)

bonus:all

bonus:CPPFLAGS+=-D BONUS=1

$(libs):
	@make -s -C $(libftdir)
	@make -s -C $(mlxdir)

$(NAME): $(obj) | $(bindir) $(libs)
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

$(bindir):
	@mkdir $@

%.o : %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $^ -o $@

.PHONY: clean fclean re
clean:
	$(RM) $(obj)

fclean: clean
	$(RM) $(bin)

re: fclean all
