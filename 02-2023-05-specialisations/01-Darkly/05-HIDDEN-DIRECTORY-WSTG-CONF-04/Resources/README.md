# Procédure GET THE HIDDEN FLAG VIA ROBOTS.TXT AND DIRECTORY ACCESS 

1. Vérification de la présence du fichier `robots.txt` à la racine du site et
   scan de ce dernier.
2. Récupération des différents paths inscrits.
3. Requête HTTP sur le path `.hidden` et observation des réponses.
4. Constatation de la réponse 301, suivi de la redirection.
5. Le répertoire `.hidden` contient 26 * 26 * 26 répertoires, nested sur 3
   niveaux, qu'il faut bien entendu scrapper.
6. Chacun des niveaux de répertoires contient un README qu'il convient de lire.
   La majorité contiennent des messages de troll, mais un, camouflé, contient le
   flag qui nous intéresse

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

## Pour plus d'informations:  
[WSTG-CONF-04](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/04-Review_Old_Backup_and_Unreferenced_Files_for_Sensitive_Information.md)   
[MANUAL ROBOTS.TXT](https://robots-txt.com/)    
[GOOGLE MANUAL ROBOTS.TXT](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=fr)    

## Flag
```text
d5eec3ec36cf80dce44a896f961c1831a05526ec215693c8f2c39543497d4466
```

On le trouvera à l'url `url ip_darkly/.hidden/whtccjokayshttvxycsvykxcfm/igeemtxnvexvxezqwntmzjltkt/lmpanswobhwcozdqixbowvbrhw/`.   
Avez-vous noté le easter egg ? le clin d'oeil à Wil ?
