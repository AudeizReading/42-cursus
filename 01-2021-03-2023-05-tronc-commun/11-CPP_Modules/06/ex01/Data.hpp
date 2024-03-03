#ifndef DATA_HPP
# define DATA_HPP
# include <iostream>

class Data {
	private:
		Data(Data const &src);
		Data & operator=(Data const &src);

	public:
		Data(uintptr_t val=0);
		virtual ~Data(void);

		uintptr_t	value;
};
#endif 
