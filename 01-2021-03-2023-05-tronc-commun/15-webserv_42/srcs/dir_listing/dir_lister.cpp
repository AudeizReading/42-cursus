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

#include <string>
#include <sstream>
#include <dirent.h>
#include <cassert>
#include <sys/stat.h>

#include <webserv_utils.hpp>

#define MAX_FILENAME_LEN	50
#define MAX_FILE_OCTET_SIZE	20

#define PUT_DIR_SLASH(x)	(x->d_type == DT_DIR ? "/" : "")

#define LINK(x, y)			"<a href=\"" << x->d_name << PUT_DIR_SLASH(x) << "\">" \
							<< y \
							<< "</a>"

// Crop file name and add a '/' character if it's a directory
static void	format_file_name(std::string& name, bool is_directory)
{
	if (name.length() > MAX_FILENAME_LEN)
	{
		name.erase(MAX_FILENAME_LEN - 3);
		name += "..>";
	}
	if (is_directory && name.length() < MAX_FILENAME_LEN)
		name += '/';
}

// I wanted to do some C string manipulation in there because I was bored.
// Don't worry, it works. Probably faster, too.
static const char *pad_file_name(std::size_t file_name_len)
{
	static char	padding[MAX_FILENAME_LEN + 2] = {' '};

	std::memset(padding, ' ', MAX_FILENAME_LEN - file_name_len + 1);
	padding[MAX_FILENAME_LEN - file_name_len + 1] = '\0';
	return padding;
}

static const char	*display_file_size_with_pad(std::size_t num)
{
	static char	file_size_str[MAX_FILE_OCTET_SIZE + 1] = {' '};

	int num_len = std::snprintf(file_size_str, MAX_FILE_OCTET_SIZE + 1, "%zu", num);
	std::memmove(file_size_str + (MAX_FILE_OCTET_SIZE - num_len), file_size_str, num_len);
	std::memset(file_size_str, ' ', MAX_FILE_OCTET_SIZE - num_len);
	return file_size_str;
}

static const char	*timespec_to_char(const timespec time)
{
	static char	buffer[18] = {0};
	struct tm	tm;

	std::strftime(buffer, 18, "%d-%b-%Y %R", gmtime_r(&time.tv_sec, &tm));
	return buffer;
}

// man readdir, man dirent
std::string	get_dir_list_html(std::string const& dir_path, std::string const& URI)
{
	std::stringstream	html;

	html << "<!DOCTYPE html>"CRLF;
	html << "<html>"CRLF;
	html << "<head>"CRLF;
	html << 	"<meta charset=\"UTF-8\" />"CRLF;
	html << 	"<title>Index of " << URI << "</title>"CRLF;
	html << "</head>"CRLF;
	html << "<body>"CRLF;
	html << 	"<h1>Index of " << URI << "</h1>"CRLF;
	html << 	"<hr>"CRLF;
	html << 	"<pre>"CRLF;

	DIR			*dir = opendir(dir_path.c_str());
	struct stat	f_stat;
	std::memset(&f_stat, 0, sizeof(f_stat));
	
	assert(dir != NULL); // If this happens, tell Paul!

	std::string	file_name(MAX_FILENAME_LEN, '\0');
	for (struct dirent *dirent = readdir(dir); dirent != NULL; dirent = readdir(dir))
	{
		if (dirent->d_name[0] == '.' && dirent->d_name[1] != '.') // Don't show hidden files
			continue;

		// Get file properties and format file name
		stat((dir_path + dirent->d_name).c_str(), &f_stat);
		format_file_name(file_name = dirent->d_name, dirent->d_type == DT_DIR);

		html << LINK(dirent, file_name);
		if (file_name == "../")	// Don't show anything about current dir, skip to next
		{
			html << CRLF;
			continue;
		}
		html << pad_file_name(file_name.length())
			<< timespec_to_char(f_stat.st_mtimespec);
		if (dirent->d_type == DT_DIR)
			html << "                   -";
		else
			html << display_file_size_with_pad(f_stat.st_size);
		html << CRLF;
	}
	closedir(dir);

	html << 	"</pre>"CRLF;
	html << 	"<hr>"CRLF;
	html << "</body>"CRLF;
	html << "</html>"CRLF;

	return html.str();
}
