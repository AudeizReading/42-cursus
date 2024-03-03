
# Procédure CHANGE THE REDIRECTING DESTINATION 

Cette procédure s'exécute sur l'url : `ip_darkly/?page=redirect&site=...`.

On cherche à dérouter une redirection d'url gérée par le serveur. La
page d'accueil redirige vers les réseaux sociaux. On va se servir de
cette façon pour reproduire l'exploit.

Encore une fois `curl` sera l'outil de prédilection pour contourner la
restrictions et envoyer une requête POST:   
`curl -vs -G --data-urlencode "site=blibliibli" "ip_darkly/?page=redirect`

1. `--data-urlencode` : Encode la valeur du paramètre.   
Paramètre automatiquement la requête comme une requête POST.
2. `-G` : force curl à émettre une requête GET

De la sorte, on force le code source du site à nous rediriger à la
destination de notre choix. Ce scénario de redirection est souvent employé dans le phishing/hameçonnage.

# Comment s'en prémunir

- Mettre le lien direct du site que l'on met en avant plutôt que de
  passer par une redirection. Ainsi la requête n'aura pas à être gérée
  par le serveur que l'on souhaite protéger. Surtout que la directive
  no-refferer est supporté par tous les navigateurs récents:
   - Utiliser dans l'en-tête de réponse du serveur `Referer-Policy`, cela
     permettra à une directive `no-referer` d'omettre l'en-tête `Referer`
     entièrement.
   - Utiliser une balise HTML `<meta name="referrer"
     content="no-referer" />`.
- Si pour diverses raisons, ce n'est pas possible alors établir une
  liste blanche de sites pour lesquels on autorise une redirection
  et vérifier côté serveur la conformité de ce qui est demandé.

## Conseils supplémentaires:

- Utiliser des tokens uniques et à durée limitée d'authentification.
  Ainsi, il n'est plus systématiquement nécessaire de cacher les
  informations sensibles d'authentification dans le code source.
- Utiliser POST plutôt que GET autant que possible pour éviter de passer
  des données sensibles par urls.
- Utiliser HTTPS. Le protocole a plusieurs avantages de sécurité
  notamment de ne pas transmettre d'informations aux non HTTPS.
- On configurera des restrictions Same-Origin Policy n'autorisant que
  JavaScript à créer des en-têtes personnalisés et depuis la même
  origine. Sans ça, le requête est rejetée.

## Pour plus d'informations:  

[WSTG-BUSL-02](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/02-Test_Ability_to_Forge_Requests.md)   
[HTTP HEADERS CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)   
[CSRF PREVENTION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#use-built-in-or-existing-csrf-implementations-for-csrf-protection)   
[CSRF INFOS](http://www.stan.gr/2012/11/cross-site-request-forgery-legitimazing.html)   
[SSRF PREVENTION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)   
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
b9e775a0291fed784a2d9680fcfad7edd6b8cdf87648da647aaf4bba288bcab3
```
