Installation de la Machine virtuelle avec Virtual Box sur Mac OSX
=================================================================

Téléchargement et installation de Virtual Box:
----------------------------------------------
- Via le MSC de 42
- Via le site de Oracle : [Virtual Box](https://www.virtualbox.org/wiki/Download_Old_Builds_6_0)

Téléchargement de l'iso de l'OS (à placer dans l'emplacement de son choix):
---------------------------------------------------------------------------
- Debian (verifier que la version soit la plus récente et stable) [Debian iso](https://www.debian.org/index.fr.html)
- CentOS (verifier que la version soit la plus récente et stable) [CentOS](https://www.centos.org/download/)

Lancement de l'application Virtual Box et création de la nouvelle vm.
---------------------------------------------------------------------
- On clique sur **New**, représenté par l'étoile bleue  en haut à droite.  
![Ajout d'une nouvelle machine virtuelle](./img/vm-install/00_creation_vm.png)
- Une fenêtre s'ouvre afin que l'on choisisse l'emplacement de la future machine virtuelle (soit ~/goinfre, soit sur un disque dur externe - pratique si comme moi, on n'est qu'à mi-temps à l'école pour pouvoir bosser sur le projet chez soi.
*Update : travailler avec une machine installée sur un disque dur aura été un calvaire, et c'est une vraie fausse bonne idée. Je n'ai rencontré que des soucis, qui m'ont fait perdre beaucoup de temps pour rien, notamment pour tout ce qui concerne la partie ssh du projet, je ne parle même pas de la fois où le Mac de l'école m'éjectait le disque dur externe toutes les 5 minutes. Cela aura été plus rapide de travailler sur 2 machines séparées (une à l'école, installée sur le goinfre, et une à la maison), qu'au travers d'un disque dur.*
- On donne le nom que l'on souhaite à la machine, on choisit l'emplacement, et on renseigne les paramètres de la machine hébergeant la vm.  
![Nom de la nouvelle machine virtuelle](./img/vm-install/01_creation_vm.png)
- On choisit le montant de la RAM qu'on décider d'allouer à la vm.  
![Définition de la RAM](./img/vm-install/02_creation_vm.png)
- On demande la création d'un disque dur virtuel. 
![Création disque dur virtuel](./img/vm-install/03_creation_vm.png)
- On choisit le type de fichiers que l'on compte utiliser pour la vm. Ici, on choisit **vdi** (VirtualBox Disk Image), par rapport à l'attendu du projet.  
![Type de fichiers](./img/vm-install/04_creation_vm.png)
- Ensuite on choisit si on stocke les données dynamiquement, ainsi on n'alloue que la place qu'elles occupent.  
![Stockage dynamique des données](./img/vm-install/05_creation_vm.png)
- On indique l'endroit où on stockera le fichier .vdi de la machine, ainsi que la taille maximale de stockage autorisée sur la vm.  
![Emplacement fichier .vdi](./img/vm-install/06_creation_vm.png)
- La machine est créée, bientôt on pourra la démarrer avec **Start**. L'option **Settings** permet de revenir sur les différentes configurations abordées dans cette partie; **Remove** supprime la machine virtuelle; **Clone** permet de cloner la machine virtuelle, ce sera utile lors de la correction.  
![Nom de la nouvelle machine virtuelle](./img/vm-install/07_creation_vm.png)

Configuration de l'OS
---------------------
Il manque encore un élément essentiel au bon fonctionnement de notre machine : il faut lui donner l'emplacement de l'image iso de l'OS qu'on a choisi d'installer dessus.  
Il faut se rendre dans les **Settings** de la machine, onglet **Storage**. Sous le panneau **Storage devices** sur la gauche, choisir **Empty**, puis sur la droite, cliquer sur l'icône disque et sur l'option **Choose Virtual Optical Disk File**.  
![Liaison iso à vm](./img/vm-install/08_config_OS.png)
On pourra se rendre à l'emplacement de l'iso pour sélectionner l'image de l'OS.
![Choix iso](./img/vm-install/09_config_OS.png)
On voit ici, que l'image a bien été chargée, on va pouvoir démarrer la machine virtuelle.
### Réseau
![Chargement iso](./img/vm-install/10_config_OS.png)
Un point que j'ai découvert, en plein milieu de la configuration ssh : la connexion doit se faire "par pont" (bridge), sinon il sera impossible de se connecter en ssh via le terminal iTerm2 installé sur sa machine Mac vers la machine virtuelle *(en revanche aucun souci dans la console de la vm, pour se connecter en ssh - mais ce n'est pas ce que l'on souhaite)*. Ce réglage se fait sur le panneau de configuration de Virtual Box
![Configuration réseau](./img/vm-install/10_bis_config_OS.png)
Autre élément crucial qu'on ne peut gérer que par le panneau de configuration de VirtaulBox : Il faut décocher la case UEFI (en tout cas, si on est sur MacOS 10.15 et moins) sans quoi on se retrouve avec l'erreur ci-dessous :
![Effacement des données SCSI1](./img/vm-install/39_config_OS.png)
![Effacement des données SCSI1](./img/vm-install/40_config_OS.png)
Où décocher UEFI :
![Configuration réseau](./img/vm-install/10_ter_config_OS.png)
Voici une représentation des étapes qui nous attendent pour configurer l'OS Debian 10:
![Manuel Debian](./img/vm-install/11_config_OS.png)
Démarrage de l'Installation : Suivre les étapes sur les prochaines images, se laisser guider, l'installation est relativement simple en comparaison de ce qui nous attend pour la suite du projet.
![Démarrage vm](./img/vm-install/12_config_OS.png)
![Installation non graphique](./img/vm-install/13_config_OS.png)
![Choix langue](./img/vm-install/14_config_OS.png)
![Choix pays](./img/vm-install/15_config_OS.png)
![Choix clavier](./img/vm-install/16_config_OS.png)
![Connexion réseau](./img/vm-install/17_config_OS.png)
![Nom de domaine](./img/vm-install/17_bis_config_OS.png)
![Nom de la machine](./img/vm-install/18_config_OS.png)
![Mot de passe root](./img/vm-install/19_config_OS.png)
![Confirmation Mot de passe root](./img/vm-install/19_bis_config_OS.png)
![Choix login entier](./img/vm-install/20_config_OS.png)
![Choix login](./img/vm-install/21_config_OS.png)
![Confirmation Mot de passe utilisateur](./img/vm-install/21_bis_config_OS.png)
![Partitionnement du disque avec LVM chiffré](./img/vm-install/22_config_OS.png)
![Choix du disque à partitionner](./img/vm-install/23_config_OS.png)
![Choix du schéma de partitionnement](./img/vm-install/24_config_OS.png)
![Config gestionnaire de volumes logiques](./img/vm-install/25_config_OS.png)
![Config gestionnaire de volumes logiques](./img/vm-install/25_bis_config_OS.png)
![Effacement des données SCSI1](./img/vm-install/26_config_OS.png)
Mon clavier se bloque après cette étape ; choses que j'ai essayé pour débloquer :
+ Augmentation a 128mo de la mémoire graphique (de toute façon, ça ne fait pas de
mal).
+ Installation du pack extension de virtual box (oui, mais à l'école ?)
+ Enregistrer l'état de la vm, puis quitter virtual box, puis relancer vb + vm.  
C'est cette dernière solution qui fonctionne, je retrouve le focus sur la saisie
et je peux poursuivre l'installation.  
![Partition du disque, phrase de passe](./img/vm-install/27_config_OS.png)
![Partition du disque, allocation espace mémoire](./img/vm-install/28_config_OS.png)
![Partition du disque, écriture des partitions](./img/vm-install/29_config_OS.png)
![Installation du système](./img/vm-install/30_config_OS.png)
![Configuration de l'outil de gestion de paquet, étiquette](./img/vm-install/31_config_OS.png)
![Configuration de l'outil de gestion de paquet, pays du miroir debian](./img/vm-install/32_config_OS.png)
![Configuration de l'outil de gestion de paquet, archive Debian](./img/vm-install/33_config_OS.png)
![Configuration de l'outil de gestion de paquet, mandataire HTTP](./img/vm-install/34_config_OS.png)
![Configuration de l'outil de gestion de paquet, APT](./img/vm-install/35_config_OS.png)
![Configuration du popularity-contest](./img/vm-install/36_config_OS.png)
![Installation de GRUB, choix du disque](./img/vm-install/42_36_config_OS.png)
![Installation de GRUB](./img/vm-install/37_config_OS.png)

1er démarrage
-------------
![Installation terminée](./img/vm-install/38_config_OS.png)
![Saisie de la phrase de passe précédemment créée à l'installation](./img/vm-install/44_config_OS.png)
![Saisie du login du premier utilisateur crée à l'installation](./img/vm-install/45_config_OS.png)
![Rendu une fois que l'on est loggué](./img/vm-install/46_config_OS.png)
![lsblk premier démarrage OS](./img/vm-install/47_config_OS.png)
