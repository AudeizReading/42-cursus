# mariadb Dockerfile
FROM	debian:buster

ARG     INCEPTION_ADMIN
ARG     INCEPTION_ADMIN_PW
ARG     INCEPTION_DB
ARG     INCEPTION_EDITOR
ARG     INCEPTION_EDITOR_PW
ARG		MAINTAINER

LABEL	maintainer $MAINTAINER

RUN		apt-get update -yq && apt-get install -yq perl curl; \ 
		curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | bash; \
		apt-get update -yq && apt-get install -yq \
			libmariadb3 \
			mariadb-common \
			mariadb-server 
COPY	/conf/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf
COPY	/tools/docker-entrypoint.sh /usr/local/bin/

# very important step, without that it cannot connect mysql socket, we need to
# create the dirs /run/mysqld and /var/lib/mysql
RUN		mkdir -p /run/mysqld \
		&& chown -R mysql:mysql /run/mysqld/ \
		&& rm -rf /var/lib/mysql \
		&& mkdir -p /var/lib/mysql \
		&& chown -R mysql:mysql /var/lib/mysql

ENTRYPOINT ["docker-entrypoint.sh"]
CMD		["mysqld"]
