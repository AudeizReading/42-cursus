#!/bin/bash
#
# $1: ip of the Darkly VM website
# ./get_the_darkly_flags.sh "ip"
#
# Tables trouvees: 
# Member_Brute_Force.db_default (id, username, password)
# Member_Sql_Injection.users (user_id, first_name, last_name, town, country, planet, Commentaire, countersign)
# Member_guestbook.guestbook (id_comment, comment, name)
# Member_images.list_images (id, url, title, comment)
# Member_survey.vote_dbs (id_vote, nb_vote, subject)
#
# Url trouvées
# http://192.168.1.16/index.php
# http://192.168.1.16/?page=survey
# http://192.168.1.16/?page=member
# http://192.168.1.16/?page=signin
# http://192.168.1.16/?page=recover
# http://192.168.1.16/?page=media&src=nsa
# http://192.168.1.16/?page=upload
# http://192.168.1.16/?page=searchimg
# http://192.168.1.16/?page=feedback
# http://192.168.1.16/index.php?page=redirect&site=facebook
# http://192.168.1.16/index.php?page=redirect&site=twitter
# http://192.168.1.16/index.php?page=redirect&site=instagram
# http://192.168.1.16/?page=b7e44c7a40c5f80139f0a50f3650fb2bd8d00b0d24667c4c2ca32c88e13b758f

function get_the_14_flags
{
	flags=`find . -name "flag" -exec cat \{\} \;`

	echo -e "All the 14 flags are:\n\033[32m${flags}\033[0m"
	return $?
}

let "opt=1"
menus=("01 - brute force" "02 - images list" "03 - members inj" "04 - cookies" "05 - htpasswd" "06 - .hidden" "07 - Diomédéidés footer" "08 - xss feedback" "09 - recover mail" "10 - include() redir" "11 - survey" "12 - upload" "13 - xss media" "14 /etc/passwd" "show flags" "all" "exit")

while [[ "${opt}" -ne 0 ]]
do
	printf "\n\033[36mChoose the test you want to perform:\033[0m\n"
	select item in "${menus[@]}"
	do
		case "${item}" in
			"01 - brute force")
				let "opt=1"
				./00-BRUTE-FORCE-WEAK-PASSWORDS-WSTG-ATHN-07/Resources/get-the-brute-force-flag.sh "${1}"
				break
				;;
			"02 - images list")
				let "opt=2"
				./01-IMAGES-LIST-INJECTION-SQL-WSTG-INPV-05/Resources/get-the-forty-two-flag.sh "${1}"
				break
				;;
			"03 - members inj")
				let "opt=3"
				./02-MEMBERS-INJECTION-SQL-WSTG-INPV-05/Resources/get-the-sgbd-image-table-flag.sh "${1}"
				break
				;;
			"04 - cookies")
				let "opt=4"
				./03-COOKIES-ATTRIBUTES-WTSG-SESS-02/Resources/get-the-cookie-flag.sh "${1}"
				break
				;;
			"05 - htpasswd")
				let "opt=5"
				./04-HTPASSWD-WSTG-CONF-04-AND-05/Resources/get-the-htpasswd-flag.sh "${1}"
				break
				;;
			"06 - .hidden")
				let "opt=6"
				./05-HIDDEN-DIRECTORY-WSTG-CONF-04/Resources/get-the-hidden-flag.sh "${1}"
				break
				;;
			"07 - Diomédéidés footer")
				let "opt=7"
				./06-FORGE-HTTP-REQUEST-REFERER-NSA-WSTG-BUSL-02/Resources/get-the-referer-nsa-flag.sh "${1}"
				break
				;;
			"08 - xss feedback")
				let "opt=8"
				./07-XSS-FEEDBACK-WSTG-INPV-02/Resources/get-the-xss-feedback-flag.sh "${1}"
				break
				;;
			"09 - recover mail")
				let "opt=9"
				./08-FORGE-HTTP-REQUEST-RECOVER-MAIL-WSTG-BUSL-02/Resources/get-the-recover-mail-flag.sh "${1}"
				break
				;;
			"10 - include() redir")
				let "opt=10"
				./09-FORGE-HTTP-REQUEST-REDIRECT-SITE-WSTG-BUSL-02/Resources/get-the-redirect-site-flag.sh "${1}"
				break
				;;
			"11 - survey")
				let "opt=11"
				./10-FORGE-HTTP-REQUEST-SURVEY-RANK-WSTG-BUSL-02/Resources/get-the-survey-flag.sh "${1}"
				break
				;;
			"12 - upload")
				let "opt=12"
				./11-UPLOAD-UNEXPECTED-FILE-WSTG-BUSL-08/Resources/get-the-upload-file-flag.sh "${1}"
				break
				;;
			"13 - xss media")
				let "opt=13"
				./12-XSS-MEDIA-BASE64-WSTG-INPV-02/Resources/get-the-xss-media-flag.sh "${1}"
				break
				;;
			"14 /etc/passwd")
				let "opt=14"
				./13-FILE-INCLUSION-WSTG-INPV-11/Resources/get-the-file-inclusion-flag.sh "${1}"
				break
				;;
			"show flags")
				let "opt=15"
				get_the_14_flags
				break
				;;
			"all")
				let "opt=16"
				./00-BRUTE-FORCE-WEAK-PASSWORDS-WSTG-ATHN-07/Resources/get-the-brute-force-flag.sh "${1}"
				# b3a6e43ddf8b4bbb4125e5e7d23040433827759d4de1c04ea63907479a80a6b2
				./01-IMAGES-LIST-INJECTION-SQL-WSTG-INPV-05/Resources/get-the-forty-two-flag.sh "${1}"
				# 3b4e8a30ecbfde518f50f2bda1912b40338ecd71821faeb1e9cdf44cefff95f5
				./02-MEMBERS-INJECTION-SQL-WSTG-INPV-05/Resources/get-the-sgbd-image-table-flag.sh "${1}"
				# fe0ca5dd7978ae1baae2c1c19d49fbfbb37fe7905b9ad386cbbb8206c8422de6
				./03-COOKIES-ATTRIBUTES-WTSG-SESS-02/Resources/get-the-cookie-flag.sh "${1}"
				# df2eb4ba34ed059a1e3e89ff4dfc13445f104a1a52295214def1c4fb1693a5c3
				./04-HTPASSWD-WSTG-CONF-04-AND-05/Resources/get-the-htpasswd-flag.sh "${1}"
				# d19b4823e0d5600ceed56d5e896ef328d7a2b9e7ac7e80f4fcdb9b10bcb3e7ff
				./05-HIDDEN-DIRECTORY-WSTG-CONF-04/Resources/get-the-hidden-flag.sh "${1}"
				# d5eec3ec36cf80dce44a896f961c1831a05526ec215693c8f2c39543497d4466
				./06-FORGE-HTTP-REQUEST-REFERER-NSA-WSTG-BUSL-02/Resources/get-the-referer-nsa-flag.sh "${1}"
				# f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188
				./07-XSS-FEEDBACK-WSTG-INPV-02/Resources/get-the-xss-feedback-flag.sh "${1}"
				# 0fbb54bbf7d099713ca4be297e1bc7da0173d8b3c21c1811b916a3a86652724e
				./08-FORGE-HTTP-REQUEST-RECOVER-MAIL-WSTG-BUSL-02/Resources/get-the-recover-mail-flag.sh "${1}"
				# 1d4855f7337c0c14b6f44946872c4eb33853f40b2d54393fbe94f49f1e19bbb0
				./09-FORGE-HTTP-REQUEST-REDIRECT-SITE-WSTG-BUSL-02/Resources/get-the-redirect-site-flag.sh "${1}"
				# b9e775a0291fed784a2d9680fcfad7edd6b8cdf87648da647aaf4bba288bcab3
				./10-FORGE-HTTP-REQUEST-SURVEY-RANK-WSTG-BUSL-02/Resources/get-the-survey-flag.sh "${1}"
				# 03a944b434d5baff05f46c4bede5792551a2595574bcafc9a6e25f67c382ccaa
				./11-UPLOAD-UNEXPECTED-FILE-WSTG-BUSL-08/Resources/get-the-upload-file-flag.sh "${1}"
				# 46910d9ce35b385885a9f7e2b336249d622f29b267a1771fbacf52133beddba8
				./12-XSS-MEDIA-BASE64-WSTG-INPV-02/Resources/get-the-xss-media-flag.sh "${1}"
				# 928d819fc19405ae09921a2b71227bd9aba106f9d2d37ac412e9e5a750f1506d
				./13-FILE-INCLUSION-WSTG-INPV-11/Resources/get-the-file-inclusion-flag.sh "${1}"
				# b12c4b2cb8094750ae121a676269aa9e2872d07c06e429d25a63196ec1c8c1d0
				get_the_14_flags
				break
				;;
			"exit")
				let "opt=0"
				break 2
				;;
		esac
	done
	printf "\n"
done
