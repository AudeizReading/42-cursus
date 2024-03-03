# Procédure GET THE HTPASSWD FLAG VIA ROBOTS.TXT AND DIRECTORY ACCESS 

1. Vérification de la présence du fichier `robots.txt` à la racine du site et
   scan de ce dernier.
2. Récupération des différents paths inscrits.
3. Requête HTTP sur le path `whatever` et observation des réponses.
4. Constatation de la réponse 301, suivi de la redirection.
5. Découverte du fichier `htpasswd`, récupération d'un username ainsi que d'un
   password encrypté en md5.
6. Décryptage du mot de passe par brute force
7. Requête POST auprès de l'interface d'administration `192.168.1.16/admin`, en
   fournissant les élements que l'on vient de récupérer.

L'application nous reconnait comme étant admin

# Comment s'en prémunir

Les fichiers anciens, de sauvegarde et non référencés présentent diverses menaces pour la sécurité d'une application Web. Le fichier `robots.txt` est une source d'indices sur les répertoires non référencés :
```text
User-agent: *
Disallow: /.hidden
Disallow: /whatever
```

Le moyen le plus évident par lequel un serveur mal configuré peut divulguer des pages non référencées consiste à lister les répertoires.

Les applications doivent être conçues pour ne pas créer (ou s'appuyer sur) des fichiers stockés sous les arborescences de répertoires Web servies par le serveur Web. Les fichiers de données, les fichiers journaux, les fichiers de configuration, etc. doivent être stockés dans des répertoires non accessibles par le serveur Web, pour contrer la possibilité de divulgation d'informations (sans parler de la modification des données si les autorisations du répertoire Web permettent l'écriture).

Il faut donc, pour notre cas de figure, ajouter dans le fichier de configuration
une interdiction de parcourir les répertoires du serveur web.

Il est de bon ton aussi de différencier l'interface d'administration de
l'application, de l'application elle-même, en y configurant l'accès sur un autre
port, de préférence inattendu, donc pas de 8080 ou de 3000. Cela compliquera la
tâche de l'attaquant si l'interface d'administration n'est pas sur le même port
que l'application.

## Pour plus d'informations:  
[WSTG-CONF-04](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/04-Review_Old_Backup_and_Unreferenced_Files_for_Sensitive_Information.md)   
[WSTG-CONF-05](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/05-Enumerate_Infrastructure_and_Application_Admin_Interfaces.md)    
[MANUAL ROBOTS.TXT](https://robots-txt.com/)    
[GOOGLE MANUAL ROBOTS.TXT](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=fr)    

## Flag
```text
d19b4823e0d5600ceed56d5e896ef328d7a2b9e7ac7e80f4fcdb9b10bcb3e7ff
```
