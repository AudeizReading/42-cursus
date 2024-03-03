;	int		ft_strcmp(const char *s1, const char *s2) {
;		while (*s1 == *s2++)
;			if (*s1++ == 0)
;				return 0;
;		return (*(unsigned char *)s1 - *(unsigned char *)--s2);
;	}
;		compare s1 et s2. Retourne 0 si les 2 sont pareils, sinon retourne la différence des 2
;		inspiré de https://opensource.apple.com/source/Libc/Libc-262/i386/gen/strcmp.c.auto.html
;		
;	author: alellouc@student.42nice.fr
;	date:	2023-06-27 Tuesday


section .text

%ifndef MACOSX
global ft_strcmp					; On rend ft_strcmp accessible pour les programmes externes

ft_strcmp:
%else
global _ft_strcmp					; On rend ft_strcmp accessible pour les programmes externes

_ft_strcmp:
%endif
; prolog
	push	rbp						;
	mov		rbp, rsp				; Sauvegardes utiles

	mov		[rbp - 16], rdi			; Recup s1
	mov		[rbp - 24], rsi			; Recup s2

loop_init:
	mov		rax, qword [rbp - 16]	; Recup s1
	movsx	eax, byte [rax]			; Recup *s1 dans le registre eax

	mov		rcx, qword [rbp - 24]	; Recup s2
	mov		rdx, rcx				; Sauvegarde de s2 depuis rcx vers rdx afin de pouvoir acceder a *s2 une
									; fois qu'on aura avancé sur la mémoire
	add		qword rdx, 1			; s2++
	mov		qword [rbp - 24], rdx	; (on place la nouvelle adresse de s2 sur la stack)
	movsx	ecx, byte [rcx]			; Recup *s2 dans le registre ecx

	cmp		eax, ecx				; Si *s1 == *s2
	jne		loop_exit				; ne sont pas pareils, alors exit
									;
									; sinon on continue
	mov		rax, qword [rbp - 16]	; On recup s1
	mov		rcx, rax				; On sauvegarde s1 dans rcx afin de pouvoir acceder a sa valeur apres avoir
									; incrementer le pointeur
	add		qword rcx, 1			; s1++
	mov		qword [rbp - 16], rcx	; s1 avancé d'une case mémoire est replacé sur la stack
	movsx	eax, byte [rax]			; et on recup *s1 avant incrémentation

	cmp		eax, 0					; si *s1 == 0
	jne		loop_restart			; si *s1 != 0, on recommence un tour de loop 
	mov		dword [rbp - 4], 0		; sinon on retourne 0 (on place cette valeur sur la stack)
	jmp		prolog					; direction le prolog

loop_restart:
	jmp		loop_init

loop_exit:							; Sortie boucle while
	mov		rax, [rbp - 16]			; on recup s1
	movzx	eax, byte [rax]			; on le formate sur 4 bytes

	mov		rcx, [rbp - 24]			; On recup s2
	mov		rdx, rcx				; On sauvegarde dans rdx pour acceder a *s2 le moment venu
	add		qword rdx, -1			; --s2
	mov		qword [rbp - 24], rdx	; la nouvelle adresse de s2 est placée sur la stack
	movzx	ecx, byte [rcx - 1]		; et on recup la valeur *s2 qui nous concerne

	sub		dword eax, ecx			; *s1 - *s2, le résultat se retrouvera auto dans eax

	mov		dword [rbp - 4], eax	; On pose eax sur la stack, (cela permet de pouvoir recup 0 si *s1 == 0)

prolog:
	mov		eax, dword [rbp - 4]	; On depile le resultat dans eax (size 4 bytes) afin de le rendre 
									; accessible à l'appelant
	pop		rbp						; Restauration état antérieur
	ret								;
