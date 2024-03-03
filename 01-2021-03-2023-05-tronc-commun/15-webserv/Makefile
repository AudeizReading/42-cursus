# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gphilipp <gphilipp@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/09/13 15:31:28 by gphilipp          #+#    #+#              #
#    Updated: 2022/12/02 14:37:08 by gphilipp         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

PARSING_SRC_FILES =				include_directive.cpp			config_parsing.cpp\
	config_error_checking.cpp	create_servers.cpp

PARSING_SRC = $(addprefix srcs/config_parsing/, $(PARSING_SRC_FILES))

# <!-- pre='./' path='srcs/' match='*.cpp' exclude='srcs/main.cpp' pos='1' template='		{0} \' -->
SRC =	srcs/main.cpp \
		srcs/Response/Response_4XX.cpp \
		srcs/Response/Response_Redirect.cpp \
		srcs/Response/Response_Ok.cpp \
		srcs/Response/Response_Dirlist.cpp \
		srcs/utils.cpp \
		srcs/CGIManager.cpp \
		srcs/Buffer.cpp \
		srcs/Request.cpp \
		srcs/webserv.cpp \
		srcs/Location.cpp \
		srcs/dir_listing/dir_lister.cpp \
		srcs/Queryparser.cpp \
		srcs/Response.cpp \
		srcs/Listener.cpp \
		srcs/CGIEnviron.cpp \
		srcs/Server.cpp \
		$(PARSING_SRC)

# <!-- pre='./' path='srcs/' match='*.hpp' exclude='srcs/Response.hpp' pos='1' template='		{0} \' -->
HDEP1 = srcs/Response.hpp \
		srcs/Response/Response_Redirect.hpp \
		srcs/Response/Response_Ok.hpp \
		srcs/Response/Response_4XX.hpp \
		srcs/Response/Response_Dirlist.hpp \
		srcs/CGIEnviron.hpp \
		srcs/Server.hpp \
		srcs/Queryparser.hpp \
		srcs/Listener.hpp \
		srcs/Request.hpp \
		srcs/Location.hpp \
		srcs/CGIManager.hpp \
		srcs/Buffer.hpp \

 # <!-- pre='./' path='includes/' match='*.hpp' pos='1' template='		{0} \' -->
HDEP =	$(HDEP1) \
 		includes/http_error_codes.hpp \
 		includes/webserv.hpp \
 		includes/webserv_utils.hpp \
		includes/webserv.hpp \

TOML_PARSER = lib/toml_parser

INCLUDES = $(TOML_PARSER) includes

ifeq ($(shell cat .guillaume 2> /dev/null), G)
GUILLAUME = 1
endif

ifdef GUILLAUME
OBJ = $(SRC:.cpp=.o)
else
OBJ = $(subst srcs/, .objs/, $(patsubst %.cpp, %.o, $(SRC)))
endif

NAME = webserv

CXX  = clang++

CXXFLAGS = -Wall -Wextra -Werror -Wold-style-cast --std=c++98 -g

LDLIBS = -I$(TOML_PARSER) -Iincludes

CONF_FILE = demo/www.toml

# ifeq ($(shell ./hooks/submodules > /dev/null; echo $$?), 1)
# LIBS = toml
# endif

ifdef TR
SMFLAGS = --remote
LIBS = toml
endif

all: libs $(NAME)

libs: $(LIBS)

toml:
	git submodule update --init $(SMFLAGS) $(TOML_PARSER)

ifdef GUILLAUME
%.o: %.cpp $(HDEP)
else
.objs/%.o: srcs/%.cpp $(HDEP)
	@mkdir -p $(@D)
endif
	$(CXX) $(CXXFLAGS) $(LDLIBS) -c $< -o $@

$(NAME): $(OBJ) $(HDEP)
	$(CXX) $(CXXFLAGS) -o $(NAME) $(OBJ)

bonus: $(NAME)_bonus

$(NAME)_bonus: $(NAME)
	cp $(NAME) $(NAME)_bonus

run: all
	@$(pkill -2 $(NAME) || 1)
	./$(NAME) $(CONF_FILE)

# Usage: make debug && lldb minishell_debug -o run
$(NAME)_debug: $(SRC) $(HDEP)
	$(CXX) $(CXXFLAGS) $(LDLIBS) -g -o $(NAME)_debug $(SRC)

$(NAME)_sanitize: $(SRC) $(HDEP)
	$(CXX) $(CXXFLAGS) $(LDLIBS) -fsanitize=address -g -o $(NAME)_sanitize $(SRC)

debug: $(NAME)_debug

sanitize: $(NAME)_sanitize

clean:
	rm -rf $(OBJ)

# test:
#	@./test/test.sh

fclean: clean
	rm -f $(NAME)
	rm -f $(NAME)_bonus $(NAME)_debug $(NAME)_sanitize
	rm -f *.out test/*.out
	rm -f *.log
	rm -rf *.dSYM
	find . -iname "*.o" -exec rm -i {} ";"

re: fclean all

.PHONY: all libs toml run debug sanitize clean fclean re test
