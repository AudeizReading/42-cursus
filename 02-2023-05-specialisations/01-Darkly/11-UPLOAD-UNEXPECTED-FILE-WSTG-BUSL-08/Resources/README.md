# Procédure UPLOAD UNEXPECTED FILE 

Cette procédure s'exécute sur l'url : `ip_darkly/?page=upload`

En accédant sur la page, il nous est proposé d'uploader une image vers
le serveur.

Le serveur utilisant `php`, nous allons uploader le fichier `./upload.jpeg.php` ayant pour contenu: 
```php
<?php

echo '<center><h2>You have been jinxed</h2></center>';
echo '<script>alert("You have been jinxed")</script>';
echo '<a href="url-depuis-laquelle-lancer-un-cript-ou-recup-des-infos">You will be jinxed</a>';
```

Pour être tout à fait clair, on ne verra pas le résultat de ce snippet
de code, car le fichier n'est pas affiché. En revanche, on le déposera
effectivement sur le serveur alors que ce n'est pas une image.

Si on l'affichait, les dégâts pourraient être considérables. Ici le code
injecté dans le fichier est *gentillet*, mais on pourrait avoir des
instructions dévastatrices pour le serveur et le client qui
l'afficherait. L'avantage des clients sans GUI c'est que l'impact coté
client se voit considérablement atténué sur ce type d'injection.

On analyse tous les inputs du formulaire, on
récupère tous leurs noms et leurs valeurs afin d'émettre une requête correctement formulée. L'attribut `method` d'un `<form>` nous renseigne sur le type de requête attendue: ici c'est POST. 

Encore une fois `curl` sera l'outil de prédilection pour contourner la
restrictions et envoyer une requête POST:   
`curl -svL -F "MAX_FILE_SIZE=100000" -F "Upload=Upload" -F "uploaded=@./upload.jpeg.php;type=image/jpeg;" "ip_darkly/?page=upload"`

1. `-F` : Simule le remplissage d'un formulaire HTML. Comme l'option `--data-urlencode`,
   l'option permet d'émettre une requête POST, en revanche, son content-type
   par défaut est `multipart/form-data`, alors que pour
   `--data-urlencode`, lorsque la requête n'est pas forcée en GET avec
   `-G`, le content-type est `application/x-www-form-urlencoded`
2. `-F "uploaded=@./upload.jpeg.php;type=image/jpeg;` : 
    - `@` indique que la chaîne suivant ce symbole caractérise un fichier comme paramètre.
        `@` peut être utilisé avec d'autres options que `-F`.  
    - `;type=image/jpeg;`: les clients sont, dans la majorité, capables de détecter automatiquement le type d'un fichier.  
        Dans notre cas, l'extension `.php` laisse peu de doute sur son type, c'est pour cela qu'il faut forcer la requête à identifier le type attendu par le serveur avec: `;type=image/jpeg;`.  
        L'en-tête sera ajusté en conséquence pour se revendiquer de ce type.


# Comment s'en prémunir

- Ne jamais stocker un fichier avec son nom original. Utiliser un nom
  généré aléatoirement.
- Confirmer le type du fichier et ne jamais se reposer sur la valeur
  "Content-type" de l'en-tête, puisqu'elle peut facilement être
  falsifiée.
- Lister les extensions autorisées.
- Stocker les fichiers sur un autre serveur/config nginx conçu pour
  distribuer des pages statiques (qui n'a pas de CGI/PHP). *Si ce n'est
  pas possible, les stocker dans un dossier avec accès interdit et
  distribuer les fichiers via un script intermédiaire (jouant le rôle de Firewall).*

## Conseils supplémentaires:

- S'assurer que les validations d'input sont effectuées
- Instaurer une limite de taille des fichiers.
- N'autoriser les upload que par des utilisateurs autorisés à le faire.
- Vérifier l'intégrité du fichier avec des anti-virus pour se prémunir
  de données malicieuses. <!-- Le porte monnaie va prendre un coup -->
- S'assurer que les bibliothèques et frameworks utilisés soient à jour
  et correctement configurés.
- Protéger le fichier upload des attaques CSRF. <!-- 100% comme tout autre formulaire! -->


## Pour plus d'informations:  
[WSTG-BUSL-08](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/08-Test_Upload_of_Unexpected_File_Types.md)   
[FILE UPLOAD CHEATSHEET]( https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
[WSTG-BUSL-02](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/02-Test_Ability_to_Forge_Requests.md)   
[INPUT VALIDATION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)   

## Flag
```text
46910d9ce35b385885a9f7e2b336249d622f29b267a1771fbacf52133beddba8
```
