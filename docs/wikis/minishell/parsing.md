[\<- START](./README.md)                                         [EXEC -\>](./execution.md)

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