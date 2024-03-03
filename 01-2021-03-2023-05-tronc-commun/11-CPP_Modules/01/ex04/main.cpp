#include <iostream>
#include <fstream>

bool	replaceStr(std::string &str, std::string const &toFind, std::string const &toReplace) {

	bool	ret = false;

	while (str.find(toFind) != std::string::npos) {
		size_t pos = str.find(toFind);

		str.erase(pos, toFind.size());
		str.insert(pos, toReplace);
		ret = true;
	}
	return ret;
}

bool	sed(std::string const &filename, std::string const &toFind, std::string const &toReplace) {

	std::ifstream	ifs(filename);
	std::ofstream	ofs(filename + ".replace", std::ofstream::trunc|std::ofstream::out);
	std::string		tmp;
	bool			ret = false;

	if (!ifs.is_open() || !ofs.is_open()) {
		std::cerr	<< "Error opening file"	<< std::endl;
		return ret;
	}
	while (getline(ifs, tmp, '\n')) {
		if (ifs.fail()) {
			std::cerr	<< "Error reading file"	<< std::endl;
			ret = false;
			break;
		}
		replaceStr(tmp, toFind, toReplace);
		ofs	<< tmp	<< std::endl;
		ret = true;
	}
	ifs.close();
	ofs.close();
	return ret;
}

int	main(int argc, char **argv) {

	if  (argc == 4)
	{
		if (sed((std::string)argv[1], (std::string)argv[2], (std::string)argv[3]))
			return 0;
	}
	else
		std::cerr	<< "Erreur arguments"	<< std::endl;
	return 1;
}
