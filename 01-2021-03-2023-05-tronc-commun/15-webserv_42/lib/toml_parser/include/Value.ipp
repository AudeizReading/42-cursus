/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Value.ipp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/25 13:52:14 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/10 23:47:04 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

#include "Value.hpp"

// Using switch case to get compiler warning against forgotten enum values
inline
const char* typeToChar(TOML::Type type)
{
	switch (type)
	{
		case TOML::T_INT:
			return ("Int");
		case TOML::T_FLOAT:
			return ("Float");
		case TOML::T_BOOL:
			return ("Bool");
		case TOML::T_STRING:
			return ("String");
		case TOML::T_GROUP:
			return ("Group");
		case TOML::T_ARRAY:
			return ("Array");
		case TOML::T_DATE:
			return ("Date");
		case TOML::T_UNDEF:
			return ("Undefined");
	}
}


// ============================================================================================== //
// --------------------------------------- PUBLIC METHODS --------------------------------------- //
// ============================================================================================== //

inline
Value::Value(string_type const& key, float_type floating, TOML::Type type) : _type(type), _key(key)
{
	if (_type == T_INT)
		_int = static_cast<int_type>(floating);
	else if (_type == T_BOOL)
		_bool = static_cast<bool_type>(floating);
	else if (_type == T_FLOAT)
		_float = floating;
	else
		throw (bad_type("Value: tried to construct fundamental value with non-fundamental type"));
}

// If the Group doesn't exist yet, add it where it belongs, and return a pointer to it.
// If the Group exists, return a pointer to it.
// If the Group doesn't exist but this key has already been declaredm return NULL.
// See Document::_parseGroup for more details.
inline
Value*	Value::_getOrAddSubtable(Value const& group)
{
	assert(isGroup() && group.isGroup());

	for (std::vector<Value>::iterator it = _hashmap.begin(); it != _hashmap.end(); ++it)
	{
		if (group._key == it->_key && it->isGroup()) // Found subgroup
			return (it.operator->());
		else if (group._key == it->_key && it->isArray() && it->Array().type() == T_GROUP)
			return &(it->Array().back());
		else if (group._key == it->_key) // Subgroup key conflicts with other key
			return NULL;
	}
	_hashmap.push_back(group);
	return (_hashmap.end() - 1).operator->();
}

inline
bool	Value::has(string_type const& key) const
{
	std::vector<Value>::const_iterator it;
	for (it = _hashmap.begin(); it != _hashmap.end() && it->_key != key; ++it) ;
	return it != _hashmap.end();
}

inline
Value&			Value::at(string_type const& key)
{
	if (!isGroup())
		throw (bad_type("Value::at(Value::string_type const&) called with non-Group type"));
	std::vector<Value>::iterator it;
	for (it = _hashmap.begin(); it != _hashmap.end() && it->_key != key; ++it) ;
	if (it == _hashmap.end())
		throw std::out_of_range("Value::at: std::out_of_range");
	return *it;
}

inline
Value const&	Value::at(string_type const& key) const
{
	if (!isGroup())
		throw (bad_type("Value::at(Value::string_type const&) called with non-Group type"));
	std::vector<Value>::const_iterator it;
	for (it = _hashmap.begin(); it != _hashmap.end() && it->_key != key; ++it) ;
	if (it == _hashmap.end())
		throw std::out_of_range("Value::at: std::out_of_range");
	return *it;
}

inline
Value&			Value::at(size_type n)
{
	if (!isArray())
		throw (bad_type("Value::at(Value::size_type) called with non-Array type"));
	if (n > _array.size())
		throw std::out_of_range("Value::at: std::out_of_range");
	return _array[n];
}

inline
Value const&	Value::at(size_type n) const
{
	if (!isArray())
		throw (bad_type("Value::at(Value::size_type) called with non-Array type"));
	if (n > _array.size())
		throw std::out_of_range("Value::at: std::out_of_range");
	return _array[n];
}

inline
Value	Value::at_or(string_type const& key, Value val) const noexcept
{
	std::vector<Value>::const_iterator it;
	for (it = _hashmap.begin(); it != _hashmap.end() && it->_key != key; ++it) ;
	if (it == _hashmap.end())
		return val; // No need to check for group before, _hashmap is empty
	return *it;
}

inline
Value	Value::at_or(size_type n, Value val) const noexcept
{
	if (!isArray() || n > _array.size())
		return val;
	return _array[n];
}

inline
Value&			Value::operator[](string_type const& key) noexcept
{
	std::vector<Value>::iterator it;
	for (it = _hashmap.begin(); it->_key != key && it != _hashmap.end(); ++it) ;
	return *it;
}

inline
Value const&	Value::operator[](string_type const& key) const noexcept
{
	std::vector<Value>::const_iterator it;
	for (it = _hashmap.begin(); it->_key != key && it != _hashmap.end(); ++it) ;
	return *it;
}

inline
Value&			Value::operator[](size_type n) noexcept
{
	return _array[n];
}

inline
Value const&	Value::operator[](size_type n) const noexcept
{
	return _array[n];
}

inline
Value::bool_type	Value::set(float_type floating) noexcept
{
	if (isInt())
		_int = static_cast<int_type>(floating);
	else if (isBool())
		_bool = static_cast<bool_type>(floating);
	else if (isFloat())
		_float = floating;
	else
		return false;
	return true;
}

inline
Value::bool_type	Value::set(string_type const& string)
{
	if (isStr())
		_str = string;
	else
		return false;
	return true;
}

inline
Value::bool_type	Value::set(group_type const& group)
{
	if (isGroup())
		*this = group;
	else
		return false;
	return true;
}

inline
bool	Value::erase(string_type const& key)
{
	std::vector<Value>::iterator it;
	for (it = _hashmap.begin(); it != _hashmap.end(); ++it)
	{
		if (it->_key == key)
		{
			_hashmap.erase(it);
			return true;
		}
	}
	return false;
}

inline
Value*	Value::group_addValue(Value const& val)
{
	if (!this->isGroup())
		throw bad_type( (string_type("Called group_addValue() on a TOML::Value with type ")
				+ typeToChar(this->type())).c_str() );
	for (std::vector<Value>::iterator it = _hashmap.begin(); it != _hashmap.end(); ++it)
	{
		if (it->_key == val.key())
		{
			if (val._type == T_GROUP && it->_type == T_GROUP && it->_undefinedGroup == true)
				return it.operator->();
			else
				return NULL;
		}
	}
	_hashmap.push_back(val);
	return &_hashmap.back();
}

inline
Value*	Value::groupArray_addValue(Value const& val)
{
	if (!this->isArray())
		throw bad_type( (string_type("Called groupArray_addValue() on a TOML::Value with type ")
				+ typeToChar(this->type())).c_str() );
	if (!val.isGroup())
		throw bad_type( ( string_type("Tried to add a TOML::") + typeToChar(this->type()) + " to a group array" ).c_str() );
	this->Array().push_back(val);
	return &this->Array().back();
}

// ============================================================================================== //
// ---------------------------------------- OUT OF CLASS ---------------------------------------- //
// ============================================================================================== //

inline
std::ostream&	operator<<(std::ostream& out, Value const& val)
{
	switch (val.type())
	{
		case TOML::T_INT:
			out << val._int;
			break;
		case TOML::T_FLOAT:
			out << val._float;
			break;
		case TOML::T_BOOL:
			out << (val._bool == true ? "true" : "false");
			break;
		case TOML::T_STRING:
			out << val._str;
			break;
		case TOML::T_GROUP:
		{
			out << "Group " << val._key << "("<<val._hashmap.size()<<")" << "->{ ";
			for (std::vector<Value>::const_iterator it = val._hashmap.begin(); it != val._hashmap.end(); ++it)
				out << *it << (it == val._hashmap.end() - 1 ? " " : ", ");
			out << "}";
			break;
		}
		case TOML::T_ARRAY:
		{
			const char *delim = (val._array.type() == T_STRING ? "\"" : ""); // Put double quotes around strings
			out << '[';
			for (Value::array_type::const_iterator it = val._array.begin(); it != val._array.end(); ++it)
			{
				out << delim << *it << delim
					<< (it == val._array.end() - 1 ? "" : ", "); // Put coma after value except at end of array
			}
			out << ']';
			break;
		}
		case TOML::T_DATE:
			out << "TODO: dates";
		case TOML::T_UNDEF:
			out << "Undefined";
	}
	return out;
}
