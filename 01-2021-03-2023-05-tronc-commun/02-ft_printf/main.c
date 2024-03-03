#ifdef TEST
#include "libftprintf.h"
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
# ifdef FT_PRINTF
#  define F(...)\
res = ft_printf(__VA_ARGS__);
# else
#  define F(...)\
res = printf(__VA_ARGS__);
# endif /* FT_PRINTF */
int	main(void)
{
	char	*test = "Hello";
	int		res;
	
	F(" %% \n");
	F(" %%%% \n");
	F(" %% %% %% \n");
	F(" %%  %%  %% \n");
	F(" %%   %%   %% \n");
	F("%%\n");
	F("%% %%\n");
	F("%%c:\t%c:\n", '0');
	F(":%c:\t%%c\n", '0');
	F(":%c:\t%%c\n", '0' - 256);
	F(":%c:\t%%c\n", '0' + 256);
	F(":%c:\t%%c\n", 0);
	F("0:%c:\t0%%c\n", 0);
	F(":%c:\t%%c\n", -129);
	F(":%c:\t%%c\n", 128);
	F(":%c:\t%%c\n", 'a');
	F(":%c: :%c: :%c: :%c: :%c:\t%%c\n", CHAR_MAX, CHAR_MIN, 0, -123, 123);
	F(":%s:\n","Allo");
	F(":%s:\n","");
	F(":%s:\n", NULL);
	F(":%s: :%s: :%s: :%s: :%s:\t%%s\n", "Salut", "ça", "va", "bien", "?");
	F(":%d:\t%%d\n", 123);
	F(":%d:\t%%d\n", -123);
	F(":%d:\t%%d\n", 0);
	F(":%d:\t%%d\n", INT_MIN);
	F(":%d:\t%%d\n", INT_MAX);
	F(":%d: :%d: :%d: :%d: :%d:\t%%d\n", INT_MAX, INT_MIN, 0, -123, 123);
	F(":%i:\t%%i\n", 123);
	F(":%i:\t%%i\n", -123);
	F(":%i:\t%%i\n", 0);
	F(":%i:\t%%i\n", INT_MIN);
	F(":%i:\t%%i\n", INT_MAX);
	F(":%i: :%i: :%i: :%i: :%i:\t%%i\n", INT_MAX, INT_MIN, 0, -123, 123);
	F(":%u:\t%%u\n", 123);
	F(":%u:\t%%u\n", -123);
	F(":%u:\t%%u\n", 0);
	F(":%u:\t%%u\n", INT_MIN);
	F(":%u:\t%%u\n", INT_MAX);
	F(":%u: :%u: :%u: :%u: :%u:\t%%u\n", INT_MAX, INT_MIN, 0, -123, 123);
	F(":%x:\t%%x\n", 123);
	F(":%x:\t%%x\n", -123);
	F(":%x:\t%%x\n", 0);
	F(":%x:\t%%x\n", INT_MIN);
	F(":%x:\t%%x\n", INT_MAX);
	F(":%x: :%x: :%x: :%x: :%x:\t%%x\n", INT_MAX, INT_MIN, 0, -123, 123);
	F(":%X:\t%%X\n", 123);
	F(":%X:\t%%X\n", -123);
	F(":%X:\t%%X\n", 0);
	F(":%X:\t%%X\n", INT_MIN);
	F(":%X:\t%%X\n", INT_MAX);
	F(":%X: :%X: :%X: :%X: :%X:\t%%X\n", INT_MAX, INT_MIN, 0, -123, 123);
	F(":%c: :%s: :%d: :%i: :%u: :%x: :%X:\t%%La totale\n", 65 + 12, test, INT_MIN, 0, -123, 123, INT_MAX);
	F(":%p:\n", NULL);
//	F(":%p:\n", test);
//	ft_printf("ft_printf :%p:\n", test);
//	printf("printf :%p:\n", test);
	return 0;
}
#endif /* TEST */
