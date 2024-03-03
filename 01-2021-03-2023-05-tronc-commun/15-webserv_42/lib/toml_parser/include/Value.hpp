/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Value.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/24 00:57:16 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/11 05:40:42 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// #pragma once
#ifndef VALUE_HPP
# define VALUE_HPP

# include <string>
# include <vector>
# include <typeinfo>
# include <cassert>
# include "ft_containers/type_traits.hpp"
# include "Array.hpp"
# include "exceptions.hpp"
# include "DocumentIterator.hpp"

#include "ansi_color.h"

# ifndef P_TYPE
#  define P_TYPE(x) (typeToChar(x))
# endif

# if __cplusplus == 199711L
#  define noexcept	throw()
# endif

namespace TOML
{

// TODO: comparison operators ? Only compare keys ?
class Value
{
	public:
		typedef		Value				value_type;
		typedef 	std::size_t			size_type;
		typedef 	std::ptrdiff_t		difference_type;
		typedef		Value&				reference;
		typedef		Value const&		const_reference;
		typedef 	Value*				pointer;
		typedef 	Value const*		const_pointer;

		typedef		__int64_t				int_type;
		typedef		double					float_type;
		typedef		bool					bool_type;
		typedef 	std::string				string_type;
		typedef		Value					group_type;
		typedef		__detail::Array<Value>	array_type;

		typedef		std::vector<Value>::const_iterator	const_group_iterator;
		typedef		std::vector<Value>::iterator		group_iterator;

	private:
		friend class Document; // TODO: Remove me when everything is done, if possible
		template <class T>
		friend class __detail::DocumentIterator;

		TOML::Type	_type; // Yes, it's not const anymore. DON'T TOUCH IT.
		// Possible types that the value can be
		union
		{
			int_type	_int;
			double		_float;
			bool		_bool;
		};
		string_type			_str; // Can't be in union. I want C++11 :'(
		array_type			_array; // TODO: Merge me with _hashmap once you've got everything settled
									// Or don't, if you prefer to have something easily portable

		std::vector<Value>	_hashmap; // lol
		string_type			_key;

		bool	_undefinedGroup; // If the group has only been put there automatically,
								 // i.e if it was a subgroup in a [a.b.c] declaration

		// Returns pointer to inserted or found subtable. Does not protect against double insert.
		// Only meant to be used in Document class
		Value	*_getOrAddSubtable(Value const& group);

	public:
		// Int/String/Bool constructor
		explicit Value(string_type const& key, float_type floating, Type type);
		// String constructor
		explicit Value(string_type const& key, string_type const& string) : _type(T_STRING), _str(string), _key(key) {}
		// Array constructor
		explicit Value(string_type const& key, TOML::Type array_type) : _type(T_ARRAY), _array(array_type), _key(key) {}
		// Group constructor
		explicit Value(string_type const& key) : _type(T_GROUP), _key(key), _undefinedGroup(true) { }

		inline Type		type() const noexcept { return _type; }

		inline bool_type	isInt()		const noexcept { return (_type == T_INT);		}
		inline bool_type	isFloat()	const noexcept { return (_type == T_FLOAT);		}
		inline bool_type	isBool()	const noexcept { return (_type == T_BOOL);		}
		inline bool_type	isStr()		const noexcept { return (_type == T_STRING);	}
		inline bool_type	isArray()	const noexcept { return (_type == T_ARRAY);		}
		inline bool_type	isGroup()	const noexcept { return (_type == T_GROUP);		}

		inline bool_type	isFundamental() const noexcept { return (isInt() || isFloat()); }

		inline size_type	groupSize()	const { if (isGroup())	return _hashmap.size();	throw (bad_type("Value::groupSize()"));	}

		inline int_type&			Int()	{ if (isInt())		return _int;	throw bad_type("Value::Int()");		}
		inline float_type&			Float()	{ if (isFloat())	return _float;	throw bad_type("Value::Float()");	}
		inline bool_type&			Bool()	{ if (isBool())		return _bool;	throw bad_type("Value::Bool()");	}
		inline string_type&			Str()	{ if (isStr())		return _str;	throw bad_type("Value::Str()");		}
		inline group_type&			Group()	{ if (isGroup())	return *this;	throw bad_type("Value::Group()");	}
		inline array_type&			Array()	{ if (isArray())	return _array;	throw bad_type("Value::Array()"); 	}

		inline int_type const&		Int()	const { if (isInt())	return _int;	throw bad_type("Value::Int()");		}
		inline float_type const&	Float()	const { if (isFloat())	return _float;	throw bad_type("Value::Float()");	}
		inline bool_type const&		Bool()	const { if (isBool())	return _bool;	throw bad_type("Value::Bool()");	}
		inline string_type const&	Str()	const { if (isStr())	return _str;	throw bad_type("Value::Str()");		}
		inline group_type const&	Group()	const { if (isGroup())	return *this;	throw bad_type("Value::Group()");	}
		inline array_type const&	Array()	const { if (isArray())	return _array;	throw bad_type("Value::Array()"); 	}

		inline string_type const&	key() const	noexcept { return _key; }

		bool	has(string_type const& key) const;

		Value&			at(string_type const& key);
		Value const&	at(string_type const& key) const;
		Value&			at(size_type n);
		Value const&	at(size_type n) const;
		Value			at_or(string_type const& key, Value val) const noexcept;
		Value			at_or(size_type n, Value val) const noexcept;

		Value&			operator[](string_type const& key)       noexcept;
		Value const&	operator[](string_type const& key) const noexcept;
		Value&			operator[](size_type n)       noexcept;
		Value const&	operator[](size_type n) const noexcept;

		bool_type	set(float_type floating) noexcept;
		bool_type	set(string_type const& string); // String assignment cannot guarantee a noexcept
		bool_type	set(group_type const& group); // String assignment cannot guarantee a noexcept

		bool	erase(string_type const& key);

		Value	*group_addValue(Value const& val);
		Value	*groupArray_addValue(Value const& val);

		group_iterator			group_begin()		{ return _hashmap.begin();	}
		const_group_iterator	group_begin() const	{ return _hashmap.begin();	}
		group_iterator			group_end()			{ return _hashmap.end();	}
		const_group_iterator	group_end() const	{ return _hashmap.end();	}

		friend std::ostream&	operator<<(std::ostream& out, Value const& val);
};

#include "Value.ipp"

inline Value	make_int(Value::string_type const& key, Value::int_type x)
{
	return Value(key, x, TOML::T_INT);
}
inline Value	make_int(Value::int_type x)
{
	return Value("", x, TOML::T_INT);
}

inline Value	make_float(Value::string_type const& key, Value::float_type x)
{
	return Value(key, x, TOML::T_FLOAT);
}
inline Value	make_float(Value::float_type x)
{
	return Value("", x, TOML::T_FLOAT);
}

inline Value	make_bool(Value::string_type const& key, Value::bool_type x)
{
	return Value(key, x, TOML::T_BOOL);
}
inline Value	make_bool(Value::bool_type x)
{
	return Value("", x, TOML::T_BOOL);
}

inline Value	make_string(Value::string_type const& key, Value::string_type const& str)
{
	return Value(key, str);
}
inline Value	make_string(Value::string_type const& str)
{
	return Value("", str);
}

inline Value	make_array(Value::string_type const& key, TOML::Type array_type)
{
	return Value(key, array_type);
}
inline Value	make_array(TOML::Type array_type)
{
	return Value("", array_type);
}

inline Value	make_group(Value::string_type const& key)
{
	return Value(key);
}

} // namespace TOML

# if __cplusplus == 199711L
#  undef noexcept
# endif

#endif
