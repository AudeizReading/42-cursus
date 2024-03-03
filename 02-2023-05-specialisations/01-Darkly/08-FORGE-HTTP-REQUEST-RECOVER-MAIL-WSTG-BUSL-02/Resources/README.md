# Procédure CHANGE THE EMAIL RECOVERING DESTINATION 

Cette procédure s'exécute sur l'url : `ip_darkly/?page=recover`.  
On y
accède après être passé sur la page `ip_darkly/?page=signin` et en
cliquant sur le lien `I forgot my password` sous le bouton de login.

En arrivant sur la page, on nous propose de renvoyer le mot de passe.
Aucun login n'est demandé, on peut supposer que c'est à l'adminstrateur
que la réponse est adressée.

En inspectant la page, on constate un `<input type="hidden" name="mail" value="webmaster@borntosec.com" maxlength="15">` dans le formulaire. Ce qui tend à confirmer le postulat de départ

On analyse tous les inputs du formulaire, on
récupère tous leurs noms et leurs valeurs afin d'émettre une requête correctement formulée. L'attribut `method` d'un `<form>` nous renseigne sur le type de requête attendue: ici c'est POST. 

Encore une fois `curl` sera l'outil de prédilection pour contourner la
restrictions et envoyer une requête POST:   
`curl -vLs --post301  --data-urlencode "Submit=Submit" --data-urlencode "mail=alellouc@student.42nice.fr" "${1}/?page=feedback"`

1. `--post301` : si le serveur répond par une redirection 301, alors la
   requête est réémise vers cette location en tant que requête POST.  
   Sans ça, c'est une requête GET qui sera renvoyée (et donc échouera si c'est POST qui est attendu).
2. `--data-urlencode` : Encode la valeur du paramètre.   
Paramètre automatiquement la requête comme une requête POST.

Ainsi, on bypass la restriction des 15 caractères maximum autorisés.  
La requête est envoyée et nous ouvre l'accès au flag.

# Comment s'en prémunir

- Ne jamais faire confiance aux informations du client, et ne jamais
  stocker de constante pour la vérification d'un formulaire côté front.
  Ce n'est pas le rôle d'un `input type hidden` de stocker des valeurs
  de ce type pour le back.
- Toujours valider la conformité du côté serveur, la vérification côté
  client n'est qu'un plus visuel, il ne remplacera jamais une vérification
  serveur.
- Utiliser HTTPS afin de crypter les données transitant sur le réseau.

## Conseils supplémentaires:

- Utiliser des tokens uniques et à durée limitée d'authentification.
  Ainsi, il n'est plus systématiquement nécessaire de cacher les
  informations sensibles d'authentification dans le code source.
- Validation sémantique en envoyant un mail à l'adresse renseignée; on
  s'assure ainsi de la:
    * conformité de l'adresse mail,
    * capacité de l'application à envoyer des mails à cette adresse,
    * légitimité de l'utilisateur à accéder à la-dite boîte mail.
- Utiliser POST plutôt que GET autant que possible pour éviter de passer
  des données sensibles par urls.
- Utiliser HTTPS. Le protocole a plusieurs avantages de sécurité
  notamment de ne pas transmettre d'informations aux non HTTPS.
- On configurera des restrictions Same-Origin Policy n'autorisant que
  JavaScript à créer des en-têtes personnalisés et depuis la même
  origine. Sans ça, le requête est rejetée.

## Pour plus d'informations:  
[WSTG-BUSL-02](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/02-Test_Ability_to_Forge_Requests.md)  
[INPUT VALIDATION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
[FORGOT PASSWORD CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
1d4855f7337c0c14b6f44946872c4eb33853f40b2d54393fbe94f49f1e19bbb0
```
