#ifndef FUNCTION_HPP
# define FUNCTION_HPP
# include "Data.hpp"

uintptr_t	serialize(Data *ptr);
Data*		deserialize(uintptr_t raw) ;
#endif 
