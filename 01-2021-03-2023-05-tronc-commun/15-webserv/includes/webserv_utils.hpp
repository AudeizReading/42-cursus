/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */
/*  */

#pragma once

#include <string>

#ifndef CRLF
# define CRLF	"\r\n"
#endif

std::string	strtrim_left(std::string const& str, const char *charset = " \r\n\t");
std::string	strtrim_right(std::string const& str, const char *charset = " \r\n\t");
bool		is_valid_URI(std::string const& uri);

std::string	get_dir_list_html(std::string const& dir_path, std::string const& URI);
