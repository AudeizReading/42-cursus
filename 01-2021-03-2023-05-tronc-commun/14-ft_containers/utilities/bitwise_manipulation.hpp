#ifndef BITWISE_MANIPULATION_HPP
# define BITWISE_MANIPULATION_HPP
# include <iostream>

// Le compilateur n'a jamais accepté que je passe ca en fichier .cpp, erreur de linkage, il faut que je les redeclare inline
namespace ft 
{
	inline unsigned char		reverseBit(const unsigned char& bit)	{ return ~bit; }
	inline unsigned char		resetBit(const unsigned char& bit)		{ return bit & ~bit; } // set all bits to 0
	inline unsigned char		setBit(const unsigned char& bit)		{ return bit | ~bit; } // set all bits to 1

	inline void					printBit(const unsigned char& bit)
	{
		// lecture gros-boutiste, petit-boutiste faire i = 0; i < 8; ++i
		// attention on ne lit qu'un seul octet!
		for (short i = 7; i > -1; --i) std::cout << (((bit >> i) & 1) ? "1" : "0" );
		std::cout << std::endl;
	}

	// pseudo logarithme binaire
	// calcul la puissance de 2 a laquelle n peut etre elevee, permet de calculer la hauteur d'un arbre binaire donc prend en compte un param n de valeur 0 (pr retourner 0) mais la fn lg2 de <cmath> retournerait une exception ce qui ne me convient pas dans le cas present + lancerait une exception car je gere les negs...
	// n = nb duquel on cherche quel est la puissance de 2 correspondante
	// i = nb de fois qu'il faut diviser n par 2 avant d'atteindre 0;
	inline long int				ln2(long int n, long int i) 
	{
		if ((n == 0 || n == 1) && i == 0)
			return 0;
		if (n > 0)
			return ln2(n >> 1, ++i);
		if (n < 0)
			return ln2(1 / (n >> 1), --i);
		return i;
	}
}
#endif
