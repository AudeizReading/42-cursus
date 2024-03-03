#include <iostream>
#include "AMateria.hpp"
#include "Ice.hpp"
#include "Cure.hpp"
#include "ICharacter.hpp"
#include "Character.hpp"
#include "IMateriaSource.hpp"
#include "MateriaSource.hpp"

void	firstTest(std::string const& name) {
	Character	*player = new Character(name);
	std::cout	<< std::endl;
	Ice			*ice = new Ice();
	std::cout	<< std::endl;
	Cure		*cure = new Cure();
	std::cout	<< std::endl;

	player->equip(ice);
	std::cout	<< std::endl;
	player->equip(cure);
	std::cout	<< std::endl;
	player->use(0, *player);
	std::cout	<< std::endl;
	player->use(1, *player);
	std::cout	<< std::endl;
	player->unequip(0);
	std::cout	<< std::endl;
	player->unequip(1);
	std::cout	<< std::endl;
	delete player;
	std::cout	<< std::endl;
	delete ice;
	std::cout	<< std::endl;
	delete cure;
	std::cout	<< std::endl;
}

void	firstBisTest(std::string const& name) {
	ICharacter	*player = new Character(name);
	std::cout	<< std::endl;
	AMateria	*ice = new Ice();
	std::cout	<< std::endl;
	AMateria	*cure = new Cure();
	std::cout	<< std::endl;

	player->equip(ice);
	std::cout	<< std::endl;
	player->equip(cure);
	std::cout	<< std::endl;
	player->use(0, *player);
	std::cout	<< std::endl;
	player->use(1, *player);
	std::cout	<< std::endl;
	player->unequip(0);
	std::cout	<< std::endl;
	player->unequip(1);
	std::cout	<< std::endl;
	delete player;
	std::cout	<< std::endl;
	delete ice;
	std::cout	<< std::endl;
	delete cure;
	std::cout	<< std::endl;
}

void	secondTest(std::string const& name) {
	Character	*player = new Character(name);
	std::cout	<< std::endl;
	Ice			*ice = new Ice();
	std::cout	<< std::endl;
	Cure		*cure = new Cure();
	std::cout	<< std::endl;

	player->equip(ice);
	std::cout	<< std::endl;
	player->equip(cure);
	std::cout	<< std::endl;
	player->use(0, *player);
	std::cout	<< std::endl;
	player->use(1, *player);
	std::cout	<< std::endl;
	player->unequip(1);
	std::cout	<< std::endl;
	player->equip(new Ice());
	std::cout	<< std::endl;
	delete player;
	std::cout	<< std::endl;
	delete cure;
	std::cout	<< std::endl;
}

void	secondBisTest(std::string const& name) {
	ICharacter	*player = new Character(name);
	std::cout	<< std::endl;
	AMateria	*ice = new Ice();
	std::cout	<< std::endl;
	AMateria	*cure = new Cure();
	std::cout	<< std::endl;

	player->equip(ice);
	std::cout	<< std::endl;
	player->equip(cure);
	std::cout	<< std::endl;
	player->use(0, *player);
	std::cout	<< std::endl;
	player->use(1, *player);
	std::cout	<< std::endl;
	player->unequip(1);
	std::cout	<< std::endl;
	player->equip(new Ice());
	std::cout	<< std::endl;
	delete player;
	std::cout	<< std::endl;
	delete cure;
	std::cout	<< std::endl;
}

void	thirdTest(std::string const& name) {
	ICharacter	*player = new Character(name);
	std::cout	<< std::endl;
	AMateria	*meta[MAX];
	std::cout	<< std::endl;
	for (size_t i = 0; i  != MAX; i++) {
		if (i % 2)
			meta[i] = new Cure();
		else
			meta[i] = new Ice();
		std::cout	<< std::endl;
	}
	for (size_t i = 0; i != MAX; i++) {
		player->equip(meta[i]);
		std::cout	<< std::endl;
	}
	Cure	*cure = new Cure();
	std::cout	<< std::endl;
	player->equip(cure);
	std::cout	<< std::endl;
	for (size_t i = 0; i != MAX; i++) {
		player->use(i, *player);
		std::cout	<< std::endl;
	}
	player->use(2, *player);
	std::cout	<< std::endl;
	player->use(MAX, *player);
	std::cout	<< std::endl;
	player->unequip(MAX);
	std::cout	<< std::endl;
	player->unequip(2);
	std::cout	<< std::endl;
	player->equip(cure);
	std::cout	<< std::endl;
	ICharacter	*player2 = new Character("Bernie");
	std::cout	<< std::endl;
	player2->equip(new Ice());
	std::cout	<< std::endl;
	ICharacter	*player3 = new Character("Ronnie");
	std::cout	<< std::endl;
	std::cout	<<	"player3: "	<< player3->getName()	<< std::endl;
	player3->equip(meta[1]->clone());
	std::cout	<< std::endl;
	player3->use(0, *player2);
	std::cout	<< std::endl;
	player2->use(0, *player3);
	std::cout	<< std::endl;
	player->use(2, *player3);
	std::cout	<< std::endl;
	delete meta[2];
	std::cout	<< std::endl;
	delete player;
	std::cout	<< std::endl;
	delete player2;
	std::cout	<< std::endl;
	delete player3;
	std::cout	<< std::endl;
}

void	fourthTest(void) {
	Character	*player = new Character("Harry");
	std::cout	<< std::endl;
	for (size_t i = 0; i != MAX; i++) {
		player->equip(new Ice());
		std::cout	<< std::endl;
	}
	Character	*p2 = new Character(*player);
	std::cout	<< std::endl;
	p2->setName("Jimi");
	std::cout	<< std::endl;
	p2->use(1, *player);
	std::cout	<< std::endl;
	Character	p3;
	std::cout	<< std::endl;
	p3 = *p2;
	std::cout	<< std::endl;
	p3.setName("Willy");
	std::cout	<< std::endl;
	p3.use(1, *p2);
	std::cout	<< std::endl;
	delete player;
	std::cout	<< std::endl;
	delete p2;
	std::cout	<< std::endl;
}

void	fifthTest(void) {
	IMateriaSource* src = new MateriaSource();
	src->learnMateria(new Ice());
	src->learnMateria(new Cure());

	ICharacter* me = new Character("me");

	AMateria* tmp;
	tmp = src->createMateria("ice");
	me->equip(tmp);
	tmp = src->createMateria("cure");
	me->equip(tmp);

	ICharacter* bob = new Character("Bob");

	me->use(0, *bob);
	me->use(1, *bob);

	delete bob;
	delete me;
	delete src;
}

int	main(void)
{
	std::cout	<< "/* --- First test --------------------------------------------------------- */"
				<< std::endl;
	firstTest("Bob");
	std::cout	<< "\n/* --- First bis test------------------------------------------------------ */"
				<< std::endl;
	firstBisTest("Bob2");
	std::cout	<< "\n/* --- Second test -------------------------------------------------------- */"
				<< std::endl;
	secondTest("Gary");
	std::cout	<< "\n/* --- Second bis test----------------------------------------------------- */"
				<< std::endl;
	secondBisTest("Gary2");
	std::cout	<< "\n/* --- Third test --------------------------------------------------------- */"
				<< std::endl;
	thirdTest("Alfie");
	std::cout	<< "\n/* --- Fourth test -------------------------------------------------------- */"
				<< std::endl;
	fourthTest();
	std::cout	<< "\n/* --- Fifth test --------------------------------------------------------- */"
				<< std::endl;
	fifthTest();
	return 0;
}
