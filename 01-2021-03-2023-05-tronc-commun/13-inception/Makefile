################################################################################
#                                                                              #
#              Variables Makefile                                              #
#                                                                              #
################################################################################
NAME=				inception
SRCS=				srcs/
ENV_FILE=			.env
ENTRYPOINT_TIER=	inception_entrypoint-tier
VOLUMES=			${HOME}/data/
VOL_CONT_FRONT=		/var/www/
VOL_CONT_BACK=		/var/lib/mysql/
VOL_HOTE_FRONT=		${VOLUMES}front-vol/
VOL_HOTE_BACK=		${VOLUMES}back-vol/
NGINX=				./${SRCS}nginx/
MARIADB=			./${SRCS}mariadb/
WP=					./${SRCS}wordpress/

################################################################################
#                                                                              #
#              Cmds SHELL                                                      #
#                                                                              #
################################################################################

MAKE=				make -s -i --no-print-directory
RM=					rm -rf
ECHO=				printf

################################################################################
#                                                                              #
#              Cmds DOCKER                                                     #
#                                                                              #
################################################################################

BUILD=				docker image build -t ${SERVICE} ./${SERVICE}/
RMI=				docker image rm ${SERVICE}
RUN=				docker container run -p ${PORT_HOTE}:${PORT_CONTAINER} -v ${VOL_HOTE}:${VOL_CONT} --name=${SERVICE} -itd ${SERVICE}
START=				docker container start ${SERVICE} 
STOP=				docker container stop ${SERVICE} 
RMC=				docker container rm ${SERVICE}
EXEC_DEBUG=			docker exec -it ${SERVICE} /bin/bash
LOGS=				docker logs ${SERVICE}

UP=					docker-compose up -d
DOWN=				docker-compose down
PS=					docker-compose ps -a
COMPOSE_BUILD=		docker-compose --verbose build ${SERVICE}
COMPOSE_RUN=		docker-compose run -p ${PORT_HOTE}:${PORT_CONTAINER} --name=${SERVICE} -d ${SERVICE}
COMPOSE_START=		docker-compose start ${SERVICE}
COMPOSE_STOP=		docker-compose stop ${SERVICE}
COMPOSE_RMC=		docker-compose rm -v ${SERVICE}
# Warning: docker-compose exec does not seem to work ! do not know why...,
# better results by using the docker exec cmd directly ${EXEC_DEBUG}
COMPOSE_EXEC=		docker-compose exec -it ${SERVICE} /bin/bash

CLEAN_NETWORK=		docker network rm ${NETWORK}
CLEAN_VOL_FRONT=	docker volume rm front-vol
CLEAN_VOL_BACK=		docker volume rm back-vol
LS_CONT=			docker container ls -a
LS_IMG=				docker image ls -a
LS_VOL=				docker volume ls
LS_NET=				docker network ls
PRUNE=				docker system prune -a --volumes

################################################################################
#                                                                              #
#              rules Makefile                                                  #
#                                                                              #
################################################################################


.PHONY: ${NAME} fclean check clean re deluser-vol

${NAME}: up

up: timestamp
	@${ECHO} "checking if user's volumes exist...\r"
	@if [ ! -f ${VOLUMES}front-vol ]; then mkdir -m 777 -p ${VOLUMES}front-vol; fi
	@if [ ! -f ${VOLUMES}back-vol ]; then mkdir -m 777 -p ${VOLUMES}back-vol; fi
	@${ECHO} "starting containers with docker-compose...\r"
	@cd ${SRCS} && ${UP}
	@touch $@

timestamp:
	@touch $@

check:
	${LS_IMG}
	${LS_NET}
	${LS_VOL}
	${LS_CONT}
	cd ${SRCS} && ${PS}

################################################################################
nginx-exec:
	@make exec-intrm SERVICE=nginx

wordpress-exec:
	@make exec-intrm SERVICE=wordpress

mariadb-exec:
	@make exec-intrm SERVICE=mariadb

exec-intrm:
	@${ECHO} "executing S{SERVICE} container...\r"
	@cd ${SRCS} && ${EXEC_DEBUG}

################################################################################
nginx-log:
	@make log-intrm SERVICE=nginx

wordpress-log:
	@make log-intrm SERVICE=wordpress

mariadb-log:
	@make log-intrm SERVICE=mariadb

log-intrm:
	@${ECHO} "logging S{SERVICE} container...\r"
	@${LOGS}

################################################################################
wp-consult-posts:
	@make defense-intrm SERVICE=wordpress COMMANDS="wp post list --allow-root"

wp-consult-users:
	@make defense-intrm SERVICE=wordpress COMMANDS="wp user list --allow-root"

wp-consult-comments:
	@make defense-intrm SERVICE=wordpress COMMANDS="wp comment list --allow-root"

wp-create-comment-1:
	@make defense-intrm SERVICE=wordpress COMMANDS="wp comment create --comment_post_ID=1 --comment_content=\"Un joyeux commentaire de defense de projet\" --comment_author=\"qui-tu-veux\" --comment_author_email=\"qui-tu-veux@mais-vraiment.fr\" --allow-root"

wp-create-comment-7:
	@make defense-intrm SERVICE=wordpress COMMANDS="wp comment create --comment_post_ID=7 --comment_content=\"Un joyeux commentaire de defense devant correspondre au post de titre Wilkommen\" --comment_author=\"qui-tu-veux\" --comment_author_email=\"qui-tu-veux@mais-vraiment.fr\" --allow-root"

wp-create-post:
	@make defense-intrm SERVICE=wordpress COMMANDS="wp --allow-root post create --post_content=\"Bienvenue sur Inception: Le Website.\" --post_title=\"Wilkommen\" --comment_status=open --tags_input=\"inception\" --post_status=publish"

mariadb-show-databases-root-nopass:
	@make defense-intrm SERVICE=mariadb COMMANDS="/bin/bash -c \"echo \\\"SHOW DATABASES;\\\" | mysql -u inception_webmaster \""

mariadb-show-databases-root:
	@make defense-intrm SERVICE=mariadb COMMANDS="/bin/bash -c \"echo \\\"SHOW DATABASES;\\\" | mysql -u inception_webmaster -p\""

mariadb-show-databases:
	@make defense-intrm SERVICE=mariadb COMMANDS="/bin/bash -c \"echo \\\"SHOW DATABASES;\\\" | mysql -u alellouc -p\""

mariadb-consult-users:
	@make defense-intrm SERVICE=mariadb COMMANDS="/bin/bash -c \"echo \\\"SELECT * FROM inception.inception_users;\\\" | mysql -u alellouc -p\""

mariadb-consult-posts:
	@make defense-intrm SERVICE=mariadb COMMANDS="/bin/bash -c \"echo \\\"SELECT post_content FROM inception.inception_posts;\\\" | mysql -u alellouc -p\""

mariadb-consult-comments:
	@make defense-intrm SERVICE=mariadb COMMANDS="/bin/bash -c \"echo \\\"SELECT comment_content FROM inception.inception_comments;\\\" | mysql -u alellouc -p\""

defense-intrm:
	docker exec -it ${SERVICE} ${COMMANDS}

lynx:
	@if [ -x /usr/bin/lynx ] || [ `which lynx 2>&1 > /dev/null` -eq 0 ]; then \
		curl -v https://alellouc.42.fr; \
		lynx https://alellouc.42.fr; \
	else \
		echo "browser lynx is not installed."; \
	fi

check-http:
	lynx http://alellouc.42.fr
	curl -v http://alellouc.42.fr

################################################################################
clean:
	@${ECHO} "stopping containers with docker-compose...\r"
	@cd ${SRCS} && ${DOWN}
	@${RM} up timestamp

fclean: clean
	@${ECHO} "cleaning docker volumes...\r"
	@${CLEAN_VOL_FRONT}
	@${CLEAN_VOL_BACK}
	@${ECHO} "cleaning docker images...\r"
	@docker image rm nginx
	@docker image rm wordpress
	@docker image rm mariadb
	@docker image rm debian:buster

prune:
	@${PRUNE}

re: fclean up

deluser-vol:
	@${ECHO} "deleting user volumes...\r"
	@if [ $(shell id -un) = "root" ] && [ -d /home/alellouc/data ];\
		then ${RM} /home/alellouc/data;\
	elif [ -d ${VOLUMES} ]; \
		then ${RM} ${VOLUMES};\
	fi

purge: fclean prune
	sudo make deluser-vol
