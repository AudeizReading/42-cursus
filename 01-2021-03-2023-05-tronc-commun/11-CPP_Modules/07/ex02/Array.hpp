#ifndef ARRAY_HPP
# define ARRAY_HPP
# include <iostream>

template <typename T>
class Array {
	private:
		unsigned int	_size;
		T*				_array;

	public:
		// Constructor without argument (default constructor)
		Array<T>(void) : _size(0), _array(new T[_size]) {};

		// Constructor with an unsigned int argument
		Array<T>(unsigned int n) : _size(n), _array(new T[_size]) {
			bzero(this->_array, sizeof(*this->_array) * this->size());
		}

		// Copy Constructor
		Array<T>(Array<T> const &src) : _size(src.size()), _array(new T(*src._array)) {}

		// Destructor
		~Array<T>(void) { delete [] this->_array; }

		// Assignment Operator
		Array<T> & operator=(Array<T> const &src) {
			if (this != &src) {
				delete [] this->_array;
				this->_array = new T(*src._array);
				std::memcpy(&this->_size, &src.size(), sizeof(this->_size));
			}
			return (*this);
		}

		// Array Subscripting operator
		T & operator[](unsigned int n) {
			if (n >= this->size())
				throw std::exception();
			return this->_array[n];
		}

		// member function size()
		const unsigned int&	size(void) const { return this->_size; }
};
#endif 
