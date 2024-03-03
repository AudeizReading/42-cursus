#ifndef ITERATOR_FUNCTIONS_HPP
# define ITERATOR_FUNCTIONS_HPP
# include <iterator_types.hpp>
# include <iostream>

namespace ft
{
	/* --- distance ----------------------------------------------------------- */
	// Attention l'algo de calcul de distance est different selon qu'il s'agisse
	// d'un InputIterator (++) ou d'un RandomAccessIterator (+), on a donc
	// besoin de fonctions template intermediaires specialisees selon le type de
	// l'iterateur qu'on aplera dans la fonction finale distance
	template<class InputIterator>
		typename iterator_traits<InputIterator>::difference_type		get_distance(InputIterator first, InputIterator last, input_iterator_tag)
		{
			typename iterator_traits<InputIterator>::difference_type	dist = 0;

			while (first++ != last) // On ne peut qu'utiliser l'incrementation
				dist++;
			return dist; 
		}

	template<class RandomAccessIterator>
		typename iterator_traits<RandomAccessIterator>::difference_type	get_distance(RandomAccessIterator first, RandomAccessIterator last, random_access_iterator_tag)
		{
			if ((last - first) < 0)
				return (first - last);
			return (last - first); // On s'appuie sur l'acces aleatoire
		}

	template<class InputIterator>
		typename iterator_traits<InputIterator>::difference_type		get_distance(InputIterator first, InputIterator last, std::input_iterator_tag)
		{
			typename iterator_traits<InputIterator>::difference_type	dist = 0;

			while (first++ != last) // On ne peut qu'utiliser l'incrementation
				dist++;
			return dist; 
		}

	template<class RandomAccessIterator>
		typename iterator_traits<RandomAccessIterator>::difference_type	get_distance(RandomAccessIterator first, RandomAccessIterator last, std::random_access_iterator_tag)
		{
			if ((last - first) < 0)
				return (first - last);
			return (last - first); // On s'appuie sur l'acces aleatoire
		}


	template<class InputIterator>
		typename iterator_traits<InputIterator>::difference_type		distance(InputIterator first, InputIterator last)
		{
			// On recupere le type de l'iterateur grace a la classe
			// iterator_traits
			return get_distance(first, last, typename iterator_traits<InputIterator>::iterator_category());
		}

	/* --- advance ------------------------------------------------------------ */
	template<class InputIterator, class Distance>
		void															advance_it(InputIterator it, Distance dist, input_iterator_tag)
		{
			while (dist--)
				++it;
		}

	template<class RandomAccessIterator, class Distance>
		void															advance_it(RandomAccessIterator it, Distance dist, random_access_iterator_tag)
		{
				it += dist;
		}

	template<class InputIterator, class Distance>
		void															advance(InputIterator it, Distance dist)
		{
			advance_it(it, dist, iterator_traits<InputIterator>::iterator_category());
		}

	/* --- back_inserter ------------------------------------------------------ */
	template<class Cont>
		back_insert_iterator<Cont>										back_inserter(Cont& c)
		{
			return back_insert_iterator<Cont>(c);
		}

	/* --- insert ------------------------------------------------------------- */
	template<class Cont, class Iterator>
		insert_iterator<Cont>											inserter(Cont& c, Iterator i)
		{
			return insert_iterator<Cont>(c, typename Cont::iterator(i));
		}
}

#endif
