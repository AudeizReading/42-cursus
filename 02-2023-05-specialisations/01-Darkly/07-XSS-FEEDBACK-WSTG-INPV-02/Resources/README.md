# Procédure XSS INJECTION 

> Avant tout, il convient de préciser que le flag est quasiment
> impossible à obtenir dans les conditions attendues: le serveur teste
> les saisies utilisateur
> avec `strstr` et recherche si `<script>alert(1)</script>` se retrouve dans `script` ou `alert`.   
> **Ce qui explique que le flag est obtenu alors qu'il ne le devrait pas forcément l'être...**

Cette procédure s'exécute sur l'url : `ip_darkly/?page=feedback`.

Sur cette page nous retrouvons un formulaire par lequel on peut laisser
un commentaire sur le site. 

Sur cette même page, s'affiche tous les commentaires laissés dans la
base de données. C'est très important, car cela va servir à la
démonstration de la faille XSS.

On n'utilisera pas le formulaire, car il est bridé en caractères
attendus. L'attribut `method` d'un `<form>` nous renseigne sur le type de requête attendue: ici c'est POST. On analyse tous les inputs du formulaire, on
récupère tous leurs noms et leurs valeurs afin d'émettre une requête correctement formulée. On utilisera `curl` pour envoyer une requête POST:

`curl -vLs --post301  --data-urlencode "btnSign=Sign Guestbook" --data-urlencode "mtxtMessage=alert" --data-urlencode "txtName=<SCRIPT>alert('YOU HAVE BEEN JINXED !!!!!!!!!!!!!!!!')</SCRIPT>" "${1}/?page=feedback"`

1. `--post301` : si le serveur répond par une redirection 301, alors la
   requête est réémise vers cette location en tant que requête POST.  
   Sans ça, c'est une requête GET qui sera renvoyée (et donc échouera si
   c'est POST qui est attendu).
2. `--data-urlencode` : Encode la valeur du paramètre.   
Paramètre automatiquement la requête comme une requête POST.
3. Une fois la requête envoyée, retourner sur la page de feedback avec
   le navigateur et rafraîchir.   
   Une boîte de dialogue devrait s'afficher avec le message
   qu'on a passé dans `alert`.   
   Valider. Le flag devrait maintenant apparaître sur la
   page.  
   La boîte de dialogue sera active tant que l'injection ne sera
   interceptée.

L'injection fonctionne car elle a pu être inscrite en base de données.
Au rechargement de la page, le navigateur interprète la balise `<SCRIPT>` comme n'importe quelle autre balise HTML de la page. Comme, par défaut une telle balise est prévue pour exécuter du JavaScript, l'alerte se déclenche et une fenêtre modale apparaît.

# Comment s'en prémunir

**NEVER TRUST INPUT USER** : c'est une règle d'or, il faut vérifier/parser
ou sanitizer les saisies des utilisateurs.

On échappera les caractères spéciaux. 

À minima, il faut encoder les entités HTML saisies par l'utilisateur
et reçues. Que ce soit en lecture ou en écriture sur la base de données.
Bien qu'en générale les moteurs de template moderne s'en charge pour nous.

Utiliser HTTPS afin de crypter les données transitant sur le réseau.

## Conseils supplémentaires:

Bien souvent les langages de programmation backend ont toute une
panoplie de fonctions s'en chargeant et facilitant la tâche du
développeur: `pg` (node.js) utilise des requêtes préparées, `PDO` (php)
sécurise les transactions, etc.

Il y a aussi des frameworks et fonctions réputés dangereux à cause du
**Cross Site Scripting**: `document.getElementById("foo").innerHTML`,
notamment. On préfèrera employer les méthodes suivantes:

```javascript
elem.textContent = dangerVariable;
elem.insertAdjacentText(dangerVariable);
elem.className = dangerVariable;
elem.setAttribute(safeName, dangerVariable);
formfield.value = dangerVariable;
document.createTextNode(dangerVariable);
document.createElement(dangerVariable);
elem.innerHTML = DOMPurify.sanitize(dangerVar);
```

Il est également possible d'assainir des structures HTML grâce à
[DOMPurify](https://github.com/cure53/DOMPurify):

```javascript
let clean = DOMPurify.sanitize(dirty);
```

En complément de ces actions, on mettra également en place les contrôles
suivants:
- On emploiera les **attributs des cookies**. Ce sont des en-têtes HTTP
  permettant de sécuriser la circulation des cookies d'une requête à une
  réponse.
- On créera une politique de sécurité de contenu **Content Security
  Policy**. Ce sont également des en-têtes HTTP permettant de sécuriser
  la provenance et la destination des requêtes émises. Cela empêche le
  chargement de contenu non désiré.
- Utiliser HTTPS afin de crypter les données transitant sur le réseau.

## Pour plus d'informations:  
[WSTG-INPV-02 XSS](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/07-Input_Validation_Testing/02-Testing_for_Stored_Cross_Site_Scripting.md)   
[XSS CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html)   
[XSS PREVENTION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)   
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
0fbb54bbf7d099713ca4be297e1bc7da0173d8b3c21c1811b916a3a86652724e
```
