# wordpress Dockerfile
FROM	debian:buster

ARG		ADMIN_EMAIL
ARG		EDITOR_EMAIL
ARG     FQDN
ARG     INCEPTION_ADMIN
ARG     INCEPTION_ADMIN_PW
ARG     INCEPTION_DB
ARG     INCEPTION_EDITOR
ARG     INCEPTION_EDITOR_PW
ARG     INCEPTION_HOST
ARG		MAINTAINER

LABEL	maintainer $MAINTAINER

# php8 packages are not yet available by official Debian Mirrors, so it remains 2
# solutions : the first is to manually install php via downloading from the php
# website. The official docker php image does that. I do not know why, but
# when I try to install, the install take at least one hour, it is too much so
# let me talk about the second way : downloading packages via the deb.sury.org
# repository. It is the repository of the maintainer of the php packages (he
# explains this very well on his main website page. He is a debian dev.) 
# But we have to add manually this repository to our system
RUN		apt-get update -yq && apt-get upgrade -yq \
		&& apt-get install -yq \
			apt-transport-https \
			ca-certificates \
			curl \
			lsb-release \
		&& curl -sSLo /usr/share/keyrings/deb.sury.org-php.gpg \
		https://packages.sury.org/php/apt.gpg \
		&& sh -c 'echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list' \
		&& apt-get update -yq \
		&& apt-get install -yq \
			# best practice to range the packages by alphabetical order
			less \
			php8.1 \
			php8.1-bcmath \
			php8.1-bz \
			php8.1-cli \
			php8.1-cgi \
			php8.1-common \
			php8.1-curl \
			php8.1-fpm \
			php8.1-gd \
			php8.1-intl \
			php8.1-ldap \
			php8.1-mbstring \
			php8.1-mysql \
			php8.1-opcache \
			php8.1-pgsql \
			php8.1-readline \
			php8.1-snmp \
			php8.1-soap \
			php8.1-xml \
			php8.1-zip \
			php-json \
		&& mkdir -p /var/run/php

# Copy configs files
COPY	/conf/php.ini /etc/php/8.1/fpm/php.ini
COPY	/conf/www.conf /etc/php/8.1/fpm/pool.d/www.conf
COPY	/tools/docker-entrypoint.sh /usr/local/bin/
COPY	/tools/gen-wp-config.sh /usr/local/bin/

# Wordpress
WORKDIR	/var/www/$FQDN
RUN		curl -sSLo /var/www/$FQDN/latest-fr_FR.tar.gz \
		https://fr.wordpress.org/latest-fr_FR.tar.gz \
		&& tar -xvzf latest-fr_FR.tar.gz \
		&& rm -rf latest-fr_FR.tar.gz

# We need wp-cli for finishing the Wordpress install non-interactively
RUN		curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
		&& chmod +x wp-cli.phar \
		&& mv wp-cli.phar /usr/local/bin/wp

WORKDIR	/var/www/$FQDN/wordpress

RUN		gen-wp-config.sh wp-config.php \
		&& chmod 644 wp-config.php \
		&& chown www-data:www-data -R /var/www/$FQDN/wordpress

# Launching php daemon via docker-entrypoint.sh. Need this file because of the
# last install : need to reach mariadb database for pretty well installing, can
# only do that at runtime, not at built time, this is explain why. See the
# docker-entrypoint.sh for more infos
ENTRYPOINT ["docker-entrypoint.sh"]
CMD		["php-fpm8.1", "-F"]
