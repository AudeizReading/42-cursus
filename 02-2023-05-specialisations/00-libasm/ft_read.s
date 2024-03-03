;	ssize_t	ft_read(int fildes, const void *buffer, int iovcnt);
;
;		ecrit le buffer de taille iovcnt dans le file descriptor fildes
;		inspiré de 
;		
;	author: alellouc@student.42nice.fr
;	date:	2023-06-29 Thursday
section	.data

read_syscall:
%ifndef MACOSX
	dq	0					
%else
	dq	0x2000003					; bien plus comprehensible que seulement 0x2000004 
%endif
									; Les numeros des syscalls MacOSX sont tous préfixés d'un 2.
section .text

%ifndef MACOSX
extern __errno_location
global ft_read

ft_read:

%else
extern ___error
global _ft_read

_ft_read:
%endif
;prolog
	push	rbp	;
	mov		rbp, rsp	;
	sub		rsp, 32

	mov		rax, [rel read_syscall]		; On doit placer la valeur du syscall dans rax
											; [rel read_syscall] est la syntaxe pour acceder a la valeur d'un
											; label de la section data (nasm tutorial)


	syscall									; Appel au syscall write
	mov		[rbp - 8], rax					; Sauvegarde du retour de l'appel système read
											; MacOSX a la particularité de ne pas retourner les erreurs sous
											; forme negative, par contre le flag CF est levé si un syscall
											; rencontre un souci et le code retourné dans rax est le numéro de
											; l'erreur qu'il nous faut pour parametrer errno
%ifndef MACOSX
	cmp		rax, 0
	jl		.errno_settings					; On checke le retour < 0 Linux != Mac, 
%else
	jc		.errno_settings					; On checke le flag CF avec l'instruction jc (jump carry...), 
											; si CF est levé alors go pour la gestion de errno
%endif
	jmp		.epilog							; sinon go la fin

.errno_settings:
%ifndef MACOSX
	call	__errno_location wrt ..plt
%else
	call	___error						; call ___error, __errno_location ne semble pas fonctionner sous
											; MacOSX. Cette routine ne prend aucun argument et retourne un int
											; correspondant a errno. errno se trouve alors dans rax
%endif
	mov		ecx, dword [rbp - 8]			; On recup le retour du syscall read pour set errno avec
	mov		dword [rax], ecx				; Enfin, errno = retour syscall + ajustement sur 4 bytes
%ifndef MACOSX								; Sur OS Linux il nous faut pour val
	neg		dword [rax]						; d'errno son inverse, d'ou neg
%endif

	mov		dword [rbp - 8], -1				; On place -1 sur la stack, a l'endroit qu'on a reservé pr les
											; valeurs de retour, pour le rappeler au prolog
.epilog:
	mov		eax, dword [rbp - 8]			; On recupere la valeur de retour du syscall read pr la retourner
	add		rsp, 32							; On remet la stack propre
	pop		rbp								; On remet rbp dans son etat anterieur
	ret										;
