/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   iterator_tests.cpp                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/05 17:30:12 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/10 22:53:21 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>
#include <string>
#include <vector>
#include "tests.hpp"

#include "../include/ansi_color.h"
#include "../include/Document.hpp"

using namespace TOML;

using std::cout;
using std::cerr;
using std::endl;

void	print_recursive(TOML::Document const& doc, std::string ident = "")
{
	for (Document::const_iterator it = doc.begin(); it != doc.end(); ++it)
	{
		if (it->isGroup()) {
			cout << ident + '\t' << "[" + it->key() + "]" << endl;
			print_recursive(Document(*it), ident + '\t');
		}
		else if (it->isArray() && it->Array().type() == T_GROUP)
		{
			for (Document::array_type::const_iterator arr_it = it->Array().begin();
				arr_it != it->Array().end();
				++arr_it)
			{
				cout << ident + '\t' << "[[" + it->key() + "]]" << endl;
				print_recursive(Document(*arr_it), ident + '\t');
				cout << endl;
			}
		}
		else
			std::cout << ident << it->key() << " = " << *it << std::endl;
	}
}

int	iterator_tests(int argc, char const *argv[])
{
	if (argc < 3) {
		std::cerr << F_BRED("Bruh") << std::endl;
		return 1;
	}
	newtest("Document::iterator");
	{
		Document	doc(argv[2]);
		doc.parse();

		Document::iterator	it = doc.begin();
		for (; it != doc.end(); ++it)
		{
			cout << *it << endl << endl;
		}
	}
	newtest("Document::const_iterator");
	{
		Document	doc(argv[1]);
		doc.parse();

		Document::const_iterator	it = doc.begin();
		for (; it != doc.end(); ++it)
		{
			cout << *it << endl << endl;
		}
	}
	newtest("Erase");
	{
		Document	doc(argv[2]);
		doc.parse();

		if (doc.has("main"))
			doc.erase("main");
		else
			doc.erase(doc.begin()->key());
		Document::iterator	it = doc.begin();
		for (; it != doc.end(); ++it)
		{
			cout << *it << endl << endl;
		}
	}
	newtest("Print recursive");
	{
		Document	doc(argv[2]);
		doc.parse();

		print_recursive(doc);
	}
	newtest("Recursive iterators");
	{
		Document	doc(argv[2]);
		doc.parse();

		Document::recursive_iterator it = doc.rec_begin();
		Document::recursive_iterator end = doc.rec_end();
		for (; it != doc.rec_end();)
		{
			cout << it->key() << " = " << *it << endl << endl;
			++it;
		}
	}
	return 0;
}
