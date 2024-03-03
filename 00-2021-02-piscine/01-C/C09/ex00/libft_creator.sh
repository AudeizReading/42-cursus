#!/bin/sh
gcc -Wall -Wextra -Werror -c *.c
ar crs libft.a *.o
rm -rf *.o
