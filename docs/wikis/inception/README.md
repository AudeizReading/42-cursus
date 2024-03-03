# Feuille de route Inception

1. Docker étant un outil prévu à la base pour Linux, et nonobstant le fait qu'il faille avoir les droits sudo sur le système où on lancera le projet, le plus simple est de commencer par installer la vm Linux qui sera notre "hôte" ainsi que les outils nécessaires au projet: docker, git, curl etc. Le choix de la distro est complètement libre du moment qu'il y a un kernel Linux.  
Néanmoins installer le système sur lequel on basera nos images n'est non plus une mauvaise idée. J'ai fait le choix d'une vm Debian 10/11 (10 à la maison, 11 à l'école) dont vous trouverez le tuto d'install ici [install vm debian](../../install-vm.pdf).  
Une fois fait, on pourra juste lancer sa vm depuis virtual box (sans forcément avoir besoin de se logger) et rester dans son terminal usuel pour se connecter en ssh sur le système de la vm. Manipulation fluide des éléments garantie (enfin, ça dépend aussi qd même bcpp de la machine d'accueil).


2. Étudier comment une image Docker se construit, comment un document Dockerfile se structure, dissocier les étapes de build et de run et comprendre leur intérêt. Un bon point de départ est de regarder comment sont faites les images officielles nginx, mariadb et wordpress, elles se trouvent facilement sur le DockerHub ou sur GitHub (ne pas les copier!)


3. Manipuler les commandes de bases de Docker (sans compose pour le moment). 
Essayer de construire le 1er container nginx. C'est celui, qui même s'il a besoin et DOIT dépendre des 2 autres containers, peut être lancé et manipuler tout seul. C'est le seul moment où on pourra utiliser des "hacky patch" pour faire tourner les containers (il faut bien d'une façon ou d'une autre autre). Les enlever impérativement une fois cela fait et trouver une autre façon de rendre son container autonome. (Bonne nouvelle, c'est possible!)   
**tips**.  
   - Il faudra manipuler pas mal de fichiers de configuration. Une des premières choses à faire est de configurer les volumes (docker et $HOME/data) -> On fait tourner le container dont il faut qu'on récupère les éléments et on se les transfère via les volumes. Par ex sur le container nginx, on copie /etc/nginx/nginx.conf vers /var/www (si c'est le path qu'on a bindé avec). Comme /var/www du container nginx communique avec $HOME/data, il n'y a plus qu'à récupérer les fichiers de config depuis $HOME/data et les copier vers le wordir du projet et les éditer). Bien lire les docs des services à installer (bon elles sont un peu imbuvables, donc si vous calez allez plutôt du côté des tutos sur la toile, il y en a de très bons)


4. Se pencher sur le cas docker-compose.yml, comment ça fonctionne et ça se construit. Manipuler les variables d'environnement, comprendre ce qui se manipule au build et ce qui se manipule au run. Lancer les commandes avec docker-compose dorénavant (le docker-compose.yml doit être fonctionnel).  
**tips**.    
    - Le fichier .env doit être au même niveau que le docker-compose.yml (sinon les substitutions ne se feront pas). Les commandes docker-compose doivent être lancées là où est situé le docker-compose.yml. Adapter le Makefile en conséquence! (et n'oubliez pas que par défaut un Makefile est configuré pour interagir avec des instructions shell - donc ni bash ou zsh. À vous de voir comment vous vous adaptez)


5. Une fois à l'aise avec le tout, on peut se lancer dans la construction des autres services et les faire communiquer entre eux. Je recommande de procéder dans l'ordre suivant pour l'installation des service : 
    - nginx (on teste dans un browser avec un fichier index.html de son cru - ça prepare pour transcendance - pour vérifier le bon fonctionnement; d'abord par le port 80, puis par le port 443 une fois que le port 80 est fonctionnel - ne pas oublier de bloquer une connexion en protocole http://)
    - php (à mon sens, vu que le php7 est en passe de ne plus être maintenu, installer une version php8.x, c'est un peu tricky mais c'est faisable) -> tester dans un browser avec un fichier index.php et la fonction phpinfo() que tout s'est bien passé.
   - mariadb (on check l'install en CLI avec la commande mysql - c'est encore un bon training de ce qui s'annonce sur le cercle suivant)
   - on finit avec wordpress, dont l'install ne peut se faire sans une base de données existante.
Ne sauter aucune étape, insister sur chaque étape tant que la task n'est pas done.

## Précisions sur ma version du projet
J'ai fait mon projet full CLI. Je n'ai installé le bureau gnome (et Firefox) qu'à la toute fin, pour mes correcteurs, seulement quand mes 3 containers étaient fonctionnels. J'ai testé mon install avec curl et le browser lynx, browser en ligne de commande poour ceux que ça intéresse. Mon approche déroutera peut-être un peu les conventions, mais sachez qu'elle a été celle-ci - et cela vous aidera peut-être à comprendre certains choix que j'ai pu faire sur ce projet.

Ne pas hésiter aussi à se renseigner sur les scripts shell. Cela sera très utile pour ce projet (man bash par ex).

RTFM - On ne le répètera jamais assez
