#!/bin/bash

# set -e = exit from this script at the first exec error encountered
set -e

# if first arg of this script is equal to php-fpm8.1 so
if [ "$1" = 'php-fpm8.1' ]; then
	# finishing wp installation (corresponding to the step 2 of install by
	# browser)
	wp core install --skip-email --allow-root --url=https://$FQDN --title=$INCEPTION_DB --admin_user=$INCEPTION_ADMIN --admin_password=$INCEPTION_ADMIN_PW --admin_email=$ADMIN_EMAIL
set +e
	wp user get ${INCEPTION_EDITOR} --allow-root
	if [ $? -ne 0 ]; then
		# create one user as asked
		wp user create $INCEPTION_EDITOR $EDITOR_EMAIL --allow-root --url=https://$FQDN --role=editor --user_pass=$INCEPTION_EDITOR_PW
		# install and activate pluging for restricting usernames
		# can not config it in cli but it does not matter as we can do it the
		# admin panel via browser
		wp plugin install restrict-usernames --allow-root
		wp plugin activate restrict-usernames --allow-root
	fi
set -e
	exec "$@"
fi
