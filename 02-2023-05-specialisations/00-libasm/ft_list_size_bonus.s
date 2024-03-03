;	
;	int		ft_list_size(t_list *begin_list) {
;		int	size = 0;
;	
;		while (begin_list) {
;			size++;
;			begin_list = begin_list->next;
;		}
;		return size;
;	}
;
;	author: alellouc@student.42nice.fr
;	date:	2023-07-04 Tuesday 
;	

section	.text

%ifndef MACOSX
global	ft_list_size

ft_list_size:
%else
global	_ft_list_size

_ft_list_size:
%endif
	push	rbp
	mov		rbp, rsp

	mov		[rbp - 8], rdi			; recup begin_list
	mov		dword [rbp - 12], 0		; size = 0

.while_list_not_null:
	cmp		qword [rbp - 8], 0		; begin_list == 0
	je		.epilog_ft_list_size	; si oui, go la fin

	mov		eax, dword [rbp - 12]	; recup size
	add		eax, 1					;
	mov		dword [rbp - 12], eax	; size++
	mov		rax, [rbp - 8]			; recup begin_list
	mov		rax, [rax + 8]			; begin_list = begin_list->next
	mov		[rbp - 8], rax			; sauvegarde sur la stack
	jmp		.while_list_not_null

.epilog_ft_list_size:
	mov		eax, dword [rbp - 12]	; return size
	pop		rbp
	ret
