;	
;	void	ft_list_push_front(t_list **begin_list, void *data) {
;		t_list *tmp = malloc(sizeof(t_list));
;	
;		if (!tmp)
;			return ;
;		tmp->data = data;
;		tmp->next = NULL;
;		if (!*begin_list) {
;			*begin_list = tmp;
;			return ;
;		}
;		tmp->next = *begin_list;
;		*begin_list = tmp;
;	}
;
;	author: alellouc@student.42nice.fr
;	date:	2023-07-04 Monday 
;	

section	.text

%ifndef MACOSX
global	ft_list_push_front
extern	malloc

ft_list_push_front:
%else
global	_ft_list_push_front
extern	_malloc

_ft_list_push_front:
%endif
	push	rbp		;
	mov		rbp, rsp
	sub		rsp, 32	; resa 32 bytes : params begin_list && data + struct sur 16 bytes (struct contenant 2
					; pointeurs 8 bytes

	mov		[rbp - 8], rdi		;	recup begin_list
	mov		[rbp - 16], rsi		;	recup data
	mov		edi, 16				;	16 => sizeof(t_list) préparer comme 1er arg pour malloc
%ifndef MACOSX
	call	malloc wrt ..plt	;	on malloc la memoire pr une struct t_list tmp
%else
	call	_malloc				;	on malloc la memoire pr une struct t_list tmp
%endif
	mov		[rbp - 24], rax		; sauvegarde du resultat malloc tmp sur la stack
	cmp		qword [rbp - 24], 0	; si malloc a réussi (si t_list == 0)
	jne		.init_internal_pointers		; go init la struct t_list
	jmp		.epilog_ft_list_push_front	; sinon go la fin

.init_internal_pointers:
	mov		rcx, [rbp - 16]	; recup data
	mov		rax, [rbp - 24]	; recup struct t_list tmp
	mov		[rax], rcx		; rax prend la valeur de rcx, donc rbp - 24 prend la val de rbp - 16 => tmp->data = data
	mov		rax, [rbp - 24]	; recup struct tmp pr
	mov		qword [rax + 8], 0	; acces a la case mem struct tmp + 8 bytes => tmp->next + mise a z
	
	mov		rax, [rbp - 8]	;	recup begin_list
	cmp		qword [rax], 0	;	*begin_list == 0 ?
	jne		.push_front		; si non go push tmp au debut de begin_list

	mov		rcx, [rbp - 24]	; si begin_list == null, recup struct t_list tmp
	mov		rax, [rbp - 8]	; recup begin_list
	mov		[rax], rcx		; et *begin_list = tmp 
	jmp		.epilog_ft_list_push_front

.push_front:
	mov		rax, [rbp - 8]	; recup begin_list
	mov		rcx, [rax]		; recup *begin_list
	mov		rax, [rbp - 24]	; recup t_list tmp
	mov		[rax + 8], rcx	; tmp->next = begin_list

	mov		rcx, [rbp - 24]	; recup t_list tmp
	mov		rax, [rbp - 8]	; recup begin_list
	mov		[rax], rcx		; *begin_list = tmp

.epilog_ft_list_push_front:
	add		rsp, 32			; Remise de la stack en etat
	pop		rbp				; Recup rbp antérieur
	ret
