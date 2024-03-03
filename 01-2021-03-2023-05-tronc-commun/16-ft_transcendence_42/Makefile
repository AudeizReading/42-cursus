NAME=ft_transcendence

ENV_PATH=./app/pong/.env

DIST_FRONT=./app/front/build/

DIST_BACK=./app/pong/dist/

all: $(NAME)

re: fclean
	make all

$(NAME): 
	make build
	make up

build: setup_env build_front build_back
	make clean_back # To be sure to not COPY node_module in docker image
	docker-compose -f app/docker-compose.yml --env-file=app/pong/.env build

up: setup_env
	docker-compose -f app/docker-compose.yml --env-file=app/pong/.env up

$(DIST_FRONT):
	cd app/front; npm install; npm run build

$(DIST_BACK):
	cd app/pong; npm install; npm run build

$(ENV_PATH):
	./app/generate-env.sh

# dev only
run_psql: setup_env
	docker-compose -f app/dev-psql.yml --env-file=app/pong/.env up --build

# dev only
run_front: setup_env
	cd app; ./front/dev-start.sh "npm" "start"

# dev only
run_back: setup_env
	cd app; ./pong/dev-start.sh "npm" "run" "start:dev"

mode_cmd_front:
	docker exec -it front /bin/bash

mode_cmd_pong:
	docker exec -it pong /bin/bash

setup_env: $(ENV_PATH)

build_front: $(DIST_FRONT)

build_back: $(DIST_BACK)

build_dist: build_front build_back

#TODO: Make clean delete docker-compose stuff correctly and also make clean delete db storage, maybe use a real docker volume instead of bind mount??
clean: clean_front clean_back

clean_front:
	rm -rf ./app/front/node_modules

clean_back:
	rm -rf ./app/pong/node_modules

fclean_front:
	rm -rf $(DIST_FRONT)

fclean_back:
	rm -rf $(DIST_BACK)

fclean_dist: fclean_front fclean_back

fclean: fclean_dist clean
	rm -rf $(ENV_PATH)

# clean_docker:
#   docker kill $(docker ps -q); docker rm -vf $(docker ps -aq); docker rmi -f $(docker images -aq)

.PHONY: all re $(NAME) build up setup_env mode_back_front mode_cmd_pong build_front build_back build_dist clean fclean fclean_front fclean_back clean_front clean_back fclean_dist #clean_docker
