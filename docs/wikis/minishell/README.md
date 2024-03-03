_Humble résumé du projet qui déchaîne autant de passion dans la 42sphère..._

[PARSING -\>](./parsing.md)

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