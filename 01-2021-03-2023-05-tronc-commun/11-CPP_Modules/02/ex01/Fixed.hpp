#ifndef FIXED_HPP
# define FIXED_HPP
# include <iostream>
# include <cmath>

class Fixed {
	
	private:
		int					_rawBits;
		static const int	nbBits;

	public:
		Fixed(void);
		Fixed(int const &i);
		Fixed(float const &f);
		Fixed(Fixed const &src);
		~Fixed(void);

		Fixed & operator=(Fixed const &src);
		int		getRawBits(void) const;
		void	setRawBits(int const raw);
		float	toFloat(void) const;
		int		toInt(void) const;
};

std::ostream & operator<<(std::ostream &o, Fixed const &fixed);
#endif 
