#include <iostream>
#include <string>
#define STR(x) #x

int	main(void) {
	std::string	brainStr("HI THIS IS BRAIN");
	std::string	*stringPTR = &brainStr;
	std::string	&stringREF = brainStr;

	std::cout	<< "memory address variable "	<< STR(brainStr)
				<< "  : "						<< &brainStr
				<< "; value: "					<< brainStr
				<< std::endl;

	std::cout	<< "memory address variable "	<< STR(stringPTR)
				<< " : "						<< stringPTR 
				<< "; value: "					<< *stringPTR
				<< std::endl;

	std::cout	<< "memory address variable "	<< STR(stringREF)
				<< " : "						<< &stringREF 
				<< "; value: "					<< stringREF
				<< std::endl;
	return 0;	
}
