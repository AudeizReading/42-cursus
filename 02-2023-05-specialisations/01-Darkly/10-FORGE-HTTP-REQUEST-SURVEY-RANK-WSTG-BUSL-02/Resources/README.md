# Procédure VOTING ON SURVEY WITH AN UNEXPECTED VALUE 

Cette procédure s'exécute sur l'url : `ip_darkly/?page=survey`.

En arrivant sur la page, on nous propose de répondre à une enquête et
de donner une note au sujet qu'on préfère. Le choix des notes nous est
proposé via une liste de sélection, soit en jargon HTML des `<option>` au sein d'une paire de balises `<select>`.

Le fonctionnement est légèrement différent d'une balise `<input
name="foo" value"bar"/>`. La balise `<select>` contiendra l'attribut
`name`, celui qu'on réemploiera dans la requête HTTP, tandis que les
balises `<option>` contiendront un attribut `value` qu'il conviendra de
valider programmatiquement une fois sélectionné.

L'idée c'est de pouvoir soumettre une note qui ne nous est pas proposée
dans la liste de possibilité, mettons `42`, sur l'un des sujets
proposés parmi les 5.

On analyse tous les inputs du formulaire, on
récupère tous leurs noms et leurs valeurs afin d'émettre une requête correctement formulée.  

Encore une fois `curl` sera l'outil de prédilection pour contourner la
restrictions et envoyer une requête POST, ici `value` est la valeur
de l'attribut `name` de la balise `<select>`, son nom c'est `value`,
ne soyez pas confus par la formulation de la requête:   
`curl -vLs --post301  --data-urlencode "sujet=1" --data-urlencode "value=42" "ip_darkly/?page=feedback"`

1. `--post301` : si le serveur répond par une redirection 301, alors la
   requête est réémise vers cette location en tant que requête POST.  
   Sans ça, c'est une requête GET qui sera renvoyée (et donc échouera si c'est POST qui est attendu).
2. `--data-urlencode` : Encode la valeur du paramètre.   
Paramètre automatiquement la requête comme une requête POST.

# Comment s'en prémunir

**NEVER TRUST INPUT USER** : c'est une règle d'or, il faut vérifier
toutes les données saisies par l'utilisateur. Une vérification doit être faite
pour s'assurer de la validité des données, notamment si des données spécifiques
sont attendues. Aucune autre valeur que celles des balises `<option>`
ne devrait être acceptée (donc ajouter une liste des valeurs autorisées côté serveur).

## Conseils supplémentaires:

- Utiliser POST plutôt que GET autant que possible pour éviter de passer
  des données sensibles par urls.
- Utiliser HTTPS. Le protocole a plusieurs avantages de sécurité
  notamment de ne pas transmettre d'informations aux non HTTPS.
- On configurera des restrictions Same-Origin Policy n'autorisant que
  JavaScript à créer des en-têtes personnalisés et depuis la même
  origine. Sans ça, le requête est rejetée.
- Encodage HTML des entités et échappement des caractères spéciaux

## Pour plus d'informations:  
[WSTG-BUSL-02](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/02-Test_Ability_to_Forge_Requests.md)   
[INPUT VALIDATION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)   
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
03a944b434d5baff05f46c4bede5792551a2595574bcafc9a6e25f67c382ccaa
```
