#!/bin/sh
cat /etc/passwd | awk 'BEGIN {FS=":"} $0 !~ /^#/ {if (NR == 1 || (NR % 2) == 0)
{print $1}}' | rev | sort -r | awk -v offset_inf=$FT_LINE1 -v 	offset_sup=$FT_LINE2 'BEGIN {RS="\n"; ORS=", "} NR >= offset_inf && NR <=	offset_sup {print}' |	sed 's/, $/./' | tr -d \\n
