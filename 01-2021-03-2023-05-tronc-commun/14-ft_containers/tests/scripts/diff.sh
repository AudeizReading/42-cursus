#!/bin/bash

# diff.sh:	Displays diff between 2files (made for comparing std c++ lib and own implementation).
#			Redirects output inside a file
#
# $1:		first file to compare (namespace ft)
# $2:		second file to compare (namespace std)
# $3:		output file keeping the diffs between $1 and $2
#

#if [ -n ${1} ] && [ ${1} == "map" ]; then
	diff -a --suppress-common-lines ${1} ${2} > ${3}
#	diff -a --suppress-common-lines tests/ftmap.txt tests/stdmap.txt > tests/deepthought.map.diff.out
	exit 0
#fi
