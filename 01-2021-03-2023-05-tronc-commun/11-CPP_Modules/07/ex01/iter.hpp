#include <iostream>

template <typename T, typename S>
void	iter(T* array, size_t const &len, S (*f)(T&)) {
	for (size_t i = 0; i != len; i++) {
		if (array[i])
			f(array[i]);
	}
}

template <typename T>
void	addTen(T &value) {
	value += 10;
}

template <typename T, typename S>
void	print_iter(T* array, size_t const &len, S (*f)(T&)) {
	std::cout	<< "Before applying function on the array:"	<< std::endl;
	for (size_t i = 0; i != len; i++) {
		std::cout	<< array[i]	<< std::endl;
	}
	std::cout	<< std::endl;
	::iter<T, S>(array, len, f);
	std::cout	<< "After applying function on the array:"	<< std::endl;
	for (size_t i = 0; i != len; i++) {
		std::cout	<< array[i]	<< std::endl;
	}
}

template <>
void	print_iter(char* array, size_t const &len, void (*f)(char&)) {
	std::cout	<< "Before applying void function on the char array:\n"	<< std::endl;
	std::cout	<< array	<< std::endl;
	std::cout	<< std::endl;
	::iter<char, void>(array, len, f);
	std::cout	<< "After applying void function on the char array:\n"	<< std::endl;
	std::cout	<< array	<< std::endl;
}
