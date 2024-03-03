#ifndef WHATEVER_HPP
# define WHATEVER_HPP

template <typename T>
void	swap(T& a, T& b) {
	T	tmp = a;
	a = b;
	b = tmp;
}

template <typename T>
const T&		min(const T& x, const T& y) {
	return ((x < y) ? x : y);
}

template <typename T>
const T&		max(const T& x, const T& y) {
	return ((x > y) ? x : y);
}
#endif
