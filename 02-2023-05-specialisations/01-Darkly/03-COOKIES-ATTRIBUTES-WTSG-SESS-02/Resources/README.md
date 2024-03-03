# Procédure GET THE COOKIES FLAG WITH SESSION MANAGEMENT - TESTING COOKIES ATTRIBUTES

1. Envoyer une requête HTTP HEAD `ip_darkly`:
    ```shell
    curl -sI "ip_darkly"
    ```
2. Analyser les en-têtes avec pour directives `Set-Cookie:cookie=value;`.
3. Récupérer la valeur du cookie `I_am_admin`. La valeur du cookie est encryptée
   en md5
4. Reverse le md5 -> la valeur obtenue est `false`.
5. Encrypter la valeur `true` en md5. Ce sera la nouvelle valeur du cookie.
6. Envoyer une requête GET avec le cookie modifié.

L'application nous reconnait comme étant admin

# Comment s'en prémunir

- Ne pas faire confiance aux données des Cookies ou utiliser des technologies plus sécurisées
  comme les tokens JWT.

## Conseils supplémentaires:

- Utiliser les attributs de cookies dans les en-têtes de requêtes HTTP afin de
  sécuriser la provenance des cookies, leur donner une durée de vie limitée :
```HTTP
Set-Cookie: <cookie-name>=<cookie-value>
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly
Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
Set-Cookie: <cookie-name>=<cookie-value>; Partitioned
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
Set-Cookie: <cookie-name>=<cookie-value>; Secure

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure

// Multiple attributes are also possible, for example:
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly

```
- Utiliser les préfixes `__Secure-` et `__Host-` pour les noms de cookies. Cela
  ne les rendra actifs que dans certaines circonstances très précises.
- Utiliser HTTPS afin de crypter les données transitant sur le réseau.

## Pour plus d'informations:  
[Set-Cookie Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes)   
[WSTG-SESS-02](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes.md)    
[WSTG-CRYP-03](https://github.com/clallier94/wstg-translation-fr/blob/0d20f06e3195a81fd07c9294207dd80ba7710e55/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels.md)    

## Flag
```text
df2eb4ba34ed059a1e3e89ff4dfc13445f104a1a52295214def1c4fb1693a5c3
```
