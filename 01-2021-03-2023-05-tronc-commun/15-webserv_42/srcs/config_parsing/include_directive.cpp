/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   include_directive.cpp                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/05 20:17:13 by pbremond          #+#    #+#             */
/*   Updated: 2022/10/11 05:24:56 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <webserv.hpp>
#include <toml_parser.hpp>

// TODO: switch to const_iterators when possible
 void	_insert_toml_doc_in_group(TOML::Value& target, TOML::Document& src)
{
	for (TOML::Document::iterator it = src.begin(); it != src.end(); ++it)
	{
		if (target.group_addValue(*it) == NULL)
			throw TOML::parse_error("Duplicate value when trying to include TOML file");
	}
}

// NOTE: include has to be a copy and not a reference, else, it gets invalidated when values are added.

// To call whenever a include key is found in config. See the docs (TODO) for more information.
void	include_directive(TOML::Value& target, TOML::Value include)
{
	assert(target.type() == TOML::T_GROUP);

	if (!include.isArray() || include.Array().type() != TOML::T_STRING)
		throw std::runtime_error("Configuration file: illegal include directive"); // TODO: Check the type of exception thrown

	for (TOML::Value::array_type::iterator it = include.Array().begin();
		it != include.Array().end();
		++it)
	{
		TOML::Document	include_doc(it->Str());
		try {
			include_doc.parse();
			_insert_toml_doc_in_group(target, include_doc);
		}
		catch (std::exception const& e) {
			throw std::runtime_error("Failed to include " + it->Str() + ": " + e.what());
		}
	}
	target.erase(include.key());
}
