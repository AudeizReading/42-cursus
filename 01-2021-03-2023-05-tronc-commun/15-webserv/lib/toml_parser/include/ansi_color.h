/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ansi_color.h                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pbremond <pbremond@student.42nice.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/04 16:21:48 by pbremond          #+#    #+#             */
/*   Updated: 2022/09/27 01:37:59 by pbremond         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ANSI_COLOR_H
# define ANSI_COLOR_H

namespace ft
{

//Reset
# define RESET "\e[0m"

//Regular text
# define _BLK "\e[0;30m"
# define _RED "\e[0;31m"
# define _GRN "\e[0;32m"
# define _YEL "\e[0;33m"
# define _BLU "\e[0;34m"
# define _MAG "\e[0;35m"
# define _CYN "\e[0;36m"
# define _WHT "\e[0;37m"

//Regular bold text
# define BBLK "\e[1;30m"
# define BRED "\e[1;31m"
# define BGRN "\e[1;32m"
# define BYEL "\e[1;33m"
# define BBLU "\e[1;34m"
# define BMAG "\e[1;35m"
# define BCYN "\e[1;36m"
# define BWHT "\e[1;37m"

//Regular underline text
# define UBLK "\e[4;30m"
# define URED "\e[4;31m"
# define UGRN "\e[4;32m"
# define UYEL "\e[4;33m"
# define UBLU "\e[4;34m"
# define UMAG "\e[4;35m"
# define UCYN "\e[4;36m"
# define UWHT "\e[4;37m"

//Regular background
# define BLKB "\e[40m"
# define REDB "\e[41m"
# define GRNB "\e[42m"
# define YELB "\e[43m"
# define BLUB "\e[44m"
# define MAGB "\e[45m"
# define CYNB "\e[46m"
# define WHTB "\e[47m"

//High intensty background 
# define BLKHB "\e[0;100m"
# define REDHB "\e[0;101m"
# define GRNHB "\e[0;102m"
# define YELHB "\e[0;103m"
# define BLUHB "\e[0;104m"
# define MAGHB "\e[0;105m"
# define CYNHB "\e[0;106m"
# define WHTHB "\e[0;107m"

//High intensty text
# define HBLK "\e[0;90m"
# define HRED "\e[0;91m"
# define HGRN "\e[0;92m"
# define HYEL "\e[0;93m"
# define HBLU "\e[0;94m"
# define HMAG "\e[0;95m"
# define HCYN "\e[0;96m"
# define HWHT "\e[0;97m"

//Bold high intensity text
# define BHBLK "\e[1;90m"
# define BHRED "\e[1;91m"
# define BHGRN "\e[1;92m"
# define BHYEL "\e[1;93m"
# define BHBLU "\e[1;94m"
# define BHMAG "\e[1;95m"
# define BHCYN "\e[1;96m"
# define BHWHT "\e[1;97m"

// ============================================================================================== //
// ----------------------------------------- FUNCTIONS ------------------------------------------ //
// ============================================================================================== //

//Regular text
# define F_BLK(x) ("\e[0;30m" x RESET)
# define F_RED(x) ("\e[0;31m" x RESET)
# define F_GRN(x) ("\e[0;32m" x RESET)
# define F_YEL(x) ("\e[0;33m" x RESET)
# define F_BLU(x) ("\e[0;34m" x RESET)
# define F_MAG(x) ("\e[0;35m" x RESET)
# define F_CYN(x) ("\e[0;36m" x RESET)
# define F_WHT(x) ("\e[0;37m" x RESET)

//Regular bold text
# define F_BBLK(x) ("\e[1;30m" x RESET)
# define F_BRED(x) ("\e[1;31m" x RESET)
# define F_BGRN(x) ("\e[1;32m" x RESET)
# define F_BYEL(x) ("\e[1;33m" x RESET)
# define F_BBLU(x) ("\e[1;34m" x RESET)
# define F_BMAG(x) ("\e[1;35m" x RESET)
# define F_BCYN(x) ("\e[1;36m" x RESET)
# define F_BWHT(x) ("\e[1;37m" x RESET)

//Regular underline text
# define F_UBLK(x) ("\e[4;30m" x RESET)
# define F_URED(x) ("\e[4;31m" x RESET)
# define F_UGRN(x) ("\e[4;32m" x RESET)
# define F_UYEL(x) ("\e[4;33m" x RESET)
# define F_UBLU(x) ("\e[4;34m" x RESET)
# define F_UMAG(x) ("\e[4;35m" x RESET)
# define F_UCYN(x) ("\e[4;36m" x RESET)
# define F_UWHT(x) ("\e[4;37m" x RESET)

//Regular background
# define F_BLKB(x) ("\e[40m" x RESET)
# define F_REDB(x) ("\e[41m" x RESET)
# define F_GRNB(x) ("\e[42m" x RESET)
# define F_YELB(x) ("\e[43m" x RESET)
# define F_BLUB(x) ("\e[44m" x RESET)
# define F_MAGB(x) ("\e[45m" x RESET)
# define F_CYNB(x) ("\e[46m" x RESET)
# define F_WHTB(x) ("\e[47m" x RESET)

//High intensty background 
# define F_BLKHB(x) ("\e[0;100m" x RESET)
# define F_REDHB(x) ("\e[0;101m" x RESET)
# define F_GRNHB(x) ("\e[0;102m" x RESET)
# define F_YELHB(x) ("\e[0;103m" x RESET)
# define F_BLUHB(x) ("\e[0;104m" x RESET)
# define F_MAGHB(x) ("\e[0;105m" x RESET)
# define F_CYNHB(x) ("\e[0;106m" x RESET)
# define F_WHTHB(x) ("\e[0;107m" x RESET)

//High intensty text
# define F_HBLK(x) ("\e[0;90m" x RESET)
# define F_HRED(x) ("\e[0;91m" x RESET)
# define F_HGRN(x) ("\e[0;92m" x RESET)
# define F_HYEL(x) ("\e[0;93m" x RESET)
# define F_HBLU(x) ("\e[0;94m" x RESET)
# define F_HMAG(x) ("\e[0;95m" x RESET)
# define F_HCYN(x) ("\e[0;96m" x RESET)
# define F_HWHT(x) ("\e[0;97m" x RESET)

//Bold high intensity text
# define F_BHBLK(x) ("\e[1;90m" x RESET)
# define F_BHRED(x) ("\e[1;91m" x RESET)
# define F_BHGRN(x) ("\e[1;92m" x RESET)
# define F_BHYEL(x) ("\e[1;93m" x RESET)
# define F_BHBLU(x) ("\e[1;94m" x RESET)
# define F_BHMAG(x) ("\e[1;95m" x RESET)
# define F_BHCYN(x) ("\e[1;96m" x RESET)
# define F_BHWHT(x) ("\e[1;97m" x RESET)

} // namespace ft

#endif
