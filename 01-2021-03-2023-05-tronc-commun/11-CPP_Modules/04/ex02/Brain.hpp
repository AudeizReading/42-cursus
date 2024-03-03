#ifndef BRAIN_HPP
# define BRAIN_HPP
# include <iostream>

class Brain {
	private:
		size_t		_size;

	public:
		Brain(std::string const &str="", int const &size=100);
		Brain(Brain const &src);
		~Brain(void);
		Brain & operator=(Brain const &src);

		std::string	*ideas;

		size_t	getSize(void) const;
		void	setSize(size_t size);
		void	readIdeas(void) const;
		void	setIdea(std::string const &idea, size_t index);
		void	setIdeas(std::string const &idea);
};
#endif 
