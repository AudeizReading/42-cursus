NAME        :=libft

prefix      :=.
outdir      :=$(prefix)
incdir      :=$(prefix)/inc
srcdir      :=$(prefix)/src

src         :=$(wildcard $(srcdir)/*.c)
obj         :=$(src:.c=.o)
out         :=$(outdir)/$(NAME).a

AR          :=ar rcs
CC          =gcc
CPPFLAGS    :=-I$(incdir)
CFLAGS      :=-Wall -Wextra -Werror \
	-Wshadow -Wdouble-promotion -std=c89 -pipe

.PHONY: $(NAME) all clean fclean re 
all $(NAME): $(out)

$(out): $(obj)
	$(AR) $@ $^

%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

clean:
	$(RM) $(obj)

fclean: clean
	$(RM) $(out)

re: fclean all
