#pragma once

#include <exception>
#include <string>
#include <sstream>

#if __cplusplus == 199711L
# define noexcept	throw()
#endif

/*
 *                                             ┌──────────────┐
 *                                           ┌─┤TOML::bad_type│
 * ┌──────────────┐    ┌────────────────┐    │ └──────────────┘
 * │std::exception│◄───┤TOML::toml_error│◄───┤
 * └──────────────┘    └────────────────┘    │ ┌─────────────────┐
 *                                           └─┤TOML::parse_error│
 *                                             └─────────────────┘
 */

namespace TOML
{

class toml_error : public std::exception
{
	public:
		virtual const char	*what() const noexcept { return "TOML::toml_error"; }
		virtual ~toml_error() noexcept {}
};

class bad_type : public TOML::toml_error
{
	private:
		const char	*_msg;

	public:
		bad_type(const char *msg) : _msg(msg) {}
		virtual const char	*what() const noexcept { return (_msg); }
		virtual ~bad_type() noexcept {}
};

class parse_error : public TOML::toml_error
{
	private:
		std::string			_msg;
	public:
		parse_error(std::string const& what, std::size_t line = 0)
		{
			std::stringstream ss;
			ss << what;
			if (line != 0)
				ss << " at line " << line;
			_msg = ss.str();
		}
		parse_error(parse_error const&) {}
		virtual const char	*what() const noexcept { return _msg.c_str(); }
		virtual ~parse_error() noexcept {}
};

} // namespace TOML

#undef noexcept
