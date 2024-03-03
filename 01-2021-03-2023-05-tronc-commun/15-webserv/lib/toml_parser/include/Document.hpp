/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Document.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/24 03:05:31 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/11 05:54:07 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <cstdlib>
#include <sstream>
#include <iterator>
#include <errno.h>
#include <cstring> // strerror
#include <stack>

#include "exceptions.hpp"
#include "ft_containers/iterator.hpp"
#include "Value.hpp"
#include "DocumentIterator.hpp"

#include "ansi_color.h"

# if __cplusplus == 199711L
#  define noexcept	throw()
# endif

namespace TOML
{

class Document
{
	public:
		typedef	Value									value_type;
		typedef Value::size_type						size_type;
		typedef Value::difference_type					difference_type;
		typedef	Value&									reference;
		typedef	Value const&							const_reference;
		typedef Value*									pointer;
		typedef Value const*							const_pointer;

		typedef Value::int_type			int_type;
		typedef Value::float_type		float_type;
		typedef Value::bool_type		bool_type;
		typedef Value::string_type		string_type;
		typedef Value::group_type		group_type;
		typedef Value::array_type		array_type;
		
		// typedef __detail::DocumentIterator<Value>			iterator;
		// typedef __detail::DocumentIterator<const Value>		const_iterator;

		typedef std::vector<Value>::iterator			iterator;
		typedef std::vector<Value>::const_iterator		const_iterator;
		typedef __detail::DocumentIterator<Value>		recursive_iterator;

	private:
		Value			_root;
		Value			*_currentGroup;
		string_type		_path;
		bool			_isParsed;

	private:
		typedef string_type::const_iterator		str_const_it;
		
		static inline bool	_isSpace(char c) noexcept { return (c == 0x09 || c == 0x20); }
		// Skips all whitespaces and comments
		static inline void	_skipWhitespaces(string_type::const_iterator& it, string_type::const_iterator const& end) noexcept
		{
			for (; it != end && _isSpace(*it); ++it) ;
			if (*it == '#')
				it = end;
		}
		static inline bool _isBareKeyChar(char c) noexcept
		{
			return isascii(c) && (isupper(c) || islower(c) || isdigit(c) || c == '-' || c == '_');
		}
		static TOML::Type	_guessValueType(str_const_it it, str_const_it const& end);
		// Returns whether or not iterator range has got non-whitespace characters. Comments are ignored.
		static inline bool	_hasNonWhitespace(str_const_it first, str_const_it const& last)
		{
			_skipWhitespaces(first, last);
			return (first < last && *first != '#');
		}
		static str_const_it				_getLineEndIt(str_const_it it, str_const_it end);
		static string_type::iterator	_getLineEndIt(string_type::iterator it, string_type::iterator end);

		void	_parseFromIstream(std::istream& stream);
		
		void	_parseGroup(str_const_it it, string_type const& line, size_type lineNum);
		void	_parseKeyValue(str_const_it it, string_type& line, size_type& lineNum, std::istream& fs);

		// Simple types parsing
		Value::int_type		_parseInt	(str_const_it it, str_const_it end, size_type lineNum) const;
		Value::float_type	_parseFloat	(str_const_it it, str_const_it end, size_type lineNum) const;
		Value::bool_type	_parseBool	(str_const_it it, str_const_it end, size_type lineNum) const;

		// String parsing
		bool	_parseCompactEscapeSequence(string_type::iterator& it, string_type& raw_str, char escaped) const;
		void	_parseEscapedUnicode(string_type::iterator& it, string_type& raw_str, size_type lineNum) const;
		Value::string_type	_parseString(str_const_it it, str_const_it end, size_type lineNum) const;

		// Array parsing
		str_const_it	_arr_nextArrayVal(str_const_it it, str_const_it end) const;
		str_const_it	_arr_nextArrayVal(str_const_it it, str_const_it end, bool& expect_value) const;
		str_const_it	_arr_getValueEndIt(str_const_it it, str_const_it end) const;
		str_const_it	_arr_getNextArrayLine(str_const_it it, string_type& line, size_type& lineNum,
							std::istream& fs) const;
		Value	_parseArray(string_type const& key, str_const_it& it, string_type& line,
					size_type& lineNum, std::istream& fs) const;
		
		// Group array parsing
		void	_parseGroupArray(str_const_it it, str_const_it end, size_type lineNum);
	
	public:
		// An empty key'd group is the root
		Document()						  : _root(make_group("")),	_currentGroup(&_root), _path(),		_isParsed(false) {}
		Document(string_type const& path) : _root(make_group("")),	_currentGroup(&_root), _path(path),	_isParsed(false) {}
		Document(const char *path)		  : _root(make_group("")),	_currentGroup(&_root), _path(path),	_isParsed(false) {}
		Document(Value const& value)	  : _root(value),			_currentGroup(&_root), _path(),		_isParsed(true)
		{
			if (!value.isGroup())
				throw bad_type("Tried constructing document from non-Group value");
		} 
		~Document() {}

		inline bool		has(string_type const& key) const { return _root.has(key); }

		Value&			at(string_type const& key);
		Value const&	at(string_type const& key) const;
		Value			at_or(string_type const& key, Value) const noexcept;
		Value&			operator[](string_type const& key)		 noexcept;
		Value const&	operator[](string_type const& key) const noexcept;

		inline bool		erase(string_type const& key) { return _root.erase(key); }

		bool	parse(string_type const& path);
		bool	parse(std::istream& stream);
		bool	parse();

		iterator		begin()			{ return _root._hashmap.begin();	}
		const_iterator	begin() const	{ return _root._hashmap.begin();	}
		iterator		end() 		{ return _root._hashmap.end();	}
		const_iterator	end() const	{ return _root._hashmap.end();	}
		
		recursive_iterator		rec_begin()	{ return recursive_iterator(_root, _root._hashmap.begin());	}
		recursive_iterator		rec_end()	{ return recursive_iterator(_root, _root._hashmap.end());	}

};

// ============================================================================================== //
// ------------------------------------------          ------------------------------------------ //
// ============================================================================================== //

#include "Document.ipp"

} // namespace TOML

# if __cplusplus == 199711L
#  undef noexcept
# endif
