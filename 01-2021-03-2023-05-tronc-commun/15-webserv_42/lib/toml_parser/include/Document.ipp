/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Document.ipp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/25 14:04:10 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/11 05:10:35 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

#include "Document.hpp"

// ============================================================================================== //
// --------------------------------------- PUBLIC METHODS --------------------------------------- //
// ============================================================================================== //

inline
TOML::Type
	Document::_guessValueType(string_type::const_iterator it, string_type::const_iterator const& end)
{
	if (*it == '\"')
		return TOML::T_STRING;
	else if (*it == 't' || *it == 'f')
		return TOML::T_BOOL;
	else if (*it == '[')
		return TOML::T_ARRAY;
	else if (isdigit(*it) || *it == '-')
	{
		if (std::find(it, end, '.') != end)
			return TOML::T_FLOAT;
		else
			return TOML::T_INT;
	}
	else
		return TOML::T_UNDEF;
}

inline
Value&			Document::at(string_type const& key)
{
	for (std::vector<Value>::iterator it = _root._hashmap.begin(); it != _root._hashmap.end(); ++it)
		if (it->_key == key)
			return *it;
	throw (std::out_of_range("TOML::Document::at(): std::out_of_range"));
}

inline
Value const&	Document::at(string_type const& key) const
{
	for (std::vector<Value>::const_iterator it = _root._hashmap.begin(); it != _root._hashmap.end(); ++it)
		if (it->_key == key)
			return *it;
	throw (std::out_of_range("TOML::Document::at(): std::out_of_range"));
}

inline
Value	Document::at_or(string_type const& key, Value val) const noexcept
{
	for (std::vector<Value>::const_iterator it = _root._hashmap.begin(); it != _root._hashmap.end(); ++it)
		if (it->_key == key)
			return *it;
	return val;
}

inline
Value&			Document::operator[](string_type const& key) noexcept
{
	std::vector<Value>::iterator it;
	for (it = _root._hashmap.begin(); it != _root._hashmap.end() && it->_key != key; ++it) ;
	return *it;
}

inline
Value const&	Document::operator[](string_type const& key) const noexcept
{
	std::vector<Value>::const_iterator it;
	for (it = _root._hashmap.begin(); it != _root._hashmap.end() && it->_key != key; ++it) ;
	return *it;
}

// Parse Document with toml file from path
inline
bool	Document::parse(string_type const& path)
{
	if (_isParsed)
		return false;
	_path = path;
	return this->parse();
}

// Parse Document, only if path has been set before.
inline
bool	Document::parse()
{
	if (_isParsed || _path.length() == 0)
		return false;
	
	std::ifstream	fs(_path.c_str());
	if (!fs.is_open())
		throw std::runtime_error(strerror(errno));

	_parseFromIstream(fs);
	fs.close();
	_isParsed = true;
	return true;
}

inline
bool	Document::parse(std::istream& stream)
{
	if (_isParsed == true)
		return false;
	_parseFromIstream(stream);
	_isParsed = true;
	return true;
}

inline
void	Document::_parseFromIstream(std::istream& stream)
{
	size_type	lineNum = 1;

	for (string_type line; std::getline(stream, line); ++lineNum)
	{
		string_type::iterator end_it = _getLineEndIt(line.begin(), line.end());
		line.erase(end_it, line.end()); // TODO: Optimize, this might reallocate.
		string_type::const_iterator	it = line.begin();
		_skipWhitespaces(it, line.end());
		if (it == line.end()) // ignore empty lines
			continue;
		else if (*it == '[')
		{
			if (*(it + 1) == '[')
				_parseGroupArray(it + 2, line.end(), lineNum);
			else
				_parseGroup(++it, line, lineNum);
		}
		else
			_parseKeyValue(it, line, lineNum, stream);
	}
}

inline
void	Document::_parseGroup(string_type::const_iterator src_it, string_type const& line, size_type lineNum)
{
	typedef	string_type::const_iterator		str_const_it;
	
	str_const_it	it = std::find(src_it, line.end(), ']');
	if (it == line.end())
		throw(parse_error("Invalid group definition (missing `]')", lineNum));
	if (_hasNonWhitespace(it + 1, line.end()))
		throw parse_error("Invalid group definition: non-whitespace character after closing `]'", lineNum);
	string_type	key(src_it, it);
	str_const_it keyIt;
	for (keyIt = key.begin(); keyIt != key.end(); ++keyIt)
	{
		if ((!_isBareKeyChar(*keyIt) && *keyIt != '.'))
			throw (parse_error("Illegal group key character", lineNum));
	}
	_currentGroup = &_root;
	keyIt = key.begin();
	str_const_it dot = std::find(keyIt, str_const_it(key.end()), '.');
	str_const_it ItLastKey
		= (key.find_last_of('.') == string_type::npos ? keyIt : key.begin() + key.find_last_of('.') + 1);

	// Go through all subkeys, automatically create subgroups when it's legal.
	while (keyIt != ItLastKey)
	{
		string_type	subkey(keyIt, dot);
		if (subkey.length() == 0)
			throw (parse_error("Empty key", lineNum));
		_currentGroup = _currentGroup->_getOrAddSubtable(Value(subkey));
		if (_currentGroup == NULL)
			throw (parse_error("Redeclared key", lineNum));
		keyIt = dot + 1;
		dot = std::find(keyIt, str_const_it(key.end()), '.');
	}
	// Parse last key
	string_type lastKey (ItLastKey, str_const_it(key.end())); // mfw no cend()
	if (lastKey.length() == 0)
		throw (parse_error("Empty key", lineNum));
	_currentGroup = _currentGroup->group_addValue(Value(lastKey));
	if (_currentGroup == NULL)
		throw (parse_error("Redeclared key", lineNum));
	_currentGroup->_undefinedGroup = false;
}

inline
void	Document::_parseKeyValue(string_type::const_iterator src_it, string_type& line, size_type& lineNum,
	std::istream& fs)
{
	// Get the key
	string_type::const_iterator	it = src_it;
	for (; it != line.end() && _isBareKeyChar(*it); ++it) ;
	if (!_isSpace(*it) && *it != '#' && *it != '=')
		throw (parse_error("Illegal key character ", lineNum));
	string_type	key(src_it, it);

	// Skip over the = sign but make sure it's there
	_skipWhitespaces(it, line.end());
	if (*it != '=')
		throw (parse_error("Missing `=' character after key at line ", lineNum));
	_skipWhitespaces(++it, line.end());

	// Get and parse the value
	switch (_guessValueType(it, line.end()))
	{
		case TOML::T_STRING:
			if (_currentGroup->group_addValue( Value(key, _parseString(it, line.end(), lineNum)) ) == NULL)
				throw parse_error("Duplicate key", lineNum);
			break;
		case TOML::T_INT:
			if (_currentGroup->group_addValue( Value(key, _parseInt(it, line.end(), lineNum), TOML::T_INT) ) == NULL)
				throw parse_error("Duplicate key", lineNum);
			break;
		case TOML::T_FLOAT:
			if (_currentGroup->group_addValue( Value(key, _parseFloat(it, line.end(), lineNum), TOML::T_FLOAT) ) == NULL)
				throw parse_error("Duplicate key", lineNum);
			break;
		case TOML::T_BOOL:
			if (_currentGroup->group_addValue( Value(key, _parseBool(it, line.end(), lineNum), TOML::T_BOOL) ) == NULL)
				throw parse_error("Duplicate key", lineNum);
			break;
		case TOML::T_ARRAY:
			if (_currentGroup->group_addValue( _parseArray(key, it, line, lineNum, fs) ) == NULL)
				throw parse_error("Duplicate key", lineNum);
			break;
		case TOML::T_DATE:
			throw parse_error("Unsupported Date type");
		default:
			throw (parse_error("Illegal or missing value", lineNum));
	}
}

inline
Value::int_type	Document::_parseInt(str_const_it it, str_const_it end, size_type lineNum) const
{
	Value::int_type	val;
	#ifdef __linux
		std::sscanf(it.base(), "%ld", &val);
	#else
		std::sscanf(it.base(), "%lld", &val); // Just rewrite your own func, dude
	#endif
	for (; it != end && (isdigit(*it) || *it == '-'); ++it) ;
	if (_hasNonWhitespace(it, end))
		throw (parse_error("Illegal integer value", lineNum));
	return val;
}

inline
Value::float_type	Document::_parseFloat(str_const_it it, str_const_it end, size_type lineNum) const
{
	Value::float_type	val;
	std::sscanf(it.base(), "%lf", &val); // Just rewrite your own func, dude
	for (; it != end && (isdigit(*it) || *it == '-' || *it == '.'); ++it) ;
	if (_hasNonWhitespace(it, end))
		throw (parse_error("Illegal floating point value", lineNum));
	return val;
}

inline
Value::bool_type	Document::_parseBool(str_const_it it, str_const_it end, size_type lineNum) const
{ // FIXME, Shit code but I'm tired
	typedef	string_type::const_iterator		str_const_it;
	
	Value::bool_type	val;
	str_const_it last = std::find(it, str_const_it(end), 'e');
	string_type	tmp(it, ++last);
	if ((tmp != "true" && tmp != "false") || _hasNonWhitespace(last, end))
		throw (parse_error("Illegal boolean value", lineNum));
	val = (tmp == "true" ? true : false);
	return val;
}

// Returns true if character was successfully parsed, false otherwise
inline
bool	Document::_parseCompactEscapeSequence(string_type::iterator& it, string_type& str,
	char escaped) const
{
	const char	c[] =		{ '\"',  'b',  't',  'n',  'f',  'r', '/', '\\' };
	const char*	replace[] =	{ "\"", "\b", "\t", "\n", "\f", "\r", "/", "\\" };
	const size_type n =	(sizeof(c) / sizeof(c[0]));

	size_type	i;
	for (i = 0; i < n; ++i) {
		if (escaped == c[i]) {
			str.replace(it, it + 2, replace[i]);
			break;
		}
	}
	return i < n;
}

inline
void	Document::_parseEscapedUnicode(string_type::iterator& it, string_type& raw_str, size_type lineNum) const
{
	if (!isxdigit(*(it + 2)) || !isxdigit(*(it + 3)) || !isxdigit(*(it + 4)) || !isxdigit(*(it + 5)))
		throw (parse_error("Illegal unicode escape sequence", lineNum));

	const long code = std::strtol(string_type(it + 2, it + 6).c_str(), NULL, 16);
	assert(code >= 0);
	if (code <= 0x7F)
	{
		raw_str.replace(it, it + 6, 1, static_cast<char>(code));
	}
	else if (code >= 0x0080 && code <= 0x07FF) // Two point unicode
	{
		unsigned char unicode[3] = { 0b11000000, 0b10000000, 0x00 };
		unicode[1] |= (code)		& 0b111111;
		unicode[0] |= (code >> 6)	& 0b011111;
		raw_str.replace(it, it + 6, reinterpret_cast<const char *>(unicode));
	}
	else // Three point unicode
	{
		unsigned char unicode[4] = { 0b11100000, 0b10000000, 0b10000000, 0x00 };
		unicode[2] |= (code)		& 0b111111;
		unicode[1] |= (code >> 6)	& 0b111111;
		unicode[0] |= (code >> 12)	& 0b001111;
		raw_str.replace(it, it + 6, reinterpret_cast<const char *>(unicode));
	}
}

// TODO: Check for control characters (0x00 to 0x1F). See TOML v0.2.0.
inline
Value::string_type	Document::_parseString(str_const_it src_it, str_const_it end, size_type lineNum) const
{
	string_type	newstr(++src_it, end);
	string_type::iterator it = newstr.begin();
	for (; it != newstr.end() && *it != '\"'; ++it)
	{
		if (*it != '\\' || _parseCompactEscapeSequence(it, newstr, *(it + 1)) == true)
			continue;
		else if (*(it + 1) == 'u') // Unicode escaping
			_parseEscapedUnicode(it, newstr, lineNum);
		else
			throw (parse_error(string_type("Illegal escaped character (\\")+ *(it+1) + ')', lineNum));
	}
	if (it == newstr.end())
		throw parse_error("Missing `\"' at the end of string", lineNum);
	else if (_hasNonWhitespace(it + 1, newstr.end()))
		throw parse_error("Found non-space character after string", lineNum);
	return (Value::string_type(newstr.begin(), it));
}

// Returns an iterator corresponding to current line's end iterator or comment
inline
Document::string_type::iterator	Document::_getLineEndIt(string_type::iterator it, string_type::iterator end)
{
	for (; it < end && *it != '#'; ++it)
	{
		if (*it == '\"')
		{
			++it;
			for (; it < end && !(*(it - 1) != '\\' && *(it) == '\"'); ++it) // Skip until end of string
				;
		}
	}
	return it;
}

inline
Document::str_const_it	Document::_getLineEndIt(str_const_it it, str_const_it end)
{
	for (; it < end && *it != '#'; ++it)
	{
		if (*it == '\"')
		{
			++it;
			for (; it < end && !(*(it - 1) != '\\' && *(it) == '\"'); ++it) // Skip until end of string
				;
		}
	}
	return it;
}

// Get an iterator to the next array value.
inline
Document::str_const_it	Document::_arr_nextArrayVal(str_const_it it, str_const_it end) const
{
	it = _arr_getValueEndIt(it, end);
	if (*it == ',')
		++it;
	_skipWhitespaces(it, end);
	return it;
}

// Get an iterator to the next array value. Sets the boolean "expect_value" to false if no coma was found.
inline
Document::str_const_it	Document::_arr_nextArrayVal(str_const_it it, str_const_it end, bool& expect_value) const
{
	expect_value = false;
	it = _arr_getValueEndIt(it, end);
	if (*it == ',') {
		++it;
		expect_value = true;
	}
	_skipWhitespaces(it, end);
	return it;
}

// Returns an end iterator to the current array value, i.e. returns either ',' or the closing ']'
// Correctly skips through strings
inline
Document::str_const_it	Document::_arr_getValueEndIt(str_const_it it, str_const_it end) const
{
	for (; it < end && *it != ',' && *it != ']'; ++it)
	{
		if (*it == '\"')
		{
			++it;
			for (; it < end && !(*(it - 1) != '\\' && *(it) == '\"'); ++it) // Skip until end of string
				;
		}
	}
	return it;
}

inline
Document::str_const_it	Document::_arr_getNextArrayLine(str_const_it it, string_type& line,
	size_type& lineNum, std::istream& fs) const
{
	std::getline(fs, line);
	lineNum++;
	line.erase(_getLineEndIt(line.begin(), line.end()), line.end());
	it = line.begin();
	_skipWhitespaces(it, line.end());
	return (it);
}

// Expects `it' to be pointing to a '['
inline
Value	Document::_parseArray(string_type const& key, str_const_it& it,
	Value::string_type& line, Value::size_type& lineNum, std::istream& fs) const
{
	_skipWhitespaces(++it, line.end()); // Skip first whitespaces in array
	while (it == line.end()) // Skip empty/commented lines
		it = _arr_getNextArrayLine(it, line, lineNum, fs);
	const TOML::Type	array_type = _guessValueType(it, _arr_getValueEndIt(it, line.end()));
	assert(array_type != TOML::T_UNDEF);

	Value	array(key, array_type);
	bool	expect_value = true;
	while (*it != ']') // While array isn't closed
	{
		for (; it != line.end() && *it != ']'; it = _arr_nextArrayVal(it, line.end(), expect_value)) // Go through current array line
		{
			const str_const_it	value_end_it = _arr_getValueEndIt(it, line.end());
			const TOML::Type	type = _guessValueType(it, value_end_it);
			if (type != array_type)
				throw parse_error("Array contains different types", lineNum);
			switch (array_type) // Switch with array_type instead of type should allow compiler to optimize
			{
				case TOML::T_INT:
					array.Array().push_back( make_int("", _parseInt(it, value_end_it, lineNum)) );			break;
				case TOML::T_FLOAT:
					array.Array().push_back( make_float("", _parseFloat(it, value_end_it, lineNum)) );		break;
				case TOML::T_BOOL:
					array.Array().push_back( make_bool("", _parseBool(it, value_end_it, lineNum)) );		break;
				case TOML::T_STRING:
					array.Array().push_back( make_string("", _parseString(it, value_end_it, lineNum)) );	break;
				case TOML::T_DATE:
					; // TODO
					break;
				case TOML::T_ARRAY:
					array.Array().push_back( _parseArray("", it, line, lineNum, fs) );
					++it;
					break;
				default:
					throw parse_error("Unexpected item type in array", lineNum);
			}
		}
		if (it == line.end()) // If at the end of line but no ']' yet
		{
			it = _arr_getNextArrayLine(it, line, lineNum, fs);
			if (expect_value == false && *it != ']')
				throw parse_error("Missing coma or `]' in array", lineNum - 1);
		}
	}
	return (array);
}

// Expects `it' to be pointing to the first character after the two `['
inline
void	Document::_parseGroupArray(str_const_it it, str_const_it end, Value::size_type lineNum)
{
	// Get the key
	str_const_it key_end = it;
	while (key_end != end && *key_end != ']')
		++key_end;
	if (*(key_end + 1) != ']')
		throw parse_error(string_type("Expected `]' at the end of Group Array, found `") + *(key_end+1) + '\'', lineNum);
	if (_hasNonWhitespace(key_end + 2, end))
		throw parse_error("Found non-whitespace characters after Group Array declaration", lineNum);
	// Check key validity
	string_type key(it, key_end);
	for (it = key.begin(); it != key.end(); ++it)
		if (!_isBareKeyChar(*it) && *it != '.')
			throw parse_error("Illegal key character", lineNum);
	
	// Find the "last key" in the key, i.e. "c" in "[test.a.b.c]"
	_currentGroup = &_root;
	str_const_it dot = std::find(key.begin(), key.end(), '.');
	str_const_it ItLastKey
		= (key.find_last_of('.') == string_type::npos ? key.begin() : key.begin() + key.find_last_of('.') + 1);

	// Go through all subkeys, automatically create subgroups when it's legal.
	for (it = key.begin(); it != ItLastKey;)
	{
		string_type	subkey(it, dot);
		if (subkey.length() == 0)
			throw (parse_error("Empty key", lineNum));
		_currentGroup = _currentGroup->_getOrAddSubtable(make_group(subkey));
		if (_currentGroup == NULL)
			throw (parse_error("Redeclared key", lineNum));
		it = dot + 1;
		dot = std::find(it, str_const_it(key.end()), '.');
	}

	// Add last key as an Array of Groups
	string_type lastKey (ItLastKey, str_const_it(key.end())); // mfw no cend()
	if (lastKey.length() == 0)
		throw parse_error("Empty key", lineNum);	
	if (!_currentGroup->has(lastKey))
		_currentGroup->group_addValue( make_array(lastKey, TOML::T_GROUP) ); // Add an array here
	if ((*_currentGroup)[lastKey].type() == T_ARRAY) // Returns false if key is already declared
	{
		(*_currentGroup)[lastKey].Array().push_back(make_group("")); // Add a group to the array
		_currentGroup = &(*_currentGroup)[lastKey].Array().back(); // Set current group to that new group
	}
	else
		throw parse_error("Redeclared key", lineNum);
	_currentGroup->_undefinedGroup = false;
}
