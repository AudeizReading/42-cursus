# Procédure FILE INCLUSION 

Cette procédure s'exécute sur l'url : `ip_darkly/?page=...`.

L'idée c'est de tester quelles ressources sont accessibles, en plus de
toutes celles que nous venons déjà de voir et peuvent être servies au
travers d'instructions `include` mal filtrées.

On constate en essayant des bouts de tronçons de chemins, qu'une alerte
se déclenche en nous disant `Wtf?`. On est sur la bonne voie.

Lorsqu'on entrera `../../../../../../../etc/passwd`, une alerte se
déclenchera et nous donnera le flag, car on aura réellement atteint
cette location au sein du serveur. Cela peut se révéler très dangereux,
surtout avec ce type de fichiers...

# Comment s'en prémunir

- Ne jamais faire d'include sur une saisie utilisateur.
- Ajouter dans le fichier de configuration une interdiction de parcourir
  les répertoires du serveur web (voir [open_basedir][1]).

  [1]: https://www.php.net/manual/fr/ini.core.php#ini.open-basedir

## Pour plus d'informations:  
[WSTG-INPV-11](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_File_Inclusion.md)   
[WSTG-ATHZ-01](https://github.com/clallier94/wstg-translation-fr/blob/main/4-Web_Application_Security_Testing/05-Authorization_Testing/01-Testing_Directory_Traversal_File_Include.md)   
[FILE INCLUSION CHEATSHEET](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/File%20Inclusion)
[FILE UPLOAD
CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)   

## Flag
```text
b12c4b2cb8094750ae121a676269aa9e2872d07c06e429d25a63196ec1c8c1d0
```
