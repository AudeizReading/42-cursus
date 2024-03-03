[\<- PARSING](./parsing.md)  
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

### Après l'exécution

Il faut savoir que, si tout se passe bien avec `execve`, la fonction ne retourne **jamais**, c'est d'ailleurs la raison pour laquelle on passe par un processus fils pour l'exécution: on peut récupérer certaines données concernant l'exécution, comme le code d'exit, via le processus père, sinon on ne peut plus avoir accès au processus fils après un `execve` réussi, pour vous en convaincre, placez un `fprintf(stderr, message, variables)` juste après l'`execve`: rien ne se produit et c'est normal *(je vous fait utiliser la sortie d'erreur au cas où la sortie standard soit neutralisée par une redirection)*.  
Il faut aussi faire en sorte que les processus fils ne deviennent pas des processus zombies après ce fameux `execve`, sans quoi vous risqueriez de vous retrouver avec une floppée de processus finissant de paralyser votre PC, car nous avons un nombre fini de processus pouvant s'exécuter sur une même machine - et ce nombre dépend de votre OS. *D'ailleurs, c'est une prank bien dégueu à faire à un camarade insupportable (de faire `while (1) fork();` sans jamais tuer les processus fils).* C'est pour cela qu'on utilise les fonctions de la famille `waitpid`.

*To Be Continued*