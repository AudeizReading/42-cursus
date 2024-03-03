# LibASM

Initialement, ce projet se trouvait en début de cursus à 42 *(cercle 2 ou 3, iirc)*.  
Mais en 2021, ce projet est déplacé à l'extérieur du tronc commun.  
Je trouve cela bien dommage, car malgré la difficulté du projet, il
apporte énormément de compréhension sur le fonctionnement d'un exécutable.

## À chaque OS, son système d'assemblage

Que l'on peut compléter d'un *"À chaque CPU, son jeu d'instructions machine"*.  
Il n'est vraiment pas simple de s'y retrouver, dans ce projet, entre l'assembly 8-bits, 16-bits, 32-bits et 64-bits, .
Surtout, que selon les différents campus, on travaille soit sur MacOSX (en voie d'extinction), soit sur OS de la
famille Linux/Debian.  
Windows, aussi, bien entendu est concerné par l'assembleur.  
Là où il y a un CPU, il y a de l'assembleur. Sa mise en oeuvre et pratique dépend grandement de l'OS. C'est en
quelque sorte notre intermédiaire avec le CPU.

Ce repository est *MacOSX* compliant.

## Le setup

- Un EDI. (`vim` pour moi)
- Un Assembleur (`nasm` imposé par le sujet, 64 bits, aussi imposé par le sujet)
- Un Linker (`gcc`|`clang` utilise le linker `ld`, rien n'est imposé, mais on va garder `gcc` - qui dans notre campus est aliasé sur `clang` - par habitude)
- Un Débogueur (`gdb` pour Linux, `lldb` pour MacOSX)


## Commandes principales

### Assembleur

```
nasm -f macho64 -Wall -Werror ft_strlen.s ft_strcmp.s ft_strcpy.s ft_strdup.s ft_write.s ft_read.s
```

### Linker

```
gcc ft_strlen.o ft_strcmp.o ft_strcpy.o ft_strdup.o ft_write.o ft_read.o main.c
```

(Il s'agit seulement de l'instruction de liaison, il faudra d'abord créer la librairie comme demandé par le
 sujet, puis la lier au point d'entrée).

## Les unités de mesures

Tout se compte en octet (8 bits = 1 octet = 1 byte) et les valeurs sont exprimées en base 16.  
Les unites de mesure principales sont:
- **b** => byte = 8 bits
- **w** => word = 2 bytes = 16 bits
- **d** => double word = 2 words = 4 bytes = 32 bits
- **q** => quad word = 2 double words = 4 words = 8 bytes = 64 bits


## Les types

- **immediate datas**, en général ce sont des littéraux de nombres, de chaînes...
- **register data**, data stockée dans un registre du CPU
- **memory data**, data stockée dans un emplacement mémoire, en dehors du CPU.

En Assembleur, les noms des variables représentent des adresses mémoire et non des datas.  
Pour obtenir ces datas, il faut déréférencer la variable en question avec `[]`.  

On ne peut pas déplacer directement une **memory data** vers une autre **memory data**. Il est nécessaire de
passer par un registre intermédiaire.

## La syntaxe

Il existe 2 syntaxes principales : celle de **Intel** et celle de **AT&T**. Nous devons utiliser la syntaxe **Intel**.
En fait, ce serait trop facile de rendre le projet en syntaxe **AT&T** : le compilateur `clang` l'utilise pour
produire les instructions machines issues d'un code source d'un langage compilé. Il suffirait de reprendre sa
libft, l'adapter au sujet et produire les fichiers assembleur attendus de la façon suivante : `gcc -S ft_strlen.c ft_strcmp.c ft_strcpy.c ft_strdup.c ft_write.c ft_read.c`.   
  >  *Spoiler alert: On ne peut pas écrire `ft_write.c` sans utiliser la fonction `write`. Ce qui n'est pas autorisé par le sujet - donc c'est interdit. De plus, ça se lit immédiatement dans le code assembleur que `write` est appelée. Il faut trouver une astuce pour passer directement par les registres et faire intervenir le bon sys_call. C'est également valable pour read.*  
  >  *J'en déduis que c'est certainement pour cette raison qu'il n'y a ni de `write.c` ni `read.c` dans le kernel
    Apple, mais seulement `write.s` et `read.s`.*

### AT&T

Il y a plusieurs différences majeures, mais les 2 principales à connaître, sont l'emploi de **%** devant
les noms de variables, et l'inversion des opérandes de *source* et de *destination* par rapport à la syntaxe
Intel.

Donc un code assembleur avec du **%** disséminé, c'est très certainement de la syntaxe **AT&T** qui est employée. Donc c'est un fail pour non respect des consignes du sujet.

## Les registres

Ce sont des emplacements mémoires situés directement dans le CPU, dans lesquels on va placer les adresses
mémoires des datas qu'on désire manipuler. Je les amalgame complètement aux pointeurs qu'on utilise en C/C++.  
Pour un CPU de la famille x86-64 (x86 pour indiquer que ces CPUs sont issus des familles de CPU 8086; 64 pour indiquer le mode en 64 bits), il existe 16 registres généraux d'une taille de 64 bits chacun.

### AX, BX, CX, DX

Les 4 registres `RAX`, `RBX`, `RCX`, `RDX` sont chacun subdivisés en 4 parties. C'est surtout une question de
rétrocompabilité. Il faut pouvoir faire tourner les programmes codés sur 8 bits, 16 bits, 32 bits.  
Par exemple le registre `RAX` a la forme suivante
- *bits 0 - 7* : **AL** - partie basse de **AX**, cette partie est directement adressable.
- *bits 8 - 15* : **AH** - partie haute de **AX**, cette partie est directement adressable.
- *bits 16 - 31* : partie haute de **EAX**, le reste étant la partie basse. Ajoutée en surcouche de **AX**. Cette partie n'est pas directement adressable.
- *bits 32 - 63* : partie haute de **RAX**, le reste étant la partie basse. Ajoutée en surcouche de **EAX**. Cette partie n'est pas directement adressable.

Ces registres sont employés dans de multiples contextes : stocker une valeur, récupérer le retour d'un
`sys_call` ou d'une fonction ou d'une routine, passer des arguments... Cela dépend majoritairement de l'OS et de l'assembleur utilisé.

On leur donne des noms, qui correspondent majoritairement à l'emploi qui en est fait.
- AX : accumulateur
- BX : base
- CX : compteur
- DX : données

### SP, BP, SI, DI, R8 à R15

**SI** et **DI**, respectivement **Source Index** et **Destination Index**, ont quasiment les mêmes emplois
que les registres **RAX** à **RDX**. Les registres **R8** à **R15** aussi. 
On ne peut juste pas les adresser dans leurs parties hautes ou basses. *Après vérification dans le manuel nasm, il semblerait finalement que ces registres soit adressables par leur partie xL*

**SP** et **BP**, pour *Stack Pointer* et *Base Pointer*, quant à eux contiennent l'adresse du haut de la
stack, 
et l'adresse de la base du cadre de pile *(qui pourrait être l'adresse de bas de la stack, même si peu
        probable, mais ne doit pas être confondu avec)*.

#### La Stack

La Stack est un espace mémoire flexible et écrasable, de type LIFO, située quasiment tout en haut du segment de mémoire
accordé au programme. Elle évolue vers le centre de ce se segment, c'est-à-dire que plus on y entrepose de
données, plus ses adresses mémoire diminueront. Elle a un fonctionnement à l'envers de comment on a l'habitude de concevoir une pile, qui peut en déconcerter plus d'un, mais c'est bien une pile.    
On y trouve tout un ensemble d'éléments: `argc` et `argv[0 à argc - 1]` d'un exécutable, les variables locales
de fonctions, les adresses de retour de fonctions, et, entre autres, les cadres de pile, *Stack Frames*.

Le cadre de pile d'une fonction est un espace mémoire, où sont regroupés les éléments essentiels au bon
déroulement de cette fonction, au sein de la stack. En gros, c'est son encadrement, son début et sa fin. L'adresse située juste après est très souvent l'adresse de reprise de la procédure, le registre **RIP** pointera dessus par lui-même *(RIP contient l'adresse de l'instruction suivante)*. C'est donc sur ce début de cadre qu'est censé pointer **BP**.

Comme son nom l'indique, on ne peut qu'empiler ou dépiler sur la stack de façon directe.

### E, R, rien, L, H, Kesaco ?

Il faut garder en tête, qu'au tout début les processeurs découpaient la plage mémoire par emplacements de 8 bits.
 Les registres initiaux étaient donc de cette taille. 
Cette taille est vite devenue insuffisante, alors on l'a doublée pour atteindre 16 bits.

Il fallait aussi conserver la possibilité d'exploiter les
programmes 8-bits déjà écrits et en service sur d'autres computers. Cela n'a pu se faire qu'en intégrant ces
registres 8 bits aux registres 16 bits.  

Ces 8 premiers bits (index 0 à 7) occupent ce qu'on appelle **la partie basse** du registre =>  ce sont les **L**ow bits.
Les 8 nouveaux (8 à 15), eux, sont les **H**igh bits du registres, ils occupent **la partie haute** de la mémoire.  

Les registres avaient alors des noms de ce genre : *AX, BX, CX, DX, IP, DI, SI, BP, SP, FLAGS...*  

On s'est à nouveau retrouvé en manque de mémoire, et les ingénieurs ont alors décidé d'augmenter la taille des
registres à 32 bits.  

De part ce besoin de rétrocompabilité, on ne pouvait pas transformer le registre AX en un registre de 32 bits.
On l'a donc intégré à un autre, pour obtenir un **Extended Register**. Ces nouveaux registres ont vu ce **E** en
préfixe du nom du registre à étendre : *EAX, EBX, ECX, EDX, EIP, EDI, ESI, EBP, ESP, EFLAGS...*  

Le passage au 64 bits emprunte la même voie et les registres sont préfixés d'un **R** : *RAX, RBX, RCX, RDX, RIP,
   RDI, RSI, RBP, RSP, RFLAGS*.  

Ces lettrages permettent de distinguer les registres ainsi que leurs tailles.

#### Particularités

Selon l'ABI AMD64 *(Oui valable pour de l'Intel! Au moment du passage au mode 32-bits, ce qu'a proposé AMD fît
office de consensus, au détriment des travaux d'Intel. Enfin pas vraiment au détriment, puisque Intel
n'arrivait pas à intégrer la rétrocompabilité des modes 8 bits et 16 bits, alors qu'AMD pleinement)*,
les registres **RBP**, **RBX** et **R12** à **R15** appartiennent à la fonction **appelante** *(calling function)* et la fonction **appelée** *(called function)* se doit de préserver ces valeurs pour **son appelant** *(its caller)*, en les poussant sur sa stack frame.
Les autres registres appartiennent à la fonction appelée. Si une fonction appelante veut préserver de telles
valeurs au travers un appel de fonction, il faut push sur la stack ces valeurs.

### IP

Ce registre contient l'adresse de la prochaine instruction a exécuter. Pour les architectures x86-64, en
général, c'est l'OS qui gère ce registre, le programmeur n'aura pas à s'en occuper.

### RFLAGS

C'est un registre de 64 bits. On n'utilise que les 32 premiers bits, et chaque bit, s'il n'est pas inutilisé, a
une fonction particulière et transmet son résultat en étant levé (1) ou baissé (0).
Par exemple, le bit **CF** de ce registre sera à 1 si le résultat d'une opération a une retenue.  
L'instruction `cmp dst, src` effectue la différence des adresses mémoire de dst et src. Selon le résultat
obtenu, certains bits de **FLAGS** seront levés ou descendus via cette instruction. L'instruction `je` à la suite, bien souvent, vérifie si la différence d'adresses vaut 0, donc si le flags **ZF** est levé.  
Ce n'est pas du tout le programmeur qui change les états de ce registre de manière directe, en général ce sont les
instructions machines qui se chargent des lectures et écritures dans **RFLAGS**.  

### Les sections
Un segment de mémoire contient différentes sections. Comme c'est légèrement technique, et pour une meilleure vue d'ensemble,
je vous renvoie au 1er livre de la bibliographie, l'auteur expliquera beaucoup mieux que moi les mécanismes intrasèques
des segments... *(ça vous dit quelque chose les segmentation faults ?* 😎 *)*

Il faut surtout retenir 5 sections qu'on manipule principalement en assembleur: **.text**, **.data**, **.bss**, **heap**
et **stack**.

La section **.text** est dédiée aux instructions machine. C'est elle qui contiendra les différentes commandes `nasm`
dans notre cas.

La section **.data** contient les données initialisées, et la **.bss**, celles non initialisées.

La section **heap** contient des données dont la vocation est de persister au travers de l'exécution des instructions
machine tant que leur
espace n'est pas libéré. La **stack**, quant à elle, est destinée à recevoir les variables temporaires, susceptibles
d'être écrasées à n'importe quel moment.

J'ai été particulièrement surprise, en faisant ce projet, de découvrir qu'on pouvait se contenter de n'utiliser que la section
**.text** et la **stack** pour produire des exécutables. Dans mon inconscient, il était nécessaire d'employer toutes les
sections, mais en effet, il semble logique, dans une quête de moindre monopolisation de l'espace mémoire de rechercher
la moindre économie.

La stack étant initialisée au `runtime`, on a tout à y gagner d'y transférer les données qu'on aurait installées en
sections **.data** et **.bss**. Cela nous donne un exécutable plus léger en mémoire après sa compilation. C'est ce but
qui est recherché.

### Fonctions
Les paramètres de fonctions sont stockés respectivement dans les registres **RDI**, **RSI**, **RDX**, **RCX**, **R8**, et **R9**. Au-delà,
les arguments sont envoyés sur la stack. Si la fonction a un nombre variadique d'arguments, alors ce
nombre est placé dans le registre **AL**.

La valeur de retour est stockée dans le registre **RAX**, et **RDX** si *RAX* est trop petit.

Chaque fonction contient un prologue, au début, et un épilogue à la fin.  
Le prologue configure le cadre de pile en sauvegardant **RBP** sur la stack, puis en copiant l'adresse de **RSP** dans *RBP*. **RBP pointe sur le haut de la stack.** 

```asm
push   rbp
mov    rbp, rsp
```

L'épilogue nettoie le cadre de pile et restaure la stack et RBP à leurs états antérieurs (voir plus bas pour une
        description d'un prolog)

```asm
leave
ret
```

### Syscalls

L'interface entre la bibliothèque C et le kernel Linux est la même que pour les "user-level applications" à
quelques différences près.

1. Les paramètres de fonctions des syscalls sont stockés respectivement dans les registres **RDI**, **RSI**, **RDX**, **R10**, **R8**, et **R9**.
2. Un appel système est fait au travers de l'instruction `syscall`. Le kernel écrase les registres **RCX** et
   **R11** mais préserve tous les autres registres sauf **RAX**.
3. Les appels système sont classifié par des numéros. **Ces numéros sont propres à chaque OS.**. Lors d'un appel
   système, son numéro doit être placé dans le registre **RAX**.
4. Les appels système sont limités à 6 arguments. Aucun argument n'est passé par la stack.
5. Le retour de l'appel système est contenu dans le registre **RAX**. Une valeur comprise entre **-4095** et **-1**
   indique une erreur => `-errno`.
6. Seulement des valeurs de classes **INTEGER** ou **MEMORY** sont passées au kernel.

Vous trouverez ces informations précisément dans **l'ABI AMD64**.

### La gestion des adresses
L'ABI fournit précisément ces informations: *la Stack est alignée sur 16 bytes*, cela veut dire que son
emplacement mémoire se situe sur une adresse dont l'identifiant est un multiple de 16. Son découpage
interne suit les
mêmes principes mais l'alignement en son sein se fait  en général sur un multiple de 8. Pour accéder à un élément sur la
stack, sans `push/pop`, on utilise le couteau suisse `mov op1, op2` (en synatxe Intel, on place l'adresse
        contenue en op2 dans l'op1), et donc pour effectuer un déplacement - en fait une copie - on fera:

```asm
mov [rbp - 16], rdi     ; on recup le 1er paramètre de la fonction, pour le placer sur la stack à l'emplacement
                        ; rbp - 16 (n'oubliez pas que les adresses de la stack décroissent quand on la remonte)
```

En outre, les données que l'on manipule ont leurs propres tailles d'occupation selon le type sous lequel
l'assembleur les catégorise. L'ABI fournit cette liste détaillée, mais dans l'absolu, en tout cas pour le projet
LibASM, on partira sur ces valeurs:

* un **CHAR** occupe 1 byte,
* un **INT** occupe 4 bytes,
* un **LONG** occupe 8 bytes,
* un **POINTEUR** occupe 8 bytes
* un **ARRAY** occupe son nombre d'éléments * son type (donc un tableau de 256 char occupent 256 bytes, en int ce
        sera 1024 bytes, etc.)
* un **FLOAT** a ses propres spécifications en terme de taille et de registres. Pour libASM, l'information n'est
pas pertinente, et un poil plus complexe, car il faut déjà savoir comment les bits d'un flottant sont agencés.
(étudiants 42, je vous renvoie au CPP 02...)
* une **STRUCTURE** occupera la taille de ses éléments, aligné sur son composant le plus strictement aligné. Chaque
membre est placé au plus petit offset disponible avec l'alignement approprié. Pour illustrer, supposons un
pointeur fizz de type:

```C
struct foo {
    int bar;
    int *baz
}

struct foo *fizz = ...
```

Pour déterminer son adressage, on repère l'élément qui nécessite le plus grand espace, car c'est sur son
alignement que tout se basera. Ici, il s'agit de `baz`, c'est un pointeur sur entier, donc il a besoin de 8
bytes. Son membre `bar`, lui n'a besoin que de 4 bytes, mais comme l'alignement est sur 8 bytes, on le placera
sur le premier offset disponible, qui ici, ne correspond pas à la taille qu'il occupera. Autre point à ne
surtout pas négliger, `fizz` et `fizz->bar` pointe sur le meme espace mémoire. C'est pour cela qu on fera:

```asm
mov [rbp - 8], 4    ; fizz->bar prend la valeur 4
mov [rbp - 16], 0   ; fizz->baz init à NULL
```

et non:

```asm
mov [rbp - 4], 4    ; fizz->bar prend la valeur 4
mov [rbp - 12], 0   ; fizz->baz init à NULL
```

*Ne reproduisez pas ce code bêtement, il est juste là pour illustrer ce qui se passe, et potentiellement ne
 fonctionnera pas.*

 On pourra par exemple combler les 4 bytes inoccupés, en y plaçant une valeur de retour de fonction dont le type occupe 4 bytes ou moins, si on en retourne une bien sûr. La cas contraire `[rbp - 4]` ne sera pas utilisé.

 Un programme efficace, c'est un programme qui optimise pleinement l'occupation de la stack ainsi que son accès.

#### Pourquoi `push rbp` ?

 C'est le schema ci-dessous qui m'a pleinement aidée à saisir l'intérêt de la manipulation, il illustre le code
 assembleur suivant:

 ```asm
 ...
 call   _main
 ...
 section .txt
 global _main
 _main:
 push   rbp
 mov    rbp, rsp
 sub    rsp, 32
 ```

 ```txt
            call _main                   push rbp                          mov rbp, rsp                sub rsp, 32

vers 0xFFFFFFFF                                             STACK
/|\
  | 
         ------------------           ------------------                ------------------           ------------------
 RSP ->  | RETURN ADDRESS |   RSP ->  |   CALLER RBP   |   RSP, RBP ->  |   CALLER RBP   |   RSP ->  |                |
         ------------------           ------------------                ------------------           ---            ---
         |      ****      |           | RETURN ADDRESS |                | RETURN ADDRESS |           |                |
         ------------------           ------------------                ------------------           ---   LOCALS   ---
         |      ****      |           |      ****      |                |      ****      |           |                |
         ------------------           ------------------                ------------------           ---            ---
         |      ****      |           |      ****      |                |      ****      |           |                |
         ------------------           ------------------                ------------------           ------------------
         |      ****      |           |      ****      |                |      ****      |   RBP ->  |   CALLER RBP   |
         ------------------           ------------------                ------------------           ------------------
         |      ****      |           |      ****      |                |      ****      |           | RETURN ADDRESS |
         ------------------           ------------------                ------------------           ------------------
         |      ****      |           |      ****      |                |      ****      |           |      ****      |
         ------------------           ------------------                ------------------           ------------------
         |      ****      |           |      ****      |                |      ****      |           |      ****      |
         ------------------           ------------------                ------------------           ------------------
         |      ****      |           |      ****      |                |      ****      |           |      ****      |
         ------------------           ------------------                ------------------           ------------------
 RBP ->  |     OLD RBP    |   RBP ->  |     OLD RBP    |                |     OLD RBP    |           |      ****      |
         ------------------           ------------------                ------------------           ------------------
         |      ****      |           |      ****      |                |      ****      |           |      ****      |
         ------------------           ------------------                ------------------           ------------------
         |      ****      |           |      ****      |                |      ****      |           |      ****      |
         ------------------           ------------------                ------------------           ------------------
                                                                                                     |      ****      |
                                                                                                     ------------------
                                                                                                     |     OLD RBP    |
                                                                                                     ------------------
                                                                                                     |      ****      |
                                                                                                     ------------------
                                                                                                     |      ****      |
                                                                                                     ------------------
  | 
\|/
vers 0x00000000                                             
 ```

## Documentations très utiles

### Websites

[Application Binary Interface AMD64](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)  
[ASM Tutor](https://asmtutor.com/)  
[Recap cs.washington.edu](https://courses.cs.washington.edu/courses/cse378/10au/sections/Section1_recap.pdf)  
[NASM](https://www.nasm.us/doc/)  
[hackndo](https://beta.hackndo.com/assembly-basics/)  
[Mach-O Programming Topics](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/MachOTopics/1-Articles/x86_64_code.html)  
[Syscalls MacOSX](https://opensource.apple.com/source/xnu/xnu-1504.3.12/bsd/kern/syscalls.master)   
[Compiler Explorer](https://godbolt.org/). Compilateur en ligne. 
[Stack vs Heap](https://www.guru99.com/stack-vs-heap.html)

### Livres

**Assembly Language Step by Step - *Jeff Duntemann***  
> Ressource inestimable. Même si le livre traite de CPU
32-bits, toutes les explications sur la gestion de la mémoire sont claires, détaillées, évidentes.  
À moins que je n'ai eu de gros soucis de traduction, toutes les infos de ce README sont majoritairement issues de ce livre.  
L'auteur utilise Linux et Nasm pour illustrer ses propos. Ce n'est pas très grave si les explications concernent le modèle 32-bits, car tout ce que nous avons à faire pour **LibASM**, et tout ce que ce livre peut nous enseigner est complètement transposable sur du 64 bits. Le reste des subtilités concerne les ingénieurs CPUs...

**Low-Level Programming C, Assembly, and Program Execution on Intel 64 Architecture - *Igor Zhirkov***  
> Ce livre aussi est d'une grande aide. Il emmène dans le bain directement, donc il vaut mieux avoir compris comment
fonctionne la mémoire d'un CPU avant de le consulter. En revanche, il est illustré de nombreux exemples pour CPU
64-bits, ce qui est fort appréciable. L'auteur aussi utilise Linux, Nasm et gcc.  

**Assembleur Théorie, pratique et exercices - *Bernard Fabrot*** *- (en français)*   
> Petit livre très pratique, il a un chapitre dédié aux commandes de bases que quasiment tous les assembleurs
> implémentent, avec explications de leurs fonctionnements, leurs synopsis et des exemples d'utilisation. C'est
> ici que j'ai appris que `CMP` effectue une soustraction de ses opérandes pour les comparer (un peu comme notre
> ft_strcmp, en fait) alors que `TEST` applique un `&` binaire sur ses opérandes.
> Il y a également une importante partie avec des mises en applications détaillées.
> Son principal défaut, c'est qu'il est légèrement outdated (1996). Mais ses explications sur la Stack sont
> tellement plus limpides...

## Derniers conseils
- Ne partez pas de rien, si vous n'avez jamais abordé de langage assembleur, documentez-vous. C'est essentiel de
comprendre comment se gère et manipule la mémoire. Aucun cheat ne saurait le faire à votre place, et vous seriez
vite démasqué si vous tombiez sur des correcteurs qui auraient fait ce projet *sérieusement*.
- Prenez les fonctions de la libC comme support, cherchez à reproduire leurs comportements. Ces fonctions sont
dans la libC, car elles ont un intérêt. Elles ont surtout été codées par des développeurs aguerris, qui, eux,
     ont mangé de l'assembleur toute leur jeunesse. Elles ont été codées de façon à optimiser la gestion de la
     mémoire. Nous ne sommes plus au temps de la libft, où on voulait croire que notre talent ferait toute la
     librairie à notre place, il est temps de renforcer ses bases en apprenant des meilleurs structures de codes.
- Suivez le tuto de nasm.
- Cela m'a beaucoup aidé de coder les fonctionnalités dans cet ordre : `ft_strlen.s`, `ft_strcpy.s`, `ft_strcmp.s`,
    `ft_strdup.s`, `ft_write.s`, `ft_read.s`. On se sert de `ft_strlen` et `ft_strcpy` pour produire `ft_strdup` -
    j'en conviens, il y a beaucoup mieux à faire, c'était surtout pour ré-employer ce qui était déjà disponible
    et ne pas avoir à recoder ft_memcpy - cet ordre s'est imposé de lui-même. En revanche, intercaler
    `ft_strcmp` entre permet d'apprendre d'autres techniques utiles pour `ft_strdup`. Au final, finir avec
    `ft_write/ft_read` (si vous avez l'un, vous avez l'autre) permet de synthétiser les notions, voir les appels
    aux syscalls et s'amuser avec errno, dont la gestion est un peu tordue -> MacOSX ne suit pas l'ABI et
    procède légèrement différemment que Linux à ce niveau. Mais l'info se trouve, avec un peu de recherches...

## Mise à jour

Un chamboulement dans la situation de mon campus m'a imposé de revoir ce projet complètement pour `Ubuntu 20.04` alors
qu'il était quasiment fini pour `Mac`. 

J'ai souhaité conserver quand même la version `Mac` du projet, j'ai donc adapté le code assembleur grâce à des macros. Il n'y a pas
de grosses différences entre les deux plateformes, mais suffisamment pour que le projet Mac ne soit pas compatible dans
un environnement Linux.
Les principales différences sont:
- Les noms de fonctions: Ils doivent préfixés par `_` sous `MacOSX` et absolument pas sous `Ubuntu`.
- Les appels systèmes: La table n'est pas la même selon la plateforme. Mais je l'avais déjà mentionné plus haut.
- La gestion des erreurs:
    - `MacOSX` ne suit pas l'ABI (les erreurs sont
        positives) alors que Linux si (les erreurs sont négatives, donc il faut inverser la valeur pour set correctement
            errno).
    - Les appels systèmes sont différent: `___error` pour `MacOSX` et `__errno_location wrt ..plt`.
- La gestion des liaisons (linkage) et des positions en mémoire. Je n'avais pas du tout compris dans l'énoncé l'interdiction d'utiliser l'option `-no-pie`:
`MacOSX` gère cela tout seul. En revanche, ce n'est pas la même histoire sous `Ubuntu` et ELF. Le code ne compilera pas sans
cette option! À moins que... il ne faille rajouter l'instruction `wrt ..plt` après certains appels comme un appel à
`malloc`... [explication NASM](https://nasm.us/doc/nasmdoc8.html#section-8.9.3) - [explication NASM](https://nasm.us/doc/nasmdo10.html#section-10.2.5).

### Testeur

Comme demandé par l'énoncé, un testeur est fourni. C'est un peu plus conséquent qu'un `main` de test, en revanche
l'exécutable est capable de tester en version mandatory ou bonus et de comparer avec des fonctions de réferences.  
On peut le vérifier dans le Makefile: La version de référence du test est compilé sans `libasm`.

Le testeur ne distingue pas quels bonus sont faits: c'est soit tous, soit aucun; c'est une solution de facilité de ma
part.

Le testeur rencontre quelques soucis avec Valgrind si on l'utilise sous MacOSX / Ventura. Le concepteur du
        repository [Valgrind pour Mac](https://github.com/LouisBrunner/valgrind-macos/) mentionne ces
        désagréments pour certains OS.

- Pour compiler la `libasm`:
    ```shell
    make
    ```
    ou
    ```shell
    make libasm.a
    ```
    ou encore 
    ```shell
    make all
    ```
- Pour compiler la `libasm` version bonus:
    ```shell
    make bonus
    ```
    Seuls les fichiers sources bonus sont compilés et ajoutés si `libasm` existe déjà.  
    Si `libasm` n'existe pas, évidemment tout est compilé: mandatory + bonus.
- Pour lancer le test sur la partie madatory:
    ```shell
    make test
    ```
- Pour lancer le test sur la partie mandatory **ET** la partie bonus:
    ```shell
    make test_bonus
    ```
- Pour nettoyer:
    - `libasm`:
        ```shell
        make fclean
        ```
    - bonus:
        ```shell
        make fclean_bonus
        ```
    - Le testeur:
        ```shell
        make fclean_test
        ```
