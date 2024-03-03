;	
;	void	ft_list_sort(t_list **begin_list, int (*cmp)()) {
;		if (!*begin_list)
;			return;
;		t_list	*current_node = *begin_list;
;		t_list	*tmp;
;		t_list	*swap;
;	
;		while (current_node) {
;			tmp = current_node->next;
;			while (tmp) {
;				if ((*cmp)(current_node->data, tmp->data) > 0) {
;					swap = current_node->data;
;					current_node->data = tmp->data;
;					tmp->data = swap;
;				}
;				tmp = tmp->next;
;			}
;			current_node = current_node->next;
;		}
;	}
;
;	author: alellouc@student.42nice.fr
;	date:	2023-07-04 Tuesday 
;	

section	.text

%ifndef MACOSX
global	ft_list_sort

ft_list_sort:
%else
global	_ft_list_sort

_ft_list_sort:
%endif
	push	rbp
	mov		rbp, rsp
	sub		rsp, 48		; resa 48 bytes sur la stack (begin_list, tmp, swap, le pointeur de fonction)

	mov		qword [rbp - 8], rdi	; recup begin_list on the stack
	mov		qword [rbp - 16], rsi	; recup du pointeur de fn cmp
	mov		rax, qword [rbp - 8]	; recup begin_list
	cmp		qword [rax], 0			; begin_list == 0 ?
	jne		.copy_begin_list
	jmp		.epilog_ft_list_sort

.copy_begin_list:
	mov		rax, qword [rbp - 8]		; recup de begin_list sur la stack
	mov		rax, qword [rax]			; recup de *begin_list
	mov		qword [rbp - 24], rax		; copie de *begin_list sur la stack -> current_node = begin_list

.while_current_node_not_null:                                 
	cmp		qword [rbp - 24], 0			; current_node == 0 ?
	je		.epilog_ft_list_sort		; si oui go la fin

	mov		rax, qword [rbp - 24]		; recup current_node
	mov		rax, qword [rax + 8]		; recup current_node->next
	mov		qword [rbp - 32], rax		; sauvegarde current_node->next sur la stack

.while_next_current_node_not_null:                                 
	cmp		qword [rbp - 32], 0			; current_node->next == 0
	je		.get_next_node				; go set le prochain maillon

	mov		rcx, qword [rbp - 16]		; recup pointeur fn cmp
	mov		rax, qword [rbp - 24]		; recup current_node(current_node->data, une struct pointe tjs sur son 1er elt
	mov		rdi, qword [rax]			; preparation *current_node->data pr 1er arg de la fn cmp
	mov		rax, qword [rbp - 32]		; preparation current_node->next->data
	mov		rsi, qword [rax]			; preparation *current_node->next->data pr 2nd arg de la fn cmp
	
;	mov		al, 0						; raz reg al
	call	rcx							; apl pointeur fn cmp
	cmp		eax, 0						; retourn de la cmp == 0 ?
	jle		.get_next_next_node			; si oui ou < go chercher le prochain noeud a trier (on trie avec le
										; noeud suivant, tri a bulles
	
	mov		rax, qword [rbp - 24]		; recup current_node
	mov		rax, qword [rax]			; recup *current_node->data
	mov		qword [rbp - 40], rax		; sauvegarde dans memoire swap

	mov		rax, qword [rbp - 32]		; recup current_node->next
	mov		rcx, qword [rax]			; recup *current_node->next->data
	mov		rax, qword [rbp - 24]		; recup current_node
	mov		qword [rax], rcx			; current_node->data = current_node->next->data

	mov		rcx, qword [rbp - 40]		; recup mem swap
	mov		rax, qword [rbp - 32]		; recup current_node->next
	mov		qword [rax], rcx			; current_node->next->data = swap

.get_next_next_node:                                 
	mov	rax, qword [rbp - 32]		; recup current_node->next
	mov	rax, qword [rax + 8]		; recup current_node->next->next
	mov	qword [rbp - 32], rax		; sauvegarde current_node->next->next
	jmp	.while_next_current_node_not_null	; nv tour de boucle

.get_next_node:                                 
	mov	rax, qword [rbp - 24]		; recup current_node
	mov	rax, qword [rax + 8]		; recup current_node->next
	mov	qword [rbp - 24], rax		; sauvegarde current_node->next
	jmp	.while_current_node_not_null	; nv tour de boucle

.epilog_ft_list_sort:
	add	rsp, 48						; remise en etat de la stack
	pop	rbp							; restitution old rbp
	ret
