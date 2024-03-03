/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   iterator.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/06/13 19:27:37 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/11 03:46:01 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#pragma once

// #include <memory>
#include <stddef.h>
#include "iterator_traits.hpp"

namespace ft
{

// struct input_iterator_tag {};
// struct output_iterator_tag {};
// struct forward_iterator_tag			: public input_iterator_tag {};
// struct bidirectional_iterator_tag	: public forward_iterator_tag {};
// struct random_access_iterator_tag	: public bidirectional_iterator_tag {};

template < class _Category, class T, class _Distance = ptrdiff_t,
	class _Pointer = T*, class _Reference = T& >
struct iterator
{
	typedef T			value_type;
	typedef _Distance	difference_type;
	typedef _Pointer	pointer;
	typedef _Reference	reference;
	typedef _Category	iterator_category;
};

// ============================================================================================== //
// ---------------------------------------- FT::DISTANCE ---------------------------------------- //
// ============================================================================================== //
 
template<class It>
static typename iterator_traits<It>::difference_type 
	_do_distance(It first, It last, ::std::input_iterator_tag)
{
	typename iterator_traits<It>::difference_type retval = 0;

	for (; first != last; ++first, ++retval)
		;
	return (retval);
}
 
template<class It>
static typename iterator_traits<It>::difference_type 
	_do_distance(It first, It last, ::std::random_access_iterator_tag)
{
	return (last - first);
}
 
template<class It>
typename iterator_traits<It>::difference_type 
	distance(It first, It last)
{
	return _do_distance(first, last, typename iterator_traits<It>::iterator_category());
}

// ============================================================================================== //
// ---------------------------------------- FT::ADVANCE ----------------------------------------- //
// ============================================================================================== //
 
template<class InputIt>
static void	_do_advance(InputIt& it, typename iterator_traits<InputIt>::difference_type n,
						std::input_iterator_tag)
{
	while (n-- > 0)
		++it;
}
 
template<class BidirIt>
static void	_do_advance(BidirIt& it, typename iterator_traits<BidirIt>::difference_type n,
						std::bidirectional_iterator_tag)
{
	while (n > 0) {
        --n;
        ++it;
    }
    while (n < 0) {
        ++n;
        --it;
    }
}
 
template<class RandomIt>
static void	_do_advance(RandomIt& it, typename iterator_traits<RandomIt>::difference_type n,
						std::random_access_iterator_tag)
{
	it += n;
}
 
template<class It, class Distance>
void advance(It& it, Distance n)
{
	_do_advance(it, typename iterator_traits<It>::difference_type(n),
		typename std::iterator_traits<It>::iterator_category());
}

// ============================================================================================== //
// ------------------------------------------ FT::PREV ------------------------------------------ //
// ============================================================================================== //

template<class BidirIt>
BidirIt	prev(BidirIt it, typename iterator_traits<BidirIt>::difference_type n = 1)
{
    ft::advance(it, -n);
    return it;
}

}
