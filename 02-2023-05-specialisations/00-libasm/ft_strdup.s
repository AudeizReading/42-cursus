;	char*	ft_strdup(const char *s) {
;		size_t	len;
;		char	*copy;
;	
;		len = ft_strlen(s) + 1;
;		if ((copy = malloc(len)) == NULL)
;			return (NULL);
;		ft_strcpy(copy, s);
;		copy[len] = 0;
;		return (copy);
;	}
;		retourne une copie de la chaine s avec de la mémoire allouée
;		inspiré de https://opensource.apple.com/source/Libc/Libc-825.40.1/string/FreeBSD/strdup.c.auto.html
;				
;	author: alellouc@student.42nice.fr
;	date:	2023-06-28 Wednesday

section .text
%ifndef MACOSX
extern	ft_strlen
extern	ft_strcpy
extern	malloc

global	ft_strdup

; Ce sont les fonctions externes dont on aura besoin
; malloc est une fonction autorisée par le sujet
; j'ai reutilisé mon travail pour gagner un peu de temps

ft_strdup:
%else
extern	_ft_strlen
extern	_ft_strcpy
extern	_malloc

global	_ft_strdup

; Ce sont les fonctions externes dont on aura besoin
; malloc est une fonction autorisée par le sujet
; j'ai reutilisé mon travail pour gagner un peu de temps

_ft_strdup:
%endif
; prolog
	push	rbp						;
	mov		rbp, rsp				; Sauvegardes utiles

	sub		rsp, 32					; Augmentation de la stack de 32 bytes (2 variables locales len et copy, alignement de 16)
	mov		[rbp - 16], rdi			; Recup de s sur la stack

	mov		rdi, [rbp - 16]			; On place s dans rdi afin de le passer en param a ft_strlen
%ifndef MACOSX
	call	ft_strlen				; appel a ft_strlen, retour de la taille de s dans rax
%else
	call	_ft_strlen				; appel a ft_strlen, retour de la taille de s dans rax
%endif
	add		rax, 1					; On ajoute 1 a la valeur contenue dans rax (cette fois c'est une valeur et non
									; une adresse), c'est la taille pour le 0 final
	mov		[rbp - 24], rax			; Sauvegarde de la valeur de len sur la stack
	mov		rdi, [rbp - 24]			; On place len dans rdi afin de le passer a malloc

%ifndef MACOSX
	call	malloc wrt ..plt		; appel a malloc, le retour est mis dans rax https://www.nasm.us/xdoc/2.11.08/html/nasmdoc7.html#section-7.9.3
%else
	call	_malloc					; appel a malloc, le retour est mis dans rax
%endif
	mov		[rbp - 32], rax			; Sauvegarde du retour de malloc sur la stack
	cmp		rax, 0					; On checke si malloc a retourné 0 
	jne		copy_datas				; Si non (tout est OK), on va au label de copie des datas
	mov		qword [rbp - 8], 0		; Si fail de malloc, on place ce resultat sur la stack pour le restituer le
									; moment venu
	jmp		epilog					; go la fin aka le moment venu

copy_datas:
	mov		rdi, [rbp - 32]			; On place notre var locale copy dans le registre rdi pr call ft_strcpy
	mov		rsi, [rbp - 16]			; On place l'argument s dans le registre rsi pr call ft_strcpy
%ifndef MACOSX
	call	ft_strcpy				; appel a strcpy
%else
	call	_ft_strcpy				; appel a strcpy
%endif
	mov		rax, [rbp - 32]			; Sauvegarde de copy dans rax
	mov		rcx, [rbp - 24]			; On recup len dans rcx
	mov		byte [rax + rcx - 1], 0	; copy[len - 1] = 0

	mov		rax, [rbp - 32]			; Recuperation de copy dans rax
	mov		[rbp - 8], rax			; pour le positionner sur la case retour de la stack

epilog:
; epilog
	mov		rax, [rbp - 8]			; Recuperation du resultat dans rax pour le transmettre a l'appelant
	add		rsp, 32					; On remet la stack propre comme on l'a trouvee
	pop		rbp						; Restauration état antérieur
	ret								;
