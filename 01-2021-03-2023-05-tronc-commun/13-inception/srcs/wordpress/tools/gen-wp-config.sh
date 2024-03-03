#!/bin/bash

# generate a wp-config.php file for config wordpress
# copy it into /usr/local/bin/, like that you will ever call this script without
# ./ in front of the script's name
# ./gen-wp-config.sh path-to-future-wp-config.php

function set_define {
	echo -e "define('${1}', ${2});"
}

wp_config=${1}

if [ ! -f "${wp_config}" ]; then
	echo -e "<?php\n" >> $wp_config
	set_define "DB_NAME" "getenv('INCEPTION_DB', true)" >> $wp_config
	set_define "DB_USER" "getenv('INCEPTION_ADMIN', true)" >> $wp_config
	set_define "DB_PASSWORD" "getenv('INCEPTION_ADMIN_PW', true)" >> $wp_config
	set_define "DB_HOST" "getenv('INCEPTION_HOST', true)" >> $wp_config
	set_define "DB_CHARSET" "'utf8'" >> $wp_config
	set_define "DB_COLLATE" "''" >> $wp_config
	curl -sSL https://api.wordpress.org/secret-key/1.1/salt/ >> $wp_config
	echo -e "\$table_prefix = DB_NAME.'_';" >> $wp_config
	set_define "WP_DEBUG" "false" >> $wp_config
	echo -e "if (!defined('ABSPATH'))\n\tdefine('ABSPATH', dirname(__FILE__) . '/');" >> $wp_config
	echo -e "require_once(ABSPATH . 'wp-settings.php');" >> $wp_config
fi
