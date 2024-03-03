/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   DocumentIterator.ipp                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/05 17:11:46 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/10 21:41:04 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

#include "DocumentIterator.hpp"

using namespace TOML::__detail;

template <class T>
inline
DocumentIterator<T>&	DocumentIterator<T>::operator++()
{
	yolo:
	++(_stack.top().second);
	while (_stack.top().second < _stack.top().first._hashmap.end()
		&& _stack.top().second->type() == TOML::T_GROUP)
	{
		// std::cout << BLUHB	<<  _stack.top().second.operator*() << '\n'
		// 					<< *_stack.top().second->_hashmap.begin() << RESET << std::endl;

		_stack.push( pair_type(_stack.top().second.operator*(),
									_stack.top().second->_hashmap.begin()) );
	}
	if (_stack.size() > 1
		&& _stack.top().second >= _stack.top().first._hashmap.end())
	{
		_stack.pop();
		goto yolo;
		// ++(_stack.top().second);
	}
	return *this;
}

template <class T>
inline
DocumentIterator<T>		DocumentIterator<T>::operator++(int)
{
	DocumentIterator	tmp(*this);
	this->operator++();
	return tmp;
}
