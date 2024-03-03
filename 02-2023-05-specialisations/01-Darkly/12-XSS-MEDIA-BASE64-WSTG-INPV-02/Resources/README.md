# Procédure XSS INJECTION 

Cette procédure s'exécute sur l'url : `ip_darkly/?page=media&src=...`.

La page que nous visons n'est pas directement accessible, et on en
retrouve la trace sur la page d'accueil du site, elle sert à afficher
certains media et images

Également nous ne devrions pas voir le résultat de l'injection, mais
imaginons qu'elle soit réellement rendue au travers de l'application elle pourrait commettre des dégats incommensurables. Sachez que l'on va injecter `<script>alert('You have been Jinxed!')</script>`.

`curl -svG  --data-urlencode "src=data:text/html;base64,PHNjcmlwdD5hbGVydCgnWW91IGhhdmUgYmVlbiBKaW54ZWQhJyk8L3NjcmlwdD4K" "ip_darkly/?page=media"`

1. `--data-urlencode` : Encode la valeur du paramètre.   
Paramètre automatiquement la requête comme une requête POST.
2. `-G` : force curl à émettre une requête GET
3. `data:` : c'est un protocole défini par la RFC 2397 qui permet
   l'inclusion de petits objets de données. On peut de la sorte servir
   des images de la sorte: on encode le contenu de l'image en base 64 et
   on le déclare comme `src` d'une balise `<img/>`. Cela évite de la
   stocker sur le serveur.  
   Nous allons encoder une balise contenant un script.

# Comment s'en prémunir

**NEVER TRUST INPUT USER** : c'est une règle d'or, il faut vérifier
toute data entrée par un utilisateur.

On échappera les guillemets et
autres caractères spéciaux. 

On interceptera toute injection potentielle
de code. 

À minima, il faut encoder les entités HTML saisies par l'utilisateur
et reçues. Que ce soit en lecture ou en écriture sur la base de données.

On encodera également toute url.

On refusera les datas dont on n'a pas autorisé le protocole à être sur
le serveur

Il est également possible d'assainir des structures HTML grâce à
[DOMPurify](https://github.com/cure53/DOMPurify):

```javascript
let clean = DOMPurify.sanitize(dirty);
```

En complément de ces actions, on mettra également en place les contrôles suivants:   

- S'assurer que les validations d'input sont effectuées
- Lister les extensions autorisées.
- Changer le nom du fichier reçu pour un nom généré aléatoirement.
- Confirmer le type du fichier et ne jamais se reposer sur la valeur
  "Content-type" de l'en-tête, puisqu'elle peut facilement être
  falsifiée.
- Instaurer une limite de taille des fichiers.
- N'autoriser les upload que par des utilisateurs autorisés à le faire.
- Stocker les fichiers sur un autre serveur, si ce n'est pas possible,
  les stocker à l'extérieur de la racine du site.
- Vérifier l'intégrité du fichier avec des anti-virus ou des sandboxa
  pour se prémunir de données malicieuses.
- S'assurer que les bibliothèques et frameworks utilisés soient à jour
  et correctement configurés.
- Protéger le fichier upload des attaques CSRF.
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
[RFC 2397](https://datatracker.ietf.org/doc/html/rfc2397)   
[WSTG-BUSL-08](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/08-Test_Upload_of_Unexpected_File_Types.md)   
[FILE UPLOAD CHEATSHEET]( https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
[WSTG-BUSL-02](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/10-Business_Logic_Testing/02-Test_Ability_to_Forge_Requests.md)   
[INPUT VALIDATION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)   
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
928d819fc19405ae09921a2b71227bd9aba106f9d2d37ac412e9e5a750f1506d
```
