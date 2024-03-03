Guide de connexion à la Vogsphere, via SSH, depuis sa machine personnelle
=========================================================================

Etape 1 :
---------
Pour se connecter en SSH, depuis son poste personnel, comme si on était à l'école, il nous faut generer un clé SSH. L'inconvénient, c'est que l'Intranet n'accepte qu'une seule clé SSH à la fois.

Il y a 2 écoles :
Celle où on repart de 0, et celle où on se casse un peu moins la nénette mais qui n'est pas la plus recommandée.

### 1ere possibilité, on repart de 0 :
Dans un premier temps, on check qu'on n'a pas déjà une clé existante à dispo :

```
ls -la ~/.ssh
```

Il faudra peut-être créer le répertoire **.ssh** à la racine de $HOME si inexistant chez vous, il faudra lui attribuer les **droits utilisateur 700** *(lecture / écriture / exécution pour l'owner)*.

```mkdir -m 700 ~/.ssh```

Ensuite, si on ne trouve pas de clé SSH, on peut générer une nouvelle clé:

```
ssh-keygen -t rsa -b 4096 -C "user_ID@student.42nice.fr"
```

Cette commande nous permet de générer un couple clé privée / clé publique. Le prompt va poser quelques questions, comme où créer la clé, on peut taper "Entrée" la clé sera automatiquement générée dans la destination proposée par défaut, ou alors on peut spécifier le dossier que l'on souhaite *(le dossier doit déjà être existant)*. Ensuite, on nous demande d'entrer une phrase de passe. C'est comme un mot de passe mais en version phrase. C'est facultatif mais recommandé, niveau sécurité. Si on tape seulement "Entrée", aucune phrase ne sera demandée par la suite et la connexion SSH ne sera pas sécurisée par une phrase de passe. On peut changer cet état de fait à tout moment en tapant la commande suivante :

```ssh-keygen -p```

### 2e possibilité:
Il suffit de rapatrier le couple clé privée / publique généré depuis son dernier poste utilisé à l'école, sur son poste personnel. Cette méthode n'est pas recommandée pour plusieurs raisons :
* Niveau sécurité, ce n'est pas glop du tout, si la clé est compromise à un endroit, elle est compromise partout ailleurs
* Niveau tranfert, comment accéder à sa clé alors qu'on est à distance ? Puisqu'on ne peut pas télécharger depuis Guacamole vers son poste, sauf si on clique sur "Download your HOME", avant d'accéder à vnc sur la page de connexion à Guacamole *(et je ne sais pas ce que ca donne car je ne l'ai jamais fait)*. Soit on recopie à la main sa clé privée *(bon courage)*, soit on la transfère sur GitHub *(oulàlà l'alerte de sécurité de GitHub qui se profile à l'horizon)*, soit on va à l'école avec une clé USB et on récupère ces données. Je vous laisse choisir votre mode de transfert si vous souhaitez passer par cette méthode.

Toujours est-il que vous devrez vous assurer des droits sur ces fichiers.
Le fichier **id_rsa.pub** *(ou le nom que vous avez attribué à votre clé publique)* doit avoir les droits **644** et le fichier **id_rsa** *(ou le nom que vous avez attribué à votre cle privée)* doit avoir les droits **600**.

Etape 2 :
---------
On va ensuite, depuis sa console personnelle, démarrer l'agent SSH, et lui passer la clé privée, afin qu'il puisse établir la correspondance entre clé privée / clé publique et sécuriser les connexions au serveur **vogsphere**

```
eval "$(ssh-agent -s)"
```

Si un PID est retourné, alors l'agent est bien démarré. C'est d'ailleurs ce PID qui vous servira à ```kill``` le processus au besoin (ne le faites pas maintenant).

Ensuite on passe la clé privée à l'agent SSH :

```
ssh-add ~/.ssh/id_rsa
```

Si vous avez indiqué une phrase de passe, on vous la demandera à cette étape.

Etape 3 :
---------
En supposant que vous soyez partis sur la méthode 1 dite "safe" : Il va falloir maintenant ajouter la partie publique de la clé sur l'Intranet -> **Profil > Settings > SSH Key > Show SSH KEy > Destroy Public Key**.

Eh oui, c'est la limite de l'Intra, vous devez détruire votre ancienne clé publique au profit de la nouvelle *(sur GitHub on peut en ajouter plusieurs)*. Mais don't worry, tant que votre clé publique existe toujours sur votre HOME de l'école, vous pourrez la réemployer, lorsque vous reviendrez à l'école, il suffira de détruire la clé publique qu'on va actuellement ajouter et la remplacer par celle dont vous avez besoin d'avoir accès. Donc n'effacez pas vos fichiers de clés.

Vous trouverez votre clé publique dans votre repertoire **.ssh**, si vous n'avez apporté aucune modification, elle devrait s'appeler **id_rsa.pub**. Vous copiez votre clé, soit en ouvrant le fichier, soit en le ```cat```, et vous l'ajoutez dans l'intra, validez si on vous le demande.

Si vous avez choisi la méthode 2, normalement la clé publique sur votre Intra est celle correspondant à votre clé privée, il n'y a pas besoin de la changer.

Etape 4 :
---------

On vérifie maintenant que la connexion est bien établie :

```
ssh -T git@vogsphere.42nice.fr
```

Si la connexion est établie vous devriez obtenir un message dans le style *"Hi there, username! You've successfully authenticated with the key named username 2021-02-08T11:07:01Z, but Gitea does not provide shell access"*. Ne vous affolez pas de la tournure, cela confirme malgré tout que la connexion est établie et sécurisée.

### Utilisateurs MacOSX
Vous trouverez ici [comment ajouter votre clé à la keychain](https://medium.com/@aude.lellouche/storing-ssh-keys-into-macos-x-ventura-keychain-609d7663c4d5) pour faire persister la procedure, car sinon il faudra repeter les etapes 1 à 4 à chaque ouverture de terminal.

Etape 5 :
---------
La connexion est établie, vous pouvez ```git clone``` votre repo vogsphere de travail, ```git add -u```, ```git commit -m```, ```git push -u origin master``` etc. Essayez vous verrez, c'est magique.

De la sorte, vous n'aurez plus besoin d'utiliser aussi souvent **vnc**, et vous pourrez cloner les repos de vos mates si vous devez les corriger, mais que Guacamole fait des siennes.

Etape 6 :
---------
La magie s'arrête à chaque fois que vous fermerez votre console. Donc à chaque ouverture de console, il faudra redémarrer votre agent ssh, lui passer la clé privée etc.
Personnellement, je passe par un alias, pour ne pas me retaper toutes les commandes à chaque connexion, je viens meme de lire sur GitHub qu'on peut utiliser leur script pour automatiser la connexion à chaque ouverture du terminal. Je vous soumets ma proposition et je vous mets le lien vers GitHub qui explique comment créer ce script.

Dans le fichier de configuration de votre terminal *(.bashrc, .zshrc, etc ou à créer si inexistant)* :

```
alias co42='eval "$(ssh-agent -s)"; ssh-add ~/.ssh/id_rsa; ssh -T git@vogsphere.42nice.fr'
```

Pour que l'alias soit pris en compte, il faut redémarrer sa console *(et donc se reconnecter a l'agent ssh, c'est donc le bon moment de tester si l'alias fonctionne)*.

La procédure GitHub : https://docs.github.com/en/github/authenticating-to-github/working-with-ssh-key-passphrases

Sinon, vous pouvez également utiliser cette procédure pour travailler avec vos repo git, l'avantage c'est que vous n'aurez pas à vous authentifier username/passwd à chaque push. https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent. De toute façon, il semblerait que GitHub ait décidé de passer full ssh... la méthode username/passwd est amenée à disparaître.

Pensez bien à récupérer les URL en mode ssh et à les ajouter tels quels dans vos repos de travail.

Dernier point :
---------------
Il est possible de travailler sur 2 remotes en même temps ! C'est-à-dire que vous pouvez à la fois push sur votre compte GitHub **ET** sur le serveur Vogsphere, **EN MEME TEMPS**. Pas besoin de double push. Il faut juste avoir démarré l'agent ssh avec les 2 clés privées (une pour chaque remote). On fait deux fois ```ssh-add cle-privee``` + deux fois ```ssh -T```. On ne fait qu'une seule fois ```eval "$(ssh-agent -s)"``` *(Les commandes sont volontairement raccourcies, tapez-les bien en entier comme je vous l'ai indiqué plus haut. Faites un alias de cette suite de commandes, le principe reste le même que celui montré plus haut)*.

C'est assez simple : à la base de votre repo, là où se trouve votre répertoire caché **.git** vous entrez, dans une console :

```
git remote set-url --add --push origin [URL_REMOTE2]
```

Le premier remote étant déjà renseigné grâce au clone du repo, il n'y a qu'à indiquer l'adresse du second. Attention, les URL en SSH sont du style *git@github:USERNAME/REPO.git*, faites-y attention, sinon vous aurez des surprises.

Il arrive que git bug avec cette instruction *(je dois m'y prendre comme un pied, en vrai)*, dans ce cas-là, on contourne le problème en écrivant directement dans le fichier de configuration, l'adresse du remote à ajouter :

```
vim .git/config
```

Vous allez trouver quelque chose comme ça

```
[remote "origin"]
        url = git@vogsphere.42nice.fr:vogsphere/intra-uuid-bla-bla-bla
        fetch = +refs/heads/*:refs/remotes/origin/*
```

Donc entre la ligne ```url``` et la ligne ```fetch``` vous ajouterez la ligne suivante :

```
pushurl = git@github.com:USERNAME/VOTRE_REPO.git
```

Ce qui donne :

```
[remote "origin"]
        url = git@vogsphere.42nice.fr:vogsphere/intra-uuid-bla-bla-bla
        pushurl = git@github.com:USERNAME/VOTRE_REPO.git
        fetch = +refs/heads/*:refs/remotes/origin/*
```

Le double push est mis en place normalement. Le serveur sur lequel vous tirerez vos infos (```git pull```) est celui indiqué par ```url```.

Voilà, c'est tout pour le maintenant.
