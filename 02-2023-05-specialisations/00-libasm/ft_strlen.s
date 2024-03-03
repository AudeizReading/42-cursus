;	size_t ft_strlen(const char *s) {
;		register const char *_s;
;		for (_s = s; *_s; ++_s);
;		return (_s - s);
;	}
;		retourne la taille de la chaîne passee en paramètre
;		inspiré de https://opensource.apple.com/source/Libc/Libc-262/i386/gen/strlen.c.auto.html
;		
;	author: alellouc@student.42nice.fr
;	date:	2023-06-26 Monday
;

section		.text

%ifndef MACOSX
global		ft_strlen ; On definit et rend accessible ft_strlen, les noms de fonctions doivent commencer par _ sous MacOSX

ft_strlen:						; ft_strlen
%else
global		_ft_strlen ; On definit et rend accessible ft_strlen, les noms de fonctions doivent commencer par _ sous MacOSX

_ft_strlen:						; ft_strlen
%endif
; prolog
	push	rbp					; On sauvegarde ce qui peut etre dans rbp sur la stack avant de commencer qq chose
	mov		rbp, rsp			; On fait pointer rbp sur le haut de la stack, notre stackframe commence ici
	
	mov		[rbp - 8], rdi		; On recup le 1er arg de la fonction qui a été placé dans le registre rdi et on le
								; met sur la stack
	mov		rax, [rbp - 8]			; On recup le 1er arg de la fonction qui a été placé sur la stack 
								; et on le place dans rax, on garde cette valeur pour pouvoir la comparer avec 
								; l'adresse recuperee en fin de loop
	mov		[rbp - 16], rax		; On place l'adresse de rax, encore de la stack mais 8 bytes plus loin -> ca
								; correspond a notre pointeur de registre _s auquel on donne l'adresse
								; de l'argument s, on travaillera à partir de cette adresse pour obtenir la 
								; taille de la chaine
loop_for:
	mov		rax, [rbp - 16]		; On copie l'adresse du premier indice de _s dans rax
	cmp		byte [rax], 0		; On compare en bit la valeur de rax et 0
	je		loop_exit			; Si rax == 0, on va jusqu'au label loop_exit pour sortir de la boucle
	jmp		loop_continue		; Sinon on jump au label loop_continue, ou on incrementera _s

loop_continue:
	mov		rax, [rbp - 16]		; On copie l'adresse du premier indice de _s dans rax
	add		qword rax, 1		; On deplace de 8 bytes l'adresse de rax
	mov		[rbp - 16], rax		; On place cette nouvelle adresse sur la stack
	jmp		loop_for			; On retourne au label loop_for
	
loop_exit:
	mov		rax, [rbp - 16]		; On copie l'adresse du premier indice de _s dans rax
	mov		rcx, [rbp - 8]		; On depile dans le registre rcx notre parametre s
	sub		qword rax, rcx		; On soustrait les adresses de rax et rcx pour obtenir la taille de la chaine
								; Ce resultat sera stockée dans rax pour la fonction appelante
	
; epilog 
	pop		rbp					; On remet la stack en état
	ret							; Sortie
