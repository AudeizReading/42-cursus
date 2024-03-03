;	
;	void	ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)(), void (*free_fn)(void *)) {
;		if (!*begin_list)
;			return;
;		t_list	*tmp = *begin_list;
;		t_list	*prev = NULL;
;		if ((*cmp)(tmp->data, data_ref) == 0) {
;			(*begin_list) = prev = tmp->next;
;			(*free_fn)(tmp->data);
;			free(tmp);
;			tmp = prev;
;		}
;		
;		while (tmp) {
;			if ((*cmp)(tmp->data, data_ref) == 0) {
;				prev->next = tmp->next;
;				(*free_fn)(tmp->data);
;				free(tmp);
;				tmp = prev;
;			}
;			prev = tmp;
;			tmp = tmp->next;
;		}
;	}
;
;	author: alellouc@student.42nice.fr
;	date:	2023-07-04 Tuesday - 2023-07-05 Wednesday
;	

section	.text

%ifndef MACOSX
global	ft_list_remove_if
extern	free

ft_list_remove_if:
%else
global	_ft_list_remove_if
extern	_free

_ft_list_remove_if:
%endif
	push	rbp		
	mov		rbp, rsp
	sub		rsp, 48								; resa 48 bytes sur la stack

	mov		qword [rbp - 8], rdi				; recup begin_list sur la stack
	mov		qword [rbp - 16], rsi				; recup data_ref sur la stack
	mov		qword [rbp - 24], rdx				; recup fn cmp
	mov		qword [rbp - 32], rcx				; recup fn free

	mov		rax, qword [rbp - 8]				; recup begin_list
	cmp		qword [rax], 0						; *begin_list == 0 ?
	jne		.erase_head_node					; si non go recup l'elt suivant et delete la tete si = data_ref

	jmp		.epilog_ft_list_remove_if			; si oui go la fin

	.erase_head_node:
	mov		rax, qword [rbp - 8]				; recup begin_list
	mov		rax, qword [rax]					; recup *begin_list
	mov		qword [rbp - 40], rax				; sauvegarde de *begin_list dans une mem tmp de la stack
	mov		qword [rbp - 48], 0					; on init un 2e espace memoire pr recup le prev node (qui ici
												; sera le next node: sur une ll pour garder une trace du noeud
												; prev il faut travailler avec le noeud courant et le noeud
												; suivant - sinon on ne raccroche pas les wagons correctement
												; entre eux

	mov		rcx, qword [rbp - 24]				; recup fn cmp
	mov		rax, qword [rbp - 40]				; recup node tmp (noeud courant)
	mov		rdi, qword [rax]					; preparation *tmp->data pr cmp
	mov		rsi, qword [rbp - 16]				; preparation data_ref pour cmp
	call	rcx									; appel de la fn de comparaison
	cmp		eax, 0								; si on est sur la data qu'on cherche ?
	jne		.delete_node_while_equal_data_ref	; sinon go la suivante de la liste

	mov		rax, qword [rbp - 40]				; recup tmp (noeud courant)
	mov		rcx, qword [rax + 8]				; recup tmp->next
	mov		qword [rbp - 48], rcx				; sauvegarde tmp sur la stack de tmp->next

	mov		rax, qword [rbp - 8]				; recup begin_list
	mov		qword [rax], rcx					; recup *begin_list
	mov		rax, qword [rbp - 32]				; recup fn free
	mov		rcx, qword [rbp - 40]				; recup tmp->data
	mov		rdi, qword [rcx]					; on place tmp pour arg de la fn free
	call	rax									; apl de la fn free sur tmp->data

	mov		rdi, qword [rbp - 40]				; tmp pour arg a free		
%ifndef MACOSX
	call	free wrt ..plt								; apl free
%else
	call	_free								; apl free
%endif

	mov		rax, qword [rbp - 48]				; recup de tmp->next
	mov		qword [rbp - 40], rax				; tmp = tmp->next

.delete_node_while_equal_data_ref: 
	cmp		qword [rbp - 40], 0					; tmp == 0?
	je		.epilog_ft_list_remove_if			; si oui go la fin

	mov		rcx, qword [rbp - 24]				; recup fn cmp
	mov		rax, qword [rbp - 40]				; recup node tmp->data (node courant)
	mov		rdi, qword [rax]					; prep pr arg fn cmp
	mov		rsi, qword [rbp - 16]				; prep data_ref pr arg fn cmp
	call	rcx									; apl fn cmp
	cmp		eax, 0								; data_ref == tmp->data ?
	jne		.get_next_node						; si non go le node suivant		

	mov		rax, qword [rbp - 40]				; recup tmp
	mov		rcx, qword [rax + 8]				; recup tmp->next via tmp
	mov		rax, qword [rbp - 48]				; recup prev node (tmp->next mais via la stack)
	mov		qword [rax + 8], rcx				; prev->next = tmp->next
	
	mov		rax, qword [rbp - 32]				; recup fn free
	mov		rcx, qword [rbp - 40]				; recup tmp->data
	mov		rdi, qword [rcx]					; prep pr arg de la fn free
;%ifndef MACOSX
;	call	[rax]									; apl fn free sur tmp->data
;%else
	call	rax									; apl fn free sur tmp->data
;%endif

	mov		rdi, qword [rbp - 40]				; recup tmp
%ifndef MACOSX
	call	free wrt ..plt						; free tmp
%else
	call	_free								; free tmp
%endif

	mov		rax, qword [rbp - 48]				; recup prev node
	mov		qword [rbp - 40], rax				; rattachement a tmp => tmp = prev

.get_next_node:  
	mov		rax, qword [rbp - 40]				; recup tmp
	mov		qword [rbp - 48], rax				; recup prev node prev = tmp

	mov		rax, qword [rbp - 40]				; recup tmp
	mov		rax, qword [rax + 8]				; recup tmp->next
	mov		qword [rbp - 40], rax				; tmp = tmp->next
	jmp		.delete_node_while_equal_data_ref	; go delete du node

.epilog_ft_list_remove_if:
	add		rsp, 48								; remise stack en etat
	pop		rbp									; restauration old rbp
	ret
