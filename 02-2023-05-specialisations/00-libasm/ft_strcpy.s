;	char*	ft_strcpy(char *dst, const char *src) {
;		char *save = dst;
;		for (; (*dst = *src); ++src, ++dst);
;		return (save);
;	}
;		copie src vers dst et retourne ce qui a été copié
;		inspiré de https://opensource.apple.com/source/Libc/Libc-262/i386/gen/strcpy.c.auto.html
;
;	author: alellouc@student.42nice.fr
;	date:	2023-06-27 Tuesday


section .text

%ifndef MACOSX
global ft_strcpy		; On rend ft_strcpy accessible pour les programmes externes

ft_strcpy:
%else
global _ft_strcpy		; On rend ft_strcpy accessible pour les programmes externes

_ft_strcpy:
%endif

; Prolog
	push	rbp				; Sauvegarde du contenu de rbp sur la stack
	mov		rbp, rsp		; RBP pointe sur le haut de la stack

	mov		[rbp - 8], rdi	; Sauvegarde du 1er argument, dst, contenu dans le registre RDI, sur la stack
	mov		[rbp - 16], rsi	; Sauvegarde du 2nd argument, src, contenu dans le registre RSI, sur la stack

	mov		rax, [rbp - 8]	; On recup ce qui a été placé dans RDI (dst) puis sur la stack pour le placer dans RAX
	mov		[rbp - 24], rax	; Puis on copie RAX tout en haut de la stack frame. C'est sur cela qu'on va travailler
							; et itérer
							; Cela correspond à l'affectation du pointeur save vers dst: save = dst

loop_init:					; Une boucle for a besoin de 3 labels minimum pour itérer convenablement, ici c'est
							; l'init telle qu'on la connait sur une boucle for
	mov		rax, [rbp - 16]	; On recup dans RAX (src) ce qui a été mis dans RSI puis sur la stack
	mov		al, byte [rax]	; On copie dans AL la valeur du 1er byte de RAX

	mov		rcx, [rbp - 8]	; On recup dans RCX (dst) ce qui a été mis dans RDI puis sur la stack 
	mov		byte [rcx], al	; On copie dans AL (qui pointe sur la valeur de la 1ere case mem de dst présentée à cet
;	mov		byte al, [rcx]	; On copie dans AL (qui pointe sur la valeur de la 1ere case mem de dst présentée à cet
							; instant) la valeur du 1er byte de RCX
							; Ces 4 mov sont l'équivalent de *dst = *src

	cmp		byte al, 0		; On compare AL avec 0
	je		loop_exit		; Si AL == 0 (donc par extension si src == 0), on quitte la loop
	jmp		loop_continue	; Sinon on continue l'itération
	
loop_continue:				; Iteration des adresses de dst et src 
	mov		rax, [rbp - 16]	; On recup dans RAX (src) ce qui a été mis dans RSI puis sur la stack
	add		qword rax, 1	; On avance de 1 qword dans l'adresse contenue dans RAX (donc src)
	mov		[rbp - 16], rax	; Et on place cette nouvelle adresse obtenue sur la stack
							; Ces 3 instructions correspondent à ++src
							; On fait pareil pour dst
	mov		rax, [rbp - 8]	;
	add		qword rax, 1	;
	mov		[rbp - 8], rax	;
							; Ces 3 instructions correspondent à ++dst
	jmp		loop_init		; Retour à loop_init
	
loop_exit:					; Gestion de la sortie de la loop une fois qu'on trouve src == 0
	mov		rax, [rbp - 24]	; Nous avons copié l'adresse de dst a bp - 24, et cette adresse pointe vers bp - 8
							; dans lequel on a effectué la copie, c'est ce qu'on va récupérer dans RAX pour le
							; transmettre à toute fonction
	
; Epilog
	pop		rbp				; On remet RBP dans son état initial
	ret						; Sortie de ft_strcpy 
