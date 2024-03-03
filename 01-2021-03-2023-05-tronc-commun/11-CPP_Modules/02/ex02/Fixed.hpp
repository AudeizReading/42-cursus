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

		Fixed &			operator=(Fixed const &src);
		
		bool			operator<(Fixed const &fp) const;
		bool			operator<=(Fixed const &fp) const;
		bool			operator>(Fixed const &fp) const;
		bool			operator>=(Fixed const &fp) const;
		bool			operator==(Fixed const &fp) const;
		bool			operator!=(Fixed const &fp) const;

		Fixed			operator+(Fixed const &fp) const;
		Fixed			operator-(Fixed const &fp) const;
		Fixed			operator*(Fixed const &fp) const;
		Fixed			operator/(Fixed const &fp) const;

		Fixed&			operator++(void);
		Fixed			operator++(int x);
		Fixed&			operator--(void);
		Fixed			operator--(int x);

		static Fixed	min(Fixed &a, Fixed &b);
		static Fixed	min(Fixed const &a, Fixed const &b);
		static Fixed	max(Fixed &a, Fixed &b);
		static Fixed	max(Fixed const &a, Fixed const &b);

		int				getRawBits(void) const;
		void			setRawBits(int const raw);
		float			toFloat(void) const;
		int				toInt(void) const;
};

std::ostream & operator<<(std::ostream &o, Fixed const &fixed);
#endif 
