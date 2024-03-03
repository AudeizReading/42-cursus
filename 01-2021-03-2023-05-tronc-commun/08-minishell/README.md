# MINISHELL 

## 00  MINISHELL    WIKI
_Humble résumé du projet qui déchaîne autant de passion dans la 42sphère..._

[PARSING -\>](https://github.com/AudeizReading/minishell/wiki/01-PARSING)

Un peu de lecture avant d'entrer dans le vif du sujet:  
[man bash](http://manpagesfr.free.fr/man/man1/bash.1.html)  
[doc opengroup utilities syntax](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_12)  
[doc GNU readline](https://tiswww.case.edu/php/chet/readline/readline.html)  
[doc GNU Termcaps](https://www.gnu.org/software/termutils/manual/termcap-1.3/html_mono/termcap.html).  
[doc opengroup heredoc](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_07_04)  
[doc opengroup shell grammar](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_10)  
[doc opengroup cd](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cd.html)  
[wiki Advanced Unix Programming](https://en.wikipedia.org/wiki/Advanced_Programming_in_the_Unix_Environment) *Ce livre a été d'une aide inestimable*  
[more generalist documentation about, opengroup](https://pubs.opengroup.org/onlinepubs/9699919799/nframe.html)      
## main.c
* Vérification du nombre d'**argc**:
   - **Si argc > 1**: Il s'agit d'une erreur. Je suis partie du principe que nous n'avions pas à interpréter de scripts non-interactifs (scripts commençant par `!# /bin/bash` par exemple). Fin du minishell
   - **Si argc == 1**: Lancement du programme normalement.
   - **Si argc < 1**: On est très certainement dans le cas d'un `execve("./minishell", NULL, NULL)`. J'emploie cette méthode pour dérouter les cas limites, comme une commande composée que de redirections, ou une commande qui n'a pas réussi à s'exécuter avec `execve`. C'est en lisant le man de `fork` que j'en ai eu l'inspiration, s'il n'y a aucune action avec la famille de fonctions `exec` suite à un appel à `fork`, `fork` produit des fuites de mémoire, il est alors raisonnable de s'exécuter soi-même.
* **Terminal**: on bloque l'affichage des caractères de contrôles (^C, ^\\, ...) grâce aux fonctions `tcgetattr` et `tcsetattr`.
* **Environnement**: Initialisation du fichier qui servira à stocker l'environnement, il est détruit en fin de minishell avec la fonction `unlink`.
   - **Avantages**: Aucune utilisation de variables globales, accès et modifications des données possibles depuis le processus fils.
   - **Inconvéninents**: Les actions de lecture / écriture peuvent être compliquées si plusieurs éléments souhaitent accéder à l'environnement en même temps (fonctions de lock interdites). L'accès à l'environnement peut être compliqué si le path du fichier est relatif au programme `minishell`, il faut soit récupérer le path absolu du minishell, soit le stocker dans le répertoire `/tmp` commun aux systèmes *nix. C'est cette 2e option que j'ai choisie.
   - On initialise l'environnement grâce à la variable globale `environ` et non avec le 3e argument `envp` d'une fonction main, conformément aux recommandations POSIX, ce 3e argument n'est là que pour des soucis de compatibilité avec les vieux programmes.
* **Signaux**:
    - Emploi de la famille de fonctions en lien avec `sigaction` (POSIX)
    - Interception de `SIGQUIT` (^\\): le signal est tout simplement ignoré.
    - D'autres signaux sont aussi ignorés: signaux de terminaison de processus (`SIGTERM`, `SIGHUP`), signaux de contrôle de jobs (^Z, `SIGTSTP`, `SIGTTOU`, `SIGTTIN`). Le minishell ne peut ni être envoyé en arrière-plan, ni arrêté -> il faut lui envoyer un `kill -9 pid` pour forcer l'arrêt. Ceci pour couper l'herbe sous les pieds de mauvais plaisantins.
    - Interception de `SIGINT` (^C):
        * exit_status à 1 (comportement similaire à celui de Bash)
        * `ft_putendl("")`
        * `rl_on_new_line()` (changement de ligne)
        * `rl_replace_line("", 0)` (vide le buffer de readline)
        * `rl_redisplay()` (affiche la nouvelle ligne)
En gros, on quitte la ligne courante pour afficher un nouveau prompt sur une nouvelle ligne.

_^D n'est pas géré par les signaux, mais lors de la gestion du contenu retourné par le prompt._
* **Lancement du prompt**:
    - Récupération de la saisie utilisateur avec `readline` (attention la fonction leaks même si on libère correctement les ressources).
    - Ajout de la saisie user à l'historique avec `add_history`.
    - Gestion de ^D: si la saisie récupérée est vide, alors nous avons un cas de EOF et cela correspond à la saisie de ^D. Le terminal gère le code ASCII associé à ^D.
    - Si la saisie correspond à `\n`, on ne fait rien d'autre que d'afficher un nouveau prompt.
    - Parsing de l'input pour transformation en commande (recherche de la commande, de ses potentiels arguments et options, des redirections, des pipes, ou de caractères interdits ou mal positionnés...)
    - Envoi de la commande pour exécution. Si pas d'executor, on est sur le builtin `exit`.
    - On `chdir` juste après l'exécution: on ne peut le faire que dans un processus père, sans quoi les modifications sont sans effet. Pourquoi à cet endroit-là ? Le builtin `cd` est conçu, dans ce minishell, pour ne modifier l'environnement que s'il n'y a qu'une seule commande à exécuter, donc si un `cd` est lancé, depuis un processus fils sinon ce n'est pas marrant, l'environnement (`PWD` et `OLDPWD`) sera modifié en conséquence, et l'appel à `chdir` aura un impact et amènera au répertoire désigné lors de l'appel à `cd`. Sinon, l'environnement n'est pas modifié, et le `chdir` sera appliqué sur le `PWD` qui n'aura pas été modifié, en gros on demande à accéder au répertoire désigné par `PWD`, ce qui nous laisse au même endroit qu'au début de la saisie. C'est un `chdir` transparent, dans ce cas présent. Il y a certainement mieux à faire, j'en conviens...
   - Tout ce qui est malloc dans le prompt est free ici.
   - Finalement, on s'occupe de gérer le code retour issu de la saisie user:
        * Si > 0 ou -1: On relance un prompt
        * Si == 0: Il s'agit de ^D, on exit du minishell en retournant le code exit 0 et en affichant "exit" sur la ligne du prompt. J'utilise les termcaps pour ce faire:
            - \e[A: revient sur la ligne supérieure
            - \e[14C: se déplace de 14 colonnes, et tombe juste après le message du prompt.
        * Si == -1: Il s'agit d'une erreur de syntaxe lors de la saisie (grosse flemme de récupérer le token provoquant l'erreur de syntaxe), on représente un prompt.
        * Si == -2: Il s'agit du builtin `exit`. on exit du minishell avec le code erreur passé en paramètre au builtin.
Si on est face à un ^D ou au builtin `exit`, alors sortie du minishell, mais il faut nettoyer ce qui doit l'être:
            - delete environment file si la variable `SHLVL` vaut 1. Si `SHLVL` > 1, on décrémente `SHLVL` et on met à jour le fichier d'environnement. Ceci dans le but d'éviter d'évoluer au sein d'un shell où l'environnement serait corrompu et inutilisable.
            - nettoyage de l'historique.

## 01 PARSING

[\<- START](https://github.com/AudeizReading/minishell/wiki/00--MINISHELL----WIKI)                                         [EXEC -\>](https://github.com/AudeizReading/minishell/wiki/02-EXECUTION)

## 1ÈRE ÉTAPE: ANALYSE LEXICALE - LEXER

On est sur l'étape la plus simple du parsing.

Il s'agit de transformer l'input user en tokens. Un token est un élément atomique d'un langage ne pouvant être subdivisé.

[Lexer - Wikipedia](https://en.wikipedia.org/wiki/Lexical_analysis)  
[Tuto bien utile sur les étapes du parsing](https://www.cs.purdue.edu/homes/grr/SystemsProgrammingBook/Book/Chapter5-WritingYourOwnShell.pdf)

Pour ce faire, on va parcourir l'input caractère par caractère, j'utilise `ft_strchr(char *list_tok, char input)` à ces fins. Cela va nous permettre de déterminer la taille des tokens afin de n'en recopier que le contenu correspondant au token en cours de traitement. Ainsi, on avance sur le pointeur pointant sur l'input, en ajoutant à son adresse la taille précédemment trouvée: on accède au token suivant.

Les différents tokens recensés sont:

symbole | correspondance dans l'enum
------- | --------------------------
\\t, espace | WHITE_SPACE
\\n | NLINE
\| | PIPE
\\ | BACKSLASH
$ | DOLLAR
' | QUOTES
" | D_QUOTE
\> | GREAT
\>\> | D_GREAT
\< | LESS
\<\< | D_LESS
Tout autre caractère ou ensemble de caractères | WORD

On place tous les tokens à la suite, dans l'ordre trouvé, dans une liste chaînée, on relève leurs positions, leurs types et leurs contenus.

## 2È ÉTAPE: ANALYSE SYNTAXIQUE - PARSER

L'idéal aurait été d'employer un AST (Abstract Syntax Tree), mais pour diverses raisons, je ne l'ai pas fait. À tous ceux qui souhaitent faire les bonus `||` et `&&`, je vous recommande fortement de regarder du côté des AST.

[AST - Wikipedia](https://fr.wikipedia.org/wiki/Arbre_de_la_syntaxe_abstraite) 

[Ruslan's blog](https://ruslanspivak.com/lsbasi-part7/)

[ASTs - What are they and how to use them](https://www.twilio.com/blog/abstract-syntax-trees)

[Simulateur d'AST](https://esper.js.org/)

Je suis, personnellement, restée sur une analyse sommaire des tokens regroupés en liste chaînée. J'utilise la structure suivante: 
``` C
typedef struct s_tok
{
	struct s_tok	        *next;
	int			type;
	int			pos;
	char			*content;
}				t_tok;
```

- D'abord, je vérifie s'il y a des **quotes** (simples ou doubles), et qu'elles y soient par **paires**.
Le principe est simple, la première quote trouvée est considérée comme quote ouvrante. La prochaine quote de même type trouvée dans l'input est considérée comme quote fermante. Si un autre type de quote est trouvé entre la quote ouvrante est la quote fermante, la-dite quote est neutralisée et ne sera plus, par la suite, considérée comme quote. Elle apparaîtra comme une simple chaîne de caractère, et sera convertie en token WORD. Tout ce qui se trouve entre une quote ouvrante et fermante sera considéré comme token WORD, sauf pour le token $ qui sera traduit avant d'être interprété comme un WORD. Si je ne trouve pas la quote fermante, je considère, en l'état actuel de l'énoncé, qu'il s'agit d'une erreur de syntaxe.
- Ensuite, je vérifie le **dernier token** de l'input: s'il ne s'agit pas d'un WORD, ni de quotes (pas besoin de vérifier qu'il s'agisse d'une quote fermante puisque c'est fait dans l'étape ci-dessus), ni d'un WHITE_SPACE, ni d'un DOLLAR ou ni d'une nouvelle ligne, alors c'est une erreur de syntaxe.
- Je cherche à translate ce qui peut l'être:
    * *les quotes simples & doubles*:  
    À ce moment-là du parsing, on est sûr et certain d'avoir la paire de quotes, alors on concatène ce qui se trouve entre ces quotes pour ne le récupérer que dans une seule chaîne de caractère. Cette chaîne devient le contenu du nouveau token remplaçant les quotes. On a ainsi un nouveau token WORD remplaçant les tokens QUOTES (ou D_QUOTES) ouvrant et fermant et ce qu'il y avait entre.
   * *les tokens DOLLAR*:  
   On récupère le token DOLLAR + le token suivant qui doit être un token WORD. On cherche le contenu du token WORD dans l'environnement et on récupère la valeur de la variable concernée ou NULL si la variable concernée n'existe pas. On remplace ces deux tokens par un token WORD avec le contenu nouvellement récupéré. On fait la même chose lorsqu'on trouve un token DOLLAR entre double quotes, puisqu'il n'y aucune interprétation à effectuer si le token DOLLAR est entre simple quote.
   * *le token BACKSLASH*:  
   Il n'est pas à interpréter, mais si je ne le traduis pas en token WORD avec le token WORD suivant le token BACKSLASH, je peux me retrouver avec des soucis d'affichage comme avec le builtin `echo` qui, tel qu'il est constitué, me placerait un espace entre le BACKSLASH et le WORD. Donc je concatène le tout.
- Je vérifie ensuite la **conformité des PIPES**: si plusieurs pipes se suivent sans commande entre, si le 1er token est un pipe ou si l'input commencent par des caractères d'espaces suivi d'un pipe, etc. alors on a une erreur de syntaxe.
- Puis je m'occupe des tokens WORDS: logiquement il n'y a plus d'interprétation à opérer, mais on peut se retrouver avec une suite de token WORD consécutifs. Je les concatène pour ne former plus qu'un seul token WORD au contenu concaténé.
- Vient le tour des tokens de redirections \<\< \< \> \>\>: Je récupère toutes ces redirections qui doivent être suivies d'un token WORD, dans le cadre de l'énoncé, sinon il faut considérer cela comme une erreur de syntaxe, car ce token WORD est censé être soit le nom du fichier depuis/vers lequel la redirection se fait, ou le keyword d'un le cadre d'un heredoc. Cette suite de redirection est placée dans une liste chaînée, qu'on intégrera à la commande à exécuter, ce sera plus simple de gérer les redirections à effectuer par la suite.
- Finalement, il est maintenant possible de reconstituer toutes les commandes issues de l'input: Chaque commande simple (sans pipe) et les éléments la concernant sont placés dans une liste doublement chaînée de structure `t_cmd`, comme celle qui suit: 
``` C
typedef struct s_cmd
{
	int				pos;
	int				nb_cmd;
	int				nb_args;
	char			        **args;
	int				pipes[2];
	int				input;
	int				output;
	t_redir			        *redir;
	int				status;
	int				exit;
	pid_t			        pid;
	struct s_cmd	                *next;
	struct s_cmd	                *prev;

}				t_cmd;
```  

Pour reconstituer chaque commande, il est nécessaire de récupérer le nombre de pipes et de boucler sur ce nombre. Le nombre de commandes totales à exécuter est égal au nombre de pipes + 1.  

Je travaille sur la liste de tokens issus de l'input, et j'avance dessus tant que je suis face à un token WHITE_SPACE ou PIPE (logiquement il ne devrait pas y avoir de token PIPE à cet endroit, puisqu'on a checké dans le parsing qu'il ne puisse pas y en avoir en début d'input, c'est surtout utile pour les commandes en position supérieure à 1). Donc on emmène notre liste de tokens après ces fameux tokens. Si arrivé à ce point, la liste est finie, alors il n'y a aucune commande à traiter (on s'est sans doute retrouvé avec une saisie de WHITE_SPACE à gérer), il n'y a rien d'autre à faire que de représenter un prompt, bash ne génère pas d'erreur sur ce type de saisie.  

Si la liste de tokens n'est pas vide, alors on peut set la commande `t_cmd` et l'ajouter à la suite dans la liste chaînée accueillant les commandes. On récupère les arguments: il s'agit des tokens WORD (hors redirs et noms de redirs) séparés par des tokens WHITE_SPACE, ceci jusqu'à tomber sur le prochain pipe ou sur la fin de la liste des tokens. On stocke ces arguments, seulement les tokens WORDS, dans un `char **`: c'est pour s'adapter aux besoins de la fonction `execve` qui attend un `char **` en second paramètre pour gérer les arguments du programme à exécuter, avec à l'indice 0 de ce tableau, le nom du programme à exécuter - ce n'est pas une obligation, mais plutôt une convention, dans l'idée, cela rejoint le fonctionnement d'une routine `main`. Ce tableau doit être *NULL-terminated*, terminé par NULL.  

On récupère le nombre d'arguments, le nombre de commandes, la position de la commande et on set la structure `t_cmd` en conséquence.  

On récupère dans une liste chaînée la liste des tokens de redirections comme ce qui suit: `token de redirection -> nom du fichier de redirection -> token de redirection -> nom du fichier de redirection`, etc. Elle sera très utile pour gérer les différentes redirections dans la partie exécution du programme.

La structure `t_cmd` possède une structure de type `t_redir`, comme décrite ci-dessous:
``` C
typedef struct s_redir
{
	int			i_type;
	int			o_type;
	int			has_redir;
	char			*heredoc;
	t_tok			*token;
	char			*i_name;
	char			*o_name;
	int			pos;
	struct s_redir	        *next;
}				t_redir;

```
C'est dans cette structure qu'on placera la liste chaînée de tokens de redirections, on y place aussi le type et le nom (ou keyword) du fichier de la dernière redirection entrante et de la dernière redirection sortante, c'est ce qui nous intéresse le plus, car ce ne sont que les dernières redirections saisies qui doivent être prises en compte, pour toutes les autres, on simulera un `touch` et on refermera les flux en temps voulu. Si aucune redirection entrante et/ou sortante, on conserve les redirections par défaut, à savoir l'entrée standard et la sortie standard.  

Je set les fds input et output de la structure `cmd_t` (oui, je sais, la fonction qui est en charge de le faire est conceptuellement bizarre, il y aurait eu mieux à faire, et pour la petite anecdote, cela a été fait en milieu de projet, et si je cherchais à optimiser cette fonction, mes redirections ne fonctionnaient plus, il s'avère qu'elles ne fonctionnaient pas tout court à ce stade du projet, mais je ne l'apprendrais que plus tard).

Le parsing est enfin fini, bien que j'ai encore besoin d'ajuster certains détails dans la partie exécution. Je récupère le nombre de commandes et je l'envoie dans le fichier d'environnement. J'aurai besoin de cette information pour la gestion du signal inhérent à ^\\, car l'output est différent selon le nombre de commandes, et comme on ne peut quasiment récupérer aucune information dans les gestionnaires de signaux (on va dire qu'ils ne sont pas particulièrement prévus pour ça non plus...), ceci explique pourquoi je récupère cette info au travers de l'environnement.

## 02 EXECUTION

[\<- PARSING](https://github.com/AudeizReading/minishell/wiki/01-PARSING)  
# Exécution
On travaille sur la liste chaînée de type `t_cmd` obtenue via le parser.

À ce stade du programme, il convient de:
- Réactiver l'affichage des caractères de contrôle (via le terminal).
- Renouveler la façon de gérer les signaux: en effet ^C et ^\\ ne se comportent pas de la même façon lorsque l'on entre en mode interactif: par exemple, lors de la saisie et envoi d'un simple `cat` ^\\ doit rendre la main au prompt, alors que lors de la saisie, son comportement est sans effet.
- Rechercher si la 1ère commande est le builtin `exit`. Si en plus, il n'y a qu'une seule commande à traiter, on exit - en fin d'exécution -, sinon on continue à proposer le prompt.

## Lancement du processus d'exécution
On commence par récupérer l'environnement dans un tableau de `char **` pour répondre aux besoins de la fonction `execve`, qui comme pour les arguments, demande ce type de données, terminées par NULL, pour fonctionner.

On boucle sur la structure `t_cmd` tant qu'elle a un élément **next**.  

**On ouvre les fds**: c'est là que la structure `t_redir` prend tout son intérêt, on ouvre avec `open` chacune des redirections, heredoc est géré différemment, j'en parlerai plus loin, mais il est traité à cet endroit, en même temps que les autres redirections.

C'est très important de gérer les redirections dans l'ordre de leurs saisies: à la première erreur d'ouverture, il faut retourner une erreur et représenter le prompt. Si on gère les redirections en fonction de leur type et non de leur position, on peut se retrouver avec des fichiers créés, alors qu'ils ne devraient pas l'être. Quoiqu'il en soit, on referme le fd qu'on vient d'ouvrir si ce dernier n'est pas le dernier de son type (entrant ou sortant) dans la liste de tokens. Il est aussi impératif de récupérer le code de retour de `open`, pour pouvoir l'intégrer à la gestion des erreurs, l'erreur caractéristique à ce niveau, c'est lors d'une redirection entrante, si le fichier n'existe pas, les redirections sortantes créent de toute façon le fichier quoiqu'il advienne (à vous de passer les bonnes options à `open` pour ce faire).  

### Le cas heredoc
Je fais fonctionner heredoc, un peu sur le même principe: je ne conserve que la dernière saisie, mais je lance le processus pour tous les heredocs présentés. Je réemploie la fonction `readline` tout en adaptant le message du prompt, afin qu'il ressemble à celui de `bash`, je  quitte la saisie lorsque le keyword est envoyé pour la seconde fois, il suffit juste de comparer si l'input readline est le même que le keyword, qui, si vous vous souvenez bien, est conservé comme "nom de fichier" dans ma structure de redirection.  
Ensuite, deux choix s'offraient à moi pour la gestion du dernier heredoc de la commande, et s'il arrive en dernière position des redirections entrantes:
- Soit je faisais passer la saisie dans un tube, généré par `pipe`, que j'aurais placé dans ma structure de commande, pour le récupérer plus tard lors de la gestion d'éventuels pipes ou autre,
- Soit j'envoyais la saisie dans un fichier. Au fond, ça revient quasiment au même.  

J'ai choisi la 2e solution, en attribuant un nom unique à chaque fichier de heredoc créé, car comme on n'a pas accès aux fonctions de lock de lecture/écriture de fichiers, cela peut causer des soucis, si on passe par le même nom de fichier. J'ai tout simplement concaténer "heredoc" + le numéro de la commande, et je place le tout dans le répertoire `/tmp`. J'unlink dès que possible le fichier heredoc. Et pour pouvoir savoir quel fd ouvrir/unlink le moment venu, je place le nom du fichier généré à la place du keyword dans la structure de commandes. Cela me permet d'avoir une gestion uniforme des redirections entrantes.  
> Attention heredoc, ce n'est pas que cela, il faut aussi y gérer ^C, ^\\ et ^D, ainsi que traduire les saisies commençant par $. Il faut bien faire attention au keyword et bien lire le man de `bash` à ce sujet, le comportement attendu y est suffisamment explicité. Et pour être totalement honnête, c'est une des parties qui m'a causé le plus de soucis (notamment pour la gestion de ^C).

Une fois les redirections gérées, je m'attèle à intercepter toute commande susceptible de détruire le minishell ou d'interférer dans son exécution: `make fclean`, `rm -rf minishell` ou encore `chmod -x minishell`. Pour ne pas bloquer totalement ces commandes alors qu'elles pourraient légitimement évoluer dans d'autres répertoires, je m'assure que nous sommes bien dans le répertoire du minishell. Pour cela, je récupère en tout début d'exécution le path absolu du programme et j'envoie la donnée dans le fichier d'environnement afin de la réemployer par la suite, sans que le path ne soit altéré par divers appels au builtin `cd`.

Finalement, on s'occupe de la gestion des pipes, on part du principe que s'il y a un élément next, alors il y a des pipes à gérer, donc on ouvre le.s tube.s avec `pipe`. J'utilise la fonction suivante, plus tard dans le processus fils, pour gérer efficacement les flux à rediriger:

``` C
void	handle_pipes(t_cmd *cmd)
{
	dup2(cmd->output, STDOUT_FILENO);
	dup2(cmd->input, STDIN_FILENO);
	if (cmd->next)
	{
		close(cmd->pipes[0]);
		dup2(cmd->pipes[1], cmd->output);
		close(cmd->pipes[1]);
	}
	if (cmd->prev)
	{
		dup2(cmd->prev->pipes[0], cmd->input);
		close(cmd->prev->pipes[0]);
	}
}
```
J'ai vu passer une méthode où l'on sauvegarde la première redirection (notamment chez cet.te étudiant.e 42 [iciamyplant](https://github.com/iciamyplant/Minishell), mais aussi sur stackoverflow), j'avoue ne pas avoir été en mesure de reproduire ce fonctionnement, sans doute que mon approche est à l'encontre de celle-là. Néanmoins, la méthode présentée ci-dessus fonctionne parfaitement (et passe le test des 100 pipes). C'est pour cela que ma structure `t_cmd` est une liste doublement chaînée, car il faut manipuler les pipes en *quinconce*: récupérer le flux dans le tube de la commande précédente et le passer dans le flux de la commande suivante. Il est aussi nécessaire d'ouvrir un tube par pipe à gérer, j'ai testé pour vous: réutilisez le même pipe, et vous aurez des problèmes, vous êtes prévenus. Comme je vais me perdre en explications, prochainement j'ajouterai un schéma, qui visuellement sera plus parlant, de la démarche intervenant derrière ce mécanisme. On n'oublie pas de close les pipes le moment venu. Si vous avez le moindre doute, utilisez cette commande pour vérifier que vous fermez bien vos pipes: `lsof -c minishell`
Sinon, ci joint un lien sympa pour comprendre le fonctionnement des tubes : [zeitoun.net](http://www.zeitoun.net/articles/communication-par-tuyau/start)

### fork
Une chose importante à comprendre sur `fork`, notamment si vous n'avez pas encore fait le projet **Philosophers**, c'est qu'une fois que le processus initial est "*forké*", il se dédouble afin d'avoir un processus père et un processus fils. Ces deux processus s'exécutent en *parallèle*, donc en même temps. Si vous forkez sur plusieurs commandes (et c'est ce qui logiquement devrait arriver, surtout si vous choisissez de gérer les pipes), vous ne pouvez être certain duquel des fils se terminera en premier (ceci explique le cas `cat | cat | ls` et pourquoi si vous utilisez le même fichier pour gérer des redirections, vous pouvez vous retrouver avec le contenu de la commande 2 inscrit avant le contenu de la commande 1, dans la mesure où, je me répète, les fonctions de lock ne nous sont pas autorisées).  
Une fois le processus forké, je récupère le pid du processus, il me sera utile lorsque je devrais récupérer les exit status au moment de `waitpid` les processus fils (à faire depuis le processus père principal).  
Dans le processus fils, dont le pid vaut 0, on gère les redirections / pipes éventuels avec la fonction exposée ci-dessus. Quoiqu'il en soit, qu'il y ait une redirection ou non, un pipe ou non, on `dup2` STDOUT sur cmd->output et on `dup2` STDIN sur cmd->input (je me suis passée de la gestion de STDERR). L'avantage de `dup2` sur `dup`, c'est qu'il `close` le fd qu'on duplique si celui-ci est différent du fd de destination. Dans le processus père, dont le pid est > 0, on close les pipes: si cmd->next, on `close` cmd->pipes[1], si cmd->prev, on `close` cmd->prev->pipes[0]. Ni plus, ni moins, et c'est amplement suffisant à obtenir une solide gestion des pipes.  

Dans le processus fils, on poursuit l'exécution de la commande en cours de traitement:
- Si on s'est retrouvé avec une saisie composée uniquement de redirections dans le style de `> 1 <2 >>3` -> on redirige `execve` sur minishell: `execve(abs_path_minishell, NULL, NULL)`
- Sinon, on peut supposer que la commande est en état d'être exécutée et 2 cas majeurs se présentent:
   - la commande est un builtin: alors on déroute l'exécution vers la gestion des builtins pour appeler la fonction qu'on a du créer correspondante. J'ai fait le choix de passer cette gestion dans le processus fils, afin que la gestion des redirections & pipes reste uniforme. Je pense faire une page supplémentaire de Wiki sur les buitins, plus tard.
   - la commande n'est pas un builtin, il nous faut récupérer le chemin absolu de la commande à lancer pour `execve`, si on est sur un path relatif (ne commençant pas par \/), on analyse la variable d'environnement PATH et on récupère chacun des paths y étant présent, et on teste l'existence de la commande sur chacun des paths. On s'arrête dès qu'on trouve un path conforme. Les paths de PATH doivent être analysés de la gauche vers la droite. Si la commande commence par / ou ./, le traitement est légèrement différent. Il faut aussi gérer le cas d'un chemin vide ou d'une commande inexistante. C'est aussi le moment de set la variable d'environnement _ avec pour valeur le path de la commande qu'on va exécuter, bash le fait même si la commande n'est pas exécutée. On ne répercute le changement sur l'environnement que s'il n'y a qu'une seule commande, c'est ainsi, l'environnement n'est pas propagé entre les différents processus fils, à la différence des redirections, ils partent tous depuis l'environnement initial. bash set la valeur de _ à vide si multi-commandes - je ne l'ai pas géré -> méga flemme + on est sur de l'ultra détail, là. On peut enfin exécuter la commande de la sorte: `execve(absolute_path, cmd->args, env)`.  
On peut aussi se trouver

On gère si l'exécution n'a pu se poursuivre (erreur 127: le path ne débouche sur aucune commande existante; erreur 126: le path existe mais n'est pas un exécutable, essayez avec le nom d'un répertoire dans bash pour comprendre de quoi je parle), on set le code d'erreur (puisqu'on ne pourra pas le récupérer avec `waitpid`) et on affiche le message d'erreur correspondant; je ne me suis pas plus embêtée que ça j'ai utilisé `errno` que je set avec le bon statut d'erreur, et je personnalise un peu le message d'erreur en le passant en paramètre de la fonction `perror`. Pour plus d'infos sur les codes possibles de `errno` -> `man 2 intro`. Finalement, on s'execve soi-même.

Dans le père, on boucle sur la structure `t_cmd` tant qu'il y a un élément next, donc tout ce qui vient d'être exposé se reproduit tant qu'il y a une commande à traiter.

### 03 Après l'exécution

Il faut savoir que, si tout se passe bien avec `execve`, la fonction ne retourne **jamais**, c'est d'ailleurs la raison pour laquelle on passe par un processus fils pour l'exécution: on peut récupérer certaines données concernant l'exécution, comme le code d'exit, via le processus père, sinon on ne peut plus avoir accès au processus fils après un `execve` réussi, pour vous en convaincre, placez un `fprintf(stderr, message, variables)` juste après l'`execve`: rien ne se produit et c'est normal *(je vous fait utiliser la sortie d'erreur au cas où la sortie standard soit neutralisée par une redirection)*.  
Il faut aussi faire en sorte que les processus fils ne deviennent pas des processus zombies après ce fameux `execve`, sans quoi vous risqueriez de vous retrouver avec une floppée de processus finissant de paralyser votre PC, car nous avons un nombre fini de processus pouvant s'exécuter sur une même machine - et ce nombre dépend de votre OS. *D'ailleurs, c'est une prank bien dégueu à faire à un camarade insupportable (de faire `while (1) fork();` sans jamais tuer les processus fils).* C'est pour cela qu'on utilise les fonctions de la famille `waitpid`.

*To Be Continued*