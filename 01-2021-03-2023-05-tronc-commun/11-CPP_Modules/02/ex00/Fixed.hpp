#ifndef FIXED_HPP
# define FIXED_HPP
# include <iostream>

class Fixed {
	
	private:
		int					_rawBits;
		static const int	nbBits;

	public:
		Fixed(void);
		Fixed(Fixed const &src);
		~Fixed(void);
		Fixed & operator=(Fixed const &src);
		int		getRawBits(void) const;
		void	setRawBits(int const raw);
};
#endif 
