# COMPILATION - GÉNÉRALITÉS

En ligne de commande, on compile un code source avec le compilateur **gcc** (paquet : `build-essential`) :

```shell
gcc –c main.c –o main.o
gcc –o executable main.o
```

## Fonctionnement de la compilation

Le drapeau `–c` de `gcc` ne linke pas les fichiers sources .c.

> _Une liaison ou édition de liens est toute opération qui établit tout ou partie de la chaîne d’accès qui permet de passer du nom d’un objet informatique à sa représentation physique._

### 1ere étape, la compilation

Le code source C est _analysé_, grâce
à l’option `–c` de `gcc` : C’est la **compilation** , à proprement parler, la première étape du processus de
compilation; elle vérifie que le _code source_ `(.c)` est correct et produit un fichier texte contenant le code source en langage **assembleur** `(.s)`.

### 2nde étape, l'assemblage

L’étape **d’assemblage** prend le fichier précédent `(.s)` et génère
du code machine. _C’est la deuxième étape_ de la compilation et c'esst ce qui va nous donner un **fichier objet** `(.o)`.

Si on ne spécifie pas de cible avec le drapeau `–o` , alors le fichier objet se nommera `a.out` par
défaut.

**Le fichier objet contiendra les instructions machine générées pour le processeur.**

Souvent, parmi
les informations trouvées sur le net sur la compilation, l’étape d’assemblage n’est pas décrite: on
passe directement du code source `(.c)` au code objet `(.o)`. _On dit que les fichiers intermédiaires sont
gérés de façon transparente par le compilateur._ Ces fichiers et formats sont temporaires et ne sont pas
particulièrement visibles à l’utilisateur sauf cas spécial.

### 3e étape, l'édition de liens

Cela ne suffit pas à construire le programme exécutable complet, il manque encore plusieurs choses :
grâce aux instructions `#include` (ex : `#include <stdio.h>`), on utilise des fonctions que l’on n’a pas
écrites. Ces fonctions appartiennent à des **librairies** dont on utilise rarement le contenu entier.

Le rôle de **l’édition de liens** est de déterminer quelles sont les fonctions nécessaires à notre programme,
d’extraire de leurs librairies respectives les blocs d’instructions processeurs correspondants et de
_relier_ ensemble tous les blocs d’instructions pour former un programme exécutable complet. C’est la
troisième étape de la compilation. **Éditer les liens, c’est produire l’exécutable.**

### Exemple

**On compile depuis le répertoire où se situe le code source** (`cd REPERTOIRE_CODE_SOURCE`, au besoin).

Les drapeaux `–Wall`, `-Wextra` et `-Werror` demandent au compilateur d’afficher tous les messages de prévention et
d’erreurs. Si tout se passe bien, le fichier objet est créé.

Le drapeau `–I` permet d’indiquer dans quel
répertoire se situent les **headers** `(.h)`. En général, on les sépare des codes sources, mais s’ils sont dans le même répertoire que les sources, il est inutile d’y faire référence, gcc saura les retrouver.

Le drapeau `–g` permet d’ajouter des informations de **débogage** à l’exécutable, on pourra les utiliser avec le débogueur `gdb`.

```shell
# Compilation (l’étape d’assemblage est implicite)
gcc –Wall –Wextra –Werror –o object_file.o –c source_file.c –I headers

# Édition de liens

gcc –o program_name lname_librairy object_file.o
```

Pour construire l’exécutable, il faut indiquer à `gcc` quels morceaux doivent être utilisés, au minimum, le
fichier objet généré par la compilation et éventuellement une ou plusieurs librairies.

Le drapeau `–o`
permet également d’indiquer le **nom du programme** exécutable à construire et le drapeau `–l`, le nom d’une
librairie.

## Les librairies

Il existe deux types de librairies (ou bibliothèques) : les librairies **statiques** et les librairies **dynamiques** .

### Librairie statique

Une librairie _statique_, généralement d’extension `.a`, est une bibliothèque qui sera intégrée à l’exécutable lors de la compilation.

- L’avantage, c’est qu’on a toutes les dépendances nécessaires au fonctionnement de l’exécutable, le programme est autonome. La bibliothèque se comporte comme un **fichier objet**.
- L’inconvénient, c’est que le projet peut atteindre une taille conséquente, surtout si les librairies pèsent
  lourd.

Pour faire une bibliothèque statique, on fera :

```shell
gcc –c file1.c –o file1.o ar –q libfile1.a file1.o # Option –q = ajout rapide des fichiers à l’archive # Ou encore ar cr libfile1.a file1.0 # L’option c a pour effet de ne pas avertir si la bibliothèque doit être créée et l’option r remplace les fichiers existants ou ajoute les nouveaux à l’archive
ranlib libfile1.a # Crée un index de l’archive pour y accéder plus rapidement, l’option –s de la commande ar a le même fonctionnement
# On lie la bibliothèque comme n’importe quel autre objet, on peut se passer de l’option –l pour une librairie perso, on peut aussi rajouter l’option -static
gcc main.o –llibfile1.a –o executable Librairie dynamique
```

### Librairie dynamique

Les bibliothèques dynamiques, d’extension `.so` _(Sharing Object)_ ou `.dll` _(Dynamic Link Library)_ sous Windows, sont des bibliothèques qui ne sont pas intégrées à l’exécutable lors de l’édition de liens.

L’exécutable appelle alors la librairie pour exécuter les fonctions. L’exécutable s’en retrouve plus
léger ; si la bibliothèque est utilisée par plusieurs programmes, elle n’est chargée qu’une seule fois en
mémoire (donc un seul téléchargement de la bibliothèque suffit) et on peut la maintenir à jour sans avoir besoin de recompiler tout le projet.

Pour faire une librairie dynamique, on fera :

```shell
gcc –c –fPIC file2.c –o file2.o # On crée la librairie dynamique avec l’option -shared
gcc –shared –fPIC file2.o –o libfile2.so gcc –c main.c –o main.0
gcc –fPIC main.o –L. –llibfile2.so –o executable
```

Le drapeau `–L` indique l’endroit où chercher la librairie déclarée avec `–l`, si le chemin n’est pas
renseigné dans `$LD_LIBRARY_PATH`. _À noter, qu’il n’est pas nécessaire d’indiquer le nom entier de la
librairie, si on met juste `–lfile2` avec `–L.`, gcc retrouvera sans difficulté la librairie `libfile2.so` dans le répertoire courant._

Le drapeau `–fPIC` _(Position Independent Code)_ compile **sans indiquer d’adresse mémoire dans le code** : les adresses pourront être différentes en fonction du programme qui utilisera la bibliothèque. Cela évitera aussi les conflits entre bibliothèques.

Le drapeau `–shared` indique que la bibliothèque est partagée (ou dynamique).

Il faut encore appeler la bibliothèque, on procèdera un peu de la même façon que pour appeler un programme
sans ./ : on doit renseigner son chemin via la constante `LD_LIBRARY_PATH`.

```shell
export LD_LIBRARY_PATH=chemin_librairie :$LD_LIBRARY_PATH

# Ou encore, de façon plus définitive
vim ~/.profile LD_LIBRARY_PATH=chemin_librairie :$LD_LIBRARY_PATH # Trouver l’emplacement approprié dans le fichier .profile (dépend de la structure du fichier)

# Si le fichier ~/.profile n’existe pas :
cp /etc/profile ~/.profile echo
export LD_LIBRARY_PATH=chemin_librairie :$LD_LIBRARY_PATH > ~/.profile # Ajoute l’instruction à la fin du fichier
```

On ne copie surtout pas la bibliothèque dans le répertoire `/lib`, cela fonctionnera mais c’est une mauvaise
pratique. En effet, c’est la librairie dédiée aux **programmes systèmes**.

Pour les **librairies personnelles**, on
doit utiliser le répertoire `/usr/local/lib` . Le plus simple est d’avoir ses librairies dans un répertoire
sur son `home` et on fera des _liens symboliques_ vers `/usr/local/lib/`.

#### Mettre à jour une bibliothèque dynamique :

`gcc` appelle le **linker** `ld` pour lier une bibliothèque. _Lire la doc pour plus de précision_.

Quand on change
la version d’une bibliothèque (pour la mineure comme pour la majeure), **il faut l’indiquer à l’éditeur de
lien**, sans quoi il risque de pointer sur une version caduque.

```shell
# Commande pour MàJ de bibliothèques dynamiques
ld –soname

# gcc appelle ld pour éditer des liens, avec le flag –Wl, il passe des options à ld, comme le flag –soname. Bien tenir compte des virgules de séparation.
gcc –Wl,-soname, libfichier1.so.1 –o libfichier.so.1.1

# Lire les man concernant ces commandes ci-dessous
ldconfig
ldd
```

#### Compiler avec des bibliothèques tierces ; (GTK ou SDL par exemple) :

```shell
pkg-config --libs [librairie].
```

`sdl` fournit sa propre méthode `sdl-config --cflags` = `pkg-config --cflags sdl`

##### Exemple avec GTK+:

```shell
gcc main.c $(pkg-config --cflags --libs gtk+-2.0) –o exécutable

# Équivalent à :

gcc main.c $(pkg-config --cflags gtk+-2.0) –o main.o gcc main.o $(pkg-config --libs gtk+-2.0) –o exécutable
```

`pkg-config` cherche la bibliothèque `.pc` dans le répertoire `/usr/lib/pkgconfig`

## Rendre exécutable un programme

On n’oublie pas d’attribuer les droits d’exécution au programme généré, sans quoi, on risque d’avoir des
petits soucis à l’appel du programme. Dons, depuis le dossier de l’exécutable :

```shell
# Rend le programme exécutable

chmod +x executable

# Lance le programme ./executable
```

## Documentation

[GNU GCC](https://gcc.gnu.org/onlinedocs/gcc-9.3.0/gcc/)  
[SDZ - COMPILEZ SOUS LINUX](http://sdz.tdct.org/sdz/compilez-sous-gnu-linux.html)
