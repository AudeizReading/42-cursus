;	
;	
;	int ft_atoi_base(char *str, char *base) (C04 - ex05)
;
;		Write a function that converts the initial portion of the string pointed by str to int representation.
;		• str is in a specific base given as a second parameter.
;		• excepted the base rule, the function should work exactly like ft_atoi.
;		• If there’s an invalid argument, the function should return 0. Examples of invalid
;			arguments :
;			◦ base is empty or size of 1;
;			◦ base contains the same character twice ;
;			◦ base contains + or - or whitespaces;
;		
;	// Ex: ft_atoi_base("123", "0123456789")
;	int ft_atoi_base(char *str, char *base) {
;		register long int result;
;		register int polarity, base_int, idx_base;
;	
;		result = idx_base = 0;
;		base_int = get_base(base);
;		if (base_int < 2)
;			return 0;
;		polarity = get_polarity(str);
;		char	*p_str_trim = trim(str);
;		while (*p_str_trim) {
;		//	idx_base = 0;
;			while (base[idx_base] != *p_str_trim)
;				idx_base++;
;			if (idx_base >= base_int)
;				return 0;
;			result = result * base_int + idx_base;
;			p_str_trim++;
;		}
;	
;		return (int)(result * polarity);
;	}
;
;		La fonction utilise les fonctions: get_base(), get_polarity(), trim(), ft_isspace() qu'il faudra
;		également recoder de façon locale.
;
;	author: alellouc@student.42nice.fr
;	date:	2023-06-30 Friday - 2023-07-04 Monday 

section	.text

%ifndef MACOSX
global	ft_atoi_base

ft_atoi_base:
%else
global	_ft_atoi_base

_ft_atoi_base:
%endif
	push	rbp
	mov		rbp, rsp
	sub		rsp, 64

	mov		[rbp - 16], rdi			; recup str sur la stack
	mov		[rbp - 24], rsi			; recup base sur la stack
	mov		dword [rbp - 44], 0		; idx_base = 0
	mov		qword [rbp - 32], 0		; result = 0 => long int sur 8 bytes (int sur 4 bytes)

	mov		rdi, [rbp - 24]			; recup base pour parametre de get_base
%ifndef MACOSX
	call	get_base				; on recup la base en int
%else
	call	_get_base				; on recup la base en int
%endif
	mov		[rbp - 40], eax			; on place ce resultat sur la stack base_int

	cmp		dword [rbp - 40], 2		; base < 2 ?
	jge		.set_polarity_and_str_trim	; non -> go set les dernieres valeurs qui nous manque

	mov		dword [rbp - 4], 0		; oui alors retour 0
	jmp		.epilog_ft_atoi_base

.set_polarity_and_str_trim:
	mov		rdi, [rbp - 16]			; recup de str pr le passer a get_polarity 
									; va determiner si le nombre est pair ou impair
%ifndef MACOSX
	call	get_polarity			;
%else
	call	_get_polarity			;
%endif
	mov		dword [rbp - 36], eax	; le choix de cet adresse est un peu trivial, en suivant la pure continuité
									; du code, sans savoir ce qu'il fait par la suite, on ne pouvait pas savoir
									; a l'avance qu'on peut intercaler un int a cet endroit, au debut, on place
									; ces variables sur les lows bytes, donc un int situé en case memoire
									; "rbp-40"
									; oqpera les bytes "rbp-37-38-39-40", (on aligne la stack sur multiple de 
									; 16 bytes, les mov sur 8 par defaut), par consequent les bytes rbp - 32 a -
									; 36 sont libres et peuvent oqp par le retour de get_polarity

	mov		rdi, [rbp - 16]			; On recup str pr argument
%ifndef MACOSX
	call	trim					;
%else
	call	_trim					;
%endif
	mov		[rbp - 56], rax			; On recupere str elimé des character a skip

.while_str_not_null:
	mov		rax, [rbp - 56]			; On recup le nv str pr boucler dessus
	cmp		byte [rax], 0			; est la chaine est null ?
	je		.set_atoi_polarity		;
	mov		dword [rbp - 44], 0		; raz idx_base

.while_search_base_translation:
	mov		rax, [rbp - 24]			; recup base
	movsxd	rcx, [rbp - 44]			; recup idx_base
	movsx	eax, byte [rax + rcx]	; recup base[idx_base]
	mov		rcx, [rbp - 56]			; recup p_str_trim
	movsx	ecx, byte [rcx]			; recup *p_str_trim
	cmp		eax, ecx				; base[idx_base] == *p_str_trim
	je		.check_max_base			;

	mov		eax, dword [rbp - 44]	; idx_base++
	add		eax, 1					;
	mov		dword [rbp - 44], eax	;
	jmp		.while_search_base_translation

.check_max_base:
	mov		eax, dword [rbp - 44]	; recup idx_base
	cmp		eax, dword [rbp - 40]	; idx_base == base_int
	jl		.the_big_atoi_base		; si idx_base < base_int => go atoi

	mov		dword [rbp - 4], 0		; sinon retour 0
	jmp		.epilog_ft_atoi_base		;

.the_big_atoi_base:
	mov		rax, [rbp - 32]	; recup result
	movsxd	rcx, dword [rbp - 40]	; recup base sur rcx (!ecx)
	imul	rax, rcx				; result * base_int (resultat dans rax)

	movsxd	rcx, dword [rbp - 44]	; recup idx_base
	add		rax, rcx				; resultat dans eax + idx_base 
	mov		[rbp - 32], rax			; on met ce resultat dans sa case memoire

	mov		rax, [rbp - 56]			; recup p_str_trim
	add		rax, 1					;
	mov		[rbp - 56], rax			; p_str_trim++
	jmp		.while_str_not_null		; on recommence un tour tant que str != null

.set_atoi_polarity:
	mov		rax, [rbp - 32]			; recup result
	movsxd	rcx, [rbp - 36]			; recup polarity
	imul	rax, rcx				; result * polarity
	mov		dword [rbp - 4], eax	; setup pr retour

.epilog_ft_atoi_base:
	mov		eax, dword [rbp - 4]	;
	add		rsp, 64
	pop		rbp
	ret	

; ===========================================================================================================
;	int	ft_isspace(char str) {
;		if (str == 32 || (str >= 9 && str <= 13))
;			return 1;
;		return 0;
;	}

;section	.text

%ifndef MACOSX
global	ft_isspace

ft_isspace:
%else
global	_ft_isspace

_ft_isspace:
%endif
	push	rbp					;
	mov		rbp, rsp			; On sauvegarde l'état antérieur à la routine

	mov		al, dil				; recup du param str qui est un char, donc tient sur 8 bits (1byte),
								; on peut donc adresser les lows bits des registres concernés,
								; ceux aussi étant sur 8 bits
	mov		byte [rbp - 5], al	; on place str sur la stack, on oqp une taille de 1 byte

	movsx	eax, byte [rbp - 5]	; et on la recup en la convertissant en int (4bytes d'où eax)
	cmp		eax, 32				; pr la comparer a l'int 32 (ascii = espace)
	je		.is_space			; on jump au label isspace pour retourner 1

								; Sinon on continue le check de valeur
	movsx	eax, byte [rbp - 5]	; On recup str (eax aura pu etre ecrasee entre temps)
	cmp		eax, 9				; pr le comp a 9 (car ascii ht, de la catégorie des car d'espaces)
	jl		.is_not_space

	movsx	eax, byte [rbp - 5]	; On recup str (eax aura pu etre ecrasee entre temps)
	cmp		eax, 13				; pr le comp a 13 (car ascii \r, de la catégorie des car d'espaces)
	jg		.is_not_space

.is_space:
	mov		dword [rbp - 4], 1	; on place la valeur 1 qui confirme si le car est bien un car d'espace sur la stack
	jmp		.epilog_is_space				; et on go la retourner

.is_not_space:
	mov		dword [rbp - 4], 0	; On a rien trouvé, donc on met 0 sur la stack comme valeur de retour

.epilog_is_space:
	mov		eax, [rbp - 4]		; On recup le retour qu'on a posé sur la stack pour la retourner via eax
	pop		rbp					; On restaure l'état antérieur à la routine
	ret							; Fin ft_isspace

; ===========================================================================================================
;	void	*ft_memset(void *buf, int val, size_t len) {
;		unsigned char	*p_b;
;		unsigned char	c_c;
;	
;		p_b = buf;
;		c_c = val;
;		while (len--)
;			*p_b++ = c_c;
;		return buf;
;	}
;
;section	.text
;
%ifndef MACOSX
global	ft_memset

ft_memset:
%else
global	_ft_memset

_ft_memset:
%endif
	push	rbp						;
	mov		rbp, rsp				;

	mov		[rbp - 8], rdi			; recup buf
	mov		dword [rbp - 12], esi	; recup val (4 bytes)
	mov		[rbp - 24], rdx			; recup len

	mov		rax, [rbp - 8]			; p_b = buf
	mov		[rbp - 32], rax			;

	mov		eax, dword [rbp - 12]	; c_c = val
	mov		byte [rbp - 33], al		; -> ici on cast l'entree int en output char et on stack

.while_len_non_zero:
	mov		rax, [rbp - 24]			; recup len
	mov		rcx, rax				; sauvegarde value len
	add		rcx, -1					; len--
	mov		[rbp - 24], rcx			; sauvegarde len-- sur stack pr prochaine verif si non 0

	cmp		rax, 0					; len == 0 ?
	je		.epilog_ft_memset					; go epilog

	mov		cl, [rbp - 33]			; recup c_c
	mov		rax, [rbp - 32]			; recup p_b
	mov		byte [rax], cl			; *p_b = c_c
	mov		rdx, rax				;
	add		rdx, 1					; p_b++
	mov		[rbp - 32], rdx			; renvoi sur la stack du prochain p_b
	jmp		.while_len_non_zero		; go nouveau tour de loop

.epilog_ft_memset:
	mov		rax, [rbp - 8]			; return buf
	pop		rbp						;
	ret

; ===========================================================================================================
;	int get_base(char *base) {
;		char	already_seen[256] = {0};
;		register int	i = -1;
;		while (base[++i]) {
;			if (already_seen[(int)base[i]]
;					|| base[i] == 43
;					|| base[i] == 45 
;					|| base[i] <= 32
;					|| base[i] >= 126)
;				return -1;
;			already_seen[(int)base[i]] = '1';
;		}
;		return i;
;	}

;section .text
%ifndef MACOSX
global	get_base
extern	ft_memset

get_base:
%else
global	_get_base
extern	_ft_memset

_get_base:
%endif
	push	rbp						;
	mov		rbp, rsp				; On sauvegarde l'état antérieur à la routine

	sub		rsp, 288				; On reserve l'espace pr le tabl + i + retour

	mov		[rbp - 16], rdi			; On recup l'arg base
	mov		dword [rbp - 20], -1	; i = -1
									; On s'oqp du tableau de 256 char
	lea		rdi, [rbp - 288]		; => mov rdi, offset [rbp - 288]
									; on place l'offset dans rdi, on va le passer sur ft_memset (au moins pas
									; besoin de s'embeter a calculer les adr ou put la val 0, la fn va s'en
									; charger)
	xor		esi, esi				; on remet rsi a 0 via xor
	mov		edx, 256				; rdi prend la len du tab
%ifndef MACOSX
	call	ft_memset				; init du tableau a 0
%else
	call	_ft_memset				; init du tableau a 0
%endif

.while_base:
	mov		rax, qword [rbp - 16]		; recup base
	mov		ecx, dword [rbp - 20]		; recup i
	add		ecx, 1						; ++i
	mov		dword [rbp - 20], ecx			; sauvegarde i
	movsxd	rcx, ecx					; on met i sur 8 bytes pour le calcul d'adresse

	cmp		byte [rax + rcx], 0			; base[i] == 0
	je		.prepare_i_for_returning	;

	mov		rax, qword [rbp - 16]		; recup base
	movsxd	rcx, dword [rbp - 20]		; recup i
	movsx	eax, byte [rax + rcx]		; recup base[i]

	cdqe								; convertit eax en quadword (convert dword to qword)
	movsx	eax, byte [rbp + rax - 288]	; on recup already_seen[(int)base[i]]
	cmp		eax, 0						; est-ce qu'on a deja rencontré le char ? (check pas deux fois la meme
										; lettre dans la base)
	jne		.error_with_base			; si oui, erreur avec la base

	mov		rax, qword [rbp - 16]				; recup base
	movsxd	rcx, dword [rbp - 20]		; recup i
	movsx	eax, byte [rax + rcx]		; recup base[i]
	cmp		eax, 43						; est ce que base[i] == +
	je		.error_with_base			; si oui, erreur avec la base

	mov		rax, qword [rbp - 16]		; recup base
	movsxd	rcx, dword [rbp - 20]		; recup i
	movsx	eax, byte [rax + rcx]		; recup base[i]
	cmp		eax, 45						; est ce que base[i] == -
	je		.error_with_base			; si oui, erreur avec la base

	mov		rax, qword [rbp - 16]				; recup base
	movsxd	rcx, dword [rbp - 20]		; recup i
	movsx	eax, byte [rax + rcx]		; recup base[i]
	cmp		eax, 32		; est ce que base[i] <= 32
	jle		.error_with_base			; si oui, erreur avec la base
;
	mov		rax, qword [rbp - 16]				; recup base
	movsxd	rcx, dword [rbp - 20]		; recup i
	movsx	eax, byte [rax + rcx]		; recup base[i]
	cmp		eax, 126		; est ce que base[i] >= 126
	jge		.error_with_base			; si oui, erreur avec la base

	
	mov		rax, qword [rbp - 16]				; recup base
	movsxd	rdx, dword [rbp - 20]		; recup i
	movsx	eax, byte [rax + rdx]		; recup base[i] dans eax
	cdqe								;
	mov		byte [rbp + rax - 288], 49	; already_seen[(int)base[i]] = '1'
	jmp		.while_base

.error_with_base:
	mov		dword [rbp - 4], -1			; on set le retour a -1
	jmp		.epilog_get_base						; go la fin


.prepare_i_for_returning:
	mov		eax, dword [rbp - 20]	; recup i
	mov		dword [rbp - 4], eax	; on le met comme valeur de retour

.epilog_get_base:
	mov		eax, dword [rbp - 4]	; On recup le retour qu'on a posé sur la stack pour la retourner via eax
	add		rsp, 288				; Remise de la stack en place
	pop		rbp						; On restaure l'état antérieur à la routine
	ret								; Fin get_base

; ===========================================================================================================
;	int get_polarity(char *str) {
;		register int minus = 0;
;
;		while (*str == 43 || *str == 45 || ft_isspace(*str)) {
;			if (*str == 45)
;				minus++;
;			str++;
;		}
;		if (minus % 2)
;			return -1;
;		return 1;
;	}

;section	.text

%ifndef MACOSX
global	get_polarity

get_polarity:
%else
global	_get_polarity

_get_polarity:
%endif

	push	rbp
	mov		rbp, rsp
	sub		rsp, 32

	mov		qword [rbp - 16], rdi	; recup str 
	mov		dword [rbp - 20], 0		; compteur de minus

.while_symb_to_skip:                                 
	mov		rax, qword [rbp - 16]	; recup str
	movsx	ecx, byte [rax]			; recup *str
	mov		al, 1					;
	cmp		ecx, 43					; est ce que *str == 43 ?
	mov		byte [rbp - 21], al		; au cas *str != 43, on set une case mem a 1 sur la stack
									; pr s'en souvenir et jump 
	je		.is_condition_verified

	mov		rax, qword [rbp - 16]	; pareil mais pour *str == 45
	movsx	ecx, byte [rax]
	mov		al, 1
	cmp		ecx, 45
	mov		byte [rbp - 21], al         
	je		.is_condition_verified

	mov		rax, qword [rbp - 16]		; pareil mais pour check car espacement
	movsx	edi, byte [rax]
%ifndef MACOSX
	call	ft_isspace
%else
	call	_ft_isspace
%endif
	cmp		eax, 0
	setne	al
	mov		byte [rbp - 21], al 

.is_condition_verified:                                 
	mov		al, byte [rbp - 21]         
	test	al, 1
	jne		.update_minus_count
	jmp		.check_modulo_minus

.update_minus_count:                                 
	mov		rax, qword [rbp - 16]	; recup str 
	movsx	eax, byte [rax]		; recup *str
	cmp		eax, 45					; cmp *str == 45 ?
	jne		.increment_str
	mov		eax, dword [rbp - 20]	; recup le compteur minus
	add		eax, 1					; minus++
	mov		dword [rbp - 20], eax	; sauvegarde

.increment_str:					; deplacement str++                             
	mov		rax, qword [rbp - 16]
	add		rax, 1
	mov		qword [rbp - 16], rax
	jmp		.while_symb_to_skip		; on continue tant qu'il y des symboles a eviter

.check_modulo_minus:
	mov		eax, dword [rbp - 20]	; recup minus
	mov		ecx, 2					;
	cdq
	idiv	ecx					; eax / ecx => le reste est dans edx
	cmp		edx, 0					; si minus % 2 == 0, alors la polarity est positive
	je		.positive_polarity		;
	mov		dword [rbp - 4], -1		; sinon on prepare pour retourner -1
	jmp		.epilog_get_polarity

.positive_polarity:
	mov		dword [rbp - 4], 1		; on prepare pour retourner 1

.epilog_get_polarity:
	mov		eax, dword [rbp - 4]	; On recup la valeur du retour
	add		rsp, 32					; On remet la stack en ordre
	pop		rbp						; On rend a rbp sa valeur initiale
	ret
	
; ===========================================================================================================
; static char	*trim(char *str) {
;		register char *p_str = str;
;	
;		while (ft_isspace(*p_str) || *p_str == 43 || *p_str == 45)
;			p_str++;
;		return (str + (p_str - str));
;	}

;section	.text

%ifndef MACOSX
global	trim

trim:
%else
global	_trim

_trim:
%endif
	push	rbp;
	mov		rbp, rsp;
	sub		rsp, 32	;	Augment stack pr str && pointeur de retour

	mov		[rbp - 8], rdi	; sauvegarde str
	mov		rax, [rbp - 8]
	mov		[rbp - 16], rax	; sauvegarde p_str

.while_symb_to_skip:                                 
	mov		rax, qword [rbp - 16]	; recup str
	movsx	ecx, byte [rax]			; recup *str
	mov		al, 1					;
	cmp		ecx, 43					; est ce que *str == 43 ?
	mov		byte [rbp - 17], al		; au cas *str != 43, on set une case mem a 1 sur la stack
									; pr s'en souvenir et jump 
	je		.is_condition_verified

	mov		rax, qword [rbp - 16]	; pareil mais pour *str == 45
	movsx	ecx, byte [rax]
	mov		al, 1
	cmp		ecx, 45
	mov		byte [rbp - 17], al         
	je		.is_condition_verified

	mov		rax, qword [rbp - 16]		; pareil mais pour check car espacement
	movsx	edi, byte [rax]
%ifndef MACOSX
	call	ft_isspace
%else
	call	_ft_isspace
%endif
	cmp		eax, 0
	setne	al
	mov		byte [rbp - 17], al 

.is_condition_verified:                                 
	mov		al, byte [rbp - 17]         
	test	al, 1
	jne		.increment_str
	jmp		.epilog_trim

.increment_str:					; deplacement str++                             
	mov		rax, qword [rbp - 16]
	add		rax, 1
	mov		qword [rbp - 16], rax
	jmp		.while_symb_to_skip		; on continue tant qu'il y des symboles a eviter

.epilog_trim:
	mov		rax, [rbp - 8]
	mov		rcx, [rbp - 16]
	mov		rdx, [rbp - 8]
	sub		rcx, rdx
	add		rax, rcx
	add		rsp, 32
	pop		rbp;
	ret			;
