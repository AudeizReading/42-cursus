1ères choses à faire au 1er démarrage de Debian
-------------------------------------------
En tant que root :
``` bash
	apt upgrade
	apt install sudo
	apt install vim (ainsi que les paquets suggérés à ce moment là)
	update-alternatives --config editor (indiquer le numéro de l'éditeur désiré dans la liste proposée)
```
Ensuite, une fois que vim est installé, on peut s'occuper des fichiers de configurations de vim et de bash, ne serait-ce que pour s'apporter un certain confort dans la saisie du projet b2br.

On commence par le vimrc, puisque c'est avec vim que je fonctionnerai du début à la fin du projet, même pour saisir le bashrc.  
Je modifie, en tant que root, le fichier de configuration /etc/vim/vimrc. Puis je le copie dans mon répertoire utilisateur :
``` bash
	cp /etc/vim/vimrc ~/.vimrc
```
Je fais la même chose avec le bashrc, je l'édite et y apporte les modifications dont j'ai besoin, et je le copie vers le répertoire utilisateur :
``` bash
	cp /etc/bash.bashrc ~/.bashrc
```
