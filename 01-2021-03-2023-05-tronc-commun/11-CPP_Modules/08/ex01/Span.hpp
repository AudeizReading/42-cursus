#ifndef SPAN_HPP
# define SPAN_HPP
# include <iostream>
# include <algorithm>
# include <numeric>
# include <vector>
# include <iterator>

class Span {
	private:
		unsigned int			_N;
		std::vector<int>		*_span;

	public:
		Span(unsigned int N=0);
		Span(Span const &src);
		~Span(void);
		Span & operator=(Span const &src);

		const unsigned int &			getN(void) const;
		unsigned int					getSpanSize(void) const;
		void							getInfos(void) const;
		
		void							addNumber(int n);
		void							addRangeNumber(std::vector<int>::iterator begin, std::vector<int>::iterator end);
		int								shortestSpan(void) const;
		int								longestSpan(void) const;
};

#endif 
