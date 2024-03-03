#ifndef CONVERTER_HPP
# define CONVERTER_HPP
# include <iostream>
# include <cmath>
# include <stdexcept>
# include <limits>

class Converter {
	private:
		std::string		_arg;
		double			_value;
		union {
			char	_char;
			int		_int;
			float	_float;
			double	_double;
		};
		
		Converter(Converter const &src);
		Converter & operator=(Converter const &src);

	public:
		class	RangeError: public std::exception {};
		class	OutOfRange: public std::exception {};
		class	InvalidArgument: public std::exception {};

		Converter(std::string const &arg="");
		virtual ~Converter(void);

		void	setCharValue(char const &c);
		void	setSpecialCharValue(char const &c);
		void	setIntValue(double const &value);
		void	setFloatValue(double const &value);
		void	setDoubleValue(double const &value);

		char	getCharValue(void) const;
		int		getIntValue(void) const;
		float	getFloatValue(void) const;
		double	getDoubleValue(void) const;

		void	printChar(char const &c) const;
		void	printCharCasts(void) const;
		void	printIntCasts(void)  const;
		void	printFloatCasts(void) const;
		void	printDoubleCasts(void) const;
		void	convert(void);

		bool	isIntPrintable(void) const;
		bool	isFloatPrintable(void) const;
		bool	hasSevenDigitsOrMore(void) const;
		bool	hasDecimalPoint(void) const;
};
#endif 
