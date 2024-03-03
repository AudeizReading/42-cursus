# Procédure POUR CONTREFAIRE UNE REQUETE HTTP

## Comment modifier ses informations d'identification et de provenance

Cette procédure s'exécute sur l'url : `ip_darkly/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f`.   
Cette url se retrouve dans le footer, sur la page d'accueil, à l'endroit
où est écrit `© BornToSec`.  

En analysant la page minutieusement, on se rend compte que dans le code
HTML sont disséminés des commentaires, certains très utiles, d'autres
moins.

Parmi eux, il nous est indiqué que pour obtenir le flag, il faut
provenir du site de la NSA `https://www.nsa.gov/` depuis le navigateur
`ft_bornToSec`, sur cette page de destination.

Il est inutile de venir réellement du site de la nsa, ou encore télécharger
le navigateur `ft_bornToSec` *(Spoiler alerte: il n'existe pas)* pour
réussir cet exercice.

On va simplement envoyer une requête, avec un en-tête HTTP complètement
biaisé.

`curl` se révèle précieux pour ce type de manipulations:  
1. L'option `--referer` ou `-e` permet d'indiquer dans le header d'où on
   provient, la dernière page qu'on a visité et qui nous a conduit à
   cette page actuelle: `--referer="https://www/nsa/gov/"`
2. L'option `--user-agent` ou `-A` est là pour d'indiquer le client (ici le
   navigateur) par lequel on provient: `--user-agent="ft_bornToSec"`
3. Requête GET avec `curl` à l'url `ip_darkly/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f` et obtention du flag.

# Comment s'en prémunir

- Ne pas laisser d'informations sensibles dans les commentaires des fichiers
  fronts de type HTML, JS, CSS, etc.
- Ne pas faire confiance aux HEADERS HTTP car ils peuvent être modifié par
  l'utilisateur (que ça soit REFERER ou USER_AGENT).
- Utiliser HTTPS afin de crypter les données transitant sur le réseau.

## Conseils supplémentaires:

- Utiliser POST plutôt que GET autant que possible pour éviter de passer
  des données sensibles par urls.
- Utiliser HTTPS. Le protocole a plusieurs avantages de sécurité
  notamment de ne pas transmettre d'informations aux non HTTPS.
- Utiliser dans l'en-tête de réponse du serveur `Referer-Policy`, cela
  permettra à une directive `no-referer` d'omettre l'en-tête `Referer`
  entièrement.
- Utiliser une balise HTML `<meta name="referrer"
  content="no-referer" />`.

## Pour plus d'informations:  
[WSTG-BUSL-02](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/02-Test_Ability_to_Forge_Requests.md)   
[HTTP HEADERS CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)   
[CSRF PREVENTION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#use-built-in-or-existing-csrf-implementations-for-csrf-protection)   
[MAN CURL](https://linux.die.net/man/1/curl)    
[CSRF INFOS](http://www.stan.gr/2012/11/cross-site-request-forgery-legitimazing.html)   
[DETECTING BROWSER FORGERY](https://stackoverflow.com/questions/63083529/detecting-browser-user-agent-forgery)
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188
```
