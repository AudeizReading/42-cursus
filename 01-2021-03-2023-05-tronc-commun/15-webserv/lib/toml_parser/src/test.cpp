#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <typeinfo>

#include "../include/Document.hpp"
#include "../include/Array.hpp"

#include "tests.hpp"
// #include "../include/ansi_color.h"
// #include "../include/ansi_color.h"


using namespace TOML; // yeah yeah I know, it's testing, gimme a break

int	first_tests(int argc, const char *argv[])
{
	if (argc < 2) {
		std::cerr << /* ft::F_BRED */("Bruh") << std::endl;
		return 1;
	}
	newtest();
	{
		std::cout << "Size of value: " << sizeof(Value) << std::endl; // rho putain
		std::cout << "Size of string: " << sizeof(std::string) << std::endl;
	}
	newtest();
	{
		std::vector<Value>	vec;
		vec.push_back(Value("group"));
		vec.push_back(Value("test", 42,		TOML::T_INT));
		vec.push_back(Value("test", 42,		TOML::T_FLOAT));
		vec.push_back(Value("test", false,	TOML::T_BOOL));

		for (size_t i = 0; i < vec.size(); ++i) {
			if (vec[i].isFundamental()) {
				vec[i].set(21);
			}
			std::cout << i << " - " << "Type: " << P_TYPE(vec[i].type())
				<< " | " << "Value: " << vec[i] << std::endl;
		}
	}
	newtest();
	try
	{
		Document	doc(argv[1]);
		doc.parse();

		std::cout << P_TYPE( doc.at("rootString").type() ) << std::endl;
		std::cout << '['<<doc.at("rootString")<<']' << std::endl;
		
		std::cout << P_TYPE( doc["main"].type() ) << std::endl;
		std::cout << '['<<doc["main"]<<']' << std::endl;

		Document	maindoc = doc["main"];
		std::cout << P_TYPE( maindoc["int"].type() ) << std::endl;
		std::cout << '['<<maindoc["int"]<<']' << std::endl;

		Document	subdoc = maindoc["sub"];
		std::cout << P_TYPE( subdoc["bool"].type() ) << std::endl;
		std::cout << '['<<subdoc["bool"]<<']' << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cout << REDB"Caught std::out_of_range: " << e.what() << RESET << std::endl;
	}
	newtest("Nested operator[]");
	try
	{
		Document	doc;
		doc.parse(argv[1]);
		std::cout << P_TYPE( doc.at("rootString").type() ) << std::endl;
		std::cout << '['<<doc.at("rootString")<<']' << std::endl;
		
		std::cout << P_TYPE( doc["main"]["sub"]["bool"].type() ) << std::endl;
		std::cout << '['<< doc["main"]["sub"]["bool"] <<']' << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cout << REDB"Caught std::out_of_range: " << e.what() << RESET << std::endl;
	}
	newtest("Nested at()");
	try
	{
		Document	doc;
		doc.parse(argv[1]);
		std::cout << P_TYPE( doc.at("rootString").type() ) << std::endl;
		std::cout << '['<<doc.at("rootString")<<']' << std::endl;
		
		std::cout << P_TYPE( doc.at("main").at("sub").at("bool").type() ) << std::endl;
		std::cout << '['<< doc.at("main").at("sub").at("bool") <<']' << std::endl;
	}
	catch (std::out_of_range const& e)
	{
		std::cout << REDB"Caught std::out_of_range: " << e.what() << RESET << std::endl;
	}
	newtest("Strings");
	{
		Document	doc(argv[1]);
		doc.parse();

		std::cout << '[' << doc["test"]["salut"] << ']' << std::endl;
		std::cout << '[' << doc["test"]["coucou"] << ']' << std::endl;
	}
	newtest("Array");
	{
		Document	doc(argv[1]);
		doc.parse();

		Document	test_a = doc["test"]["a"].Group();

		std::cout << P_TYPE( test_a["simple1"].type() ) << std::endl;
		std::cout << test_a["simple1"] << std::endl;

		std::cout << P_TYPE( test_a["simple2"].type() ) << std::endl;
		std::cout << test_a["simple2"] << std::endl;
		
		std::cout << P_TYPE( test_a["simple3"].type() ) << std::endl;
		std::cout << test_a["simple3"] << std::endl;

		std::cout << P_TYPE( test_a["simple4"].type() ) << std::endl;
		std::cout << test_a["simple4"] << std::endl;

		std::cout << P_TYPE( test_a["less-simple"].type() ) << std::endl;
		std::cout << test_a["less-simple"] << std::endl;

		std::cout << P_TYPE( test_a["wtf"].type() ) << std::endl;
		std::cout << test_a["wtf"] << std::endl;
	}
	newtest();
	{
		Document	doc(argv[1]);
		doc.parse();
		Document	test_a = doc["test"]["a"]; 

		std::cout << P_TYPE( test_a["simple1"].type() ) << std::endl;
		std::cout << test_a["simple1"] << std::endl;
		std::cout << test_a["simple1"][0] << std::endl;
		std::cout << test_a["simple1"][1] << std::endl;
		std::cout << test_a["simple1"][2] << std::endl;

		for (Value::array_type::iterator it = test_a["simple2"].Array().begin(); it != test_a["simple2"].Array().end(); ++it)
			std::cout << P_TYPE( it->type() ) << "\t" << *it << std::endl;

		for (Value::array_type::iterator it = test_a["simple3"].Array().begin(); it != test_a["simple3"].Array().end(); ++it)
			std::cout << P_TYPE( it->type() ) << "\t" << *it << std::endl;

		for (Value::array_type::iterator it = test_a["simple4"].Array().begin(); it != test_a["simple4"].Array().end(); ++it)
			std::cout << P_TYPE( it->type() ) << "\t" << *it << std::endl;
	}
	newtest("Array iterators");
	{
		Document	doc(argv[1]);
		doc.parse();
		Document	test_a = doc["test"]["a"];

		for (Value::array_type::iterator it = test_a["less-simple"].Array().begin(); it != test_a["less-simple"].Array().end(); ++it)
			std::cout << P_TYPE( it->type() ) << "\t" << *it << std::endl;
		
		for (Value::array_type::iterator it = test_a["wtf"].Array().begin(); it != test_a["wtf"].Array().end(); ++it)
			std::cout << P_TYPE( it->type() ) << "\t" << *it << std::endl;
	}
	newtest("Nested array operator[]");
	{
		Document	doc(argv[1]);
		doc.parse();
		Document	test_a = doc["test"]["a"];

		std::cout << test_a["less-simple"][0][0] << std::endl;
		std::cout << test_a["less-simple"][0][1] << std::endl;
		std::cout << test_a["less-simple"][1][0] << std::endl;

		std::cout << "===============================" << std::endl;

		std::cout << test_a["wtf"][0][0][0] << std::endl;
		std::cout << test_a["wtf"][0][1][0] << std::endl;
		std::cout << test_a["wtf"][1][0][0] << std::endl;
	}
	newtest("Nested array operator[] editing");
	{
		Document	doc(argv[1]);
		doc.parse();
		Document	test_a = doc["test"]["a"];

		for (Value::array_type::iterator it = test_a["less-simple"].Array().begin(); it != test_a["less-simple"].Array().end(); ++it)
			std::cout << P_TYPE( it->type() ) << "\t" << *it << std::endl;

		test_a["less-simple"][0][0].Int() = 9;
		test_a["less-simple"][0][1].Int() = 8;
		test_a["less-simple"][0][2].Int() = 7;
		test_a["less-simple"][1][0].Str() = "fizz";
		test_a["less-simple"][1][1].Str() = "buzz";
		test_a["less-simple"][1][2].Str() = "fizzbuzz";

		std::cout << "===============================" << std::endl;

		for (Value::array_type::iterator it = test_a["less-simple"].Array().begin(); it != test_a["less-simple"].Array().end(); ++it)
			std::cout << P_TYPE( it->type() ) << "\t" << *it << std::endl;
	}
	if (argc >= 3)
	{
		try
		{
			newtest("Config file demo");

			Document	config(argv[2]);
			config.parse();

			std::cout << config.at("server").at("name") << std::endl;
			int port = config.at("server").at("port").Int();
			std::cout << "port: " << port << std::endl;

			Document	location(config.at("server").at("location"));
			std::cout << "location: " << location.at("root") << std::endl;
		}
		catch (std::exception const& e)
		{
			std::cout << REDB"Caught exception: " << e.what() << RESET << std::endl;
		}
	}
	newtest("at_or()");
	{
		Document	doc(argv[1]);
		doc.parse();

		std::cout << doc.at_or("rootString", Value("", "default")) << std::endl;
		std::cout << doc.at_or("pouet", Value("")) << std::endl;

		std::cout << doc["test"].at_or("coucou", Value("", "default")) << std::endl;
		std::cout << doc["test"].at_or("hello", Value("", "default")) << std::endl;

		std::cout << doc["test"]["a"]["simple1"].at_or(0, Value("", 42, TOML::T_INT)) << std::endl;
		std::cout << doc["test"]["a"]["simple1"].at_or(5, Value("", 42, TOML::T_INT)) << std::endl;
	}
	newtest("Group array");
	{
		Document	doc(argv[1]);
		doc.parse();

		std::cout << doc.has("lexa") << std::endl;

		std::cout << P_TYPE( doc["lexa"].type() ) << std::endl;
		std::cout << doc["lexa"] << std::endl;

		std::cout << "lexa[0]: " << std::endl;
		std::cout << P_TYPE( doc["lexa"][0].type() ) << std::endl;
		std::cout << doc["lexa"][0] << std::endl;

		std::cout << "lexa[0][\"i\"]: " << std::endl;
		std::cout << P_TYPE( doc["lexa"][0]["i"].type() ) << std::endl;
		std::cout << doc["lexa"][0]["i"] << std::endl;
	}
	if (argc >= 3 && std::string(argv[2]) == "obj_array.toml")
	{
		try
		{
			newtest("Group array 2");
			Document	doc(argv[2]);
			doc.parse();

			std::cout << P_TYPE( doc["chacal"].type() ) << std::endl;
			std::cout << doc["chacal"] << std::endl;
			
			std::cout << std::endl;

			std::cout << P_TYPE( doc["lexa"].type() ) << std::endl;
			std::cout << doc["lexa"] << std::endl;
			
			std::cout << std::endl;

			std::cout << P_TYPE( doc["test"].type() ) << std::endl;
			std::cout << doc["test"] << std::endl;
			
			std::cout << std::endl;

			std::cout << P_TYPE( doc["test"][1]["sub"][0].type() ) << std::endl;
			std::cout << doc["test"][1]["sub"][0] << std::endl;
			
			std::cout << std::endl;

			std::cout << P_TYPE( doc["test"][1]["sub"][0]["toto"].type() ) << std::endl;
			std::cout << doc["test"][1]["sub"][0]["toto"] << std::endl;
		}
		catch(const std::exception& e)
		{
			std::cout << REDB"Caught exception: " << e.what() << RESET << std::endl;
		}
	}
	if (argc >= 3 && std::string(argv[2]) == "stdin")
	{
		newtest("stdin");
		{
			Document	doc;
			doc.parse(std::cin);

			std::cout << doc["truc"] << std::endl;
		}
	}
	return 0;
}
