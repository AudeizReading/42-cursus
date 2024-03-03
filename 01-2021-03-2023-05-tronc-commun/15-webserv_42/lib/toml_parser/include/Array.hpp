

#pragma once

#include "Value.hpp"
#include "ft_containers/type_traits.hpp"
#include "types.hpp"

#ifndef TOML_IGNORE_CPP_STANDARD
# if __cplusplus != 199711L
#  warning "TOML::Array was developped for C++98. Later C++ standard introduce std::vector overloads that aren't supported. Use with care."
#  warning "Define macro TOML_IGNORE_CPP_STANDARD to ignore this warning"
# endif
#endif

namespace TOML
{

namespace __detail
{

template <class Val>
class Array : public std::vector<Val>
{
	private:
		typedef typename	std::vector<Val>	_Base;

		TOML::Type	_type;

	public:
		typedef typename	_Base::value_type				value_type;
		typedef typename	_Base::reference				reference;
		typedef typename	_Base::const_reference			const_reference;
		typedef typename	_Base::pointer					pointer;
		typedef typename	_Base::const_pointer			const_pointer;
		typedef typename	_Base::iterator					iterator;
		typedef typename	_Base::const_iterator			const_iterator;
		typedef typename	_Base::reverse_iterator			reverse_iterator;
		typedef typename	_Base::const_reverse_iterator	const_reverse_iterator;

		typedef typename	Val::size_type					size_type;
		typedef typename	Val::difference_type			difference_type;

		Array(TOML::Type type = TOML::T_UNDEF) : _type(type) {}

		TOML::Type	type() const { return _type; }
	
	public:
		inline iterator	insert(iterator pos, const value_type& val)
		{
			if (val.type() != _type)
				throw bad_type("insert: Mismatched TOML::Value types in array");
			return _Base::insert(pos, val);
		}
		inline void	insert(iterator pos, size_type n, const value_type& val)
		{
			if (val.type() != _type)
				throw bad_type("insert: Mismatched TOML::Value types in array");
			_Base::insert(pos, n, val);
		}
		template <class InputIt>
		inline
		typename ft::enable_if <
			!ft::is_fundamental<InputIt>::value,
			void
		>::type		insert(iterator pos, InputIt first, InputIt last)
		{
			if (first->type() != _type)
				throw bad_type("insert: Mismatched TOML::Value types in array");
			return _Base::insert(pos, first, last);
		}

		void	assign(size_type count, const value_type& value)
		{
			if (value.type() != _type)
				throw bad_type("assign: Mismatched TOML::Value types in array");
			_Base::assign(count, value);
		}
		template<class InputIt>
		typename ft::enable_if <
			!ft::is_fundamental<InputIt>::value,
			void
		>::type	assign(InputIt first, InputIt last)
		{
			if (first->type() != _type)
				throw bad_type("assign: Mismatched TOML::Value types in array");
			return _Base::assign(first, last);
		}

		inline void	push_back (const value_type& val)
		{
			if (val.type() != _type)
				throw bad_type("push_back: Mismatched TOML::value types in array");
			_Base::push_back(val);
		}
};

} // namespace __detail


} // namespace TOML
