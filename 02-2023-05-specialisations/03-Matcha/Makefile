all:
	@echo error

dev:
	@docker-compose up --build

dev-redis:
	@docker-compose up redis --build -d

dev-backend:
	@docker-compose up backend --build

frontend: 
	@docker-compose up frontend --build
	   
prod: 
	@docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build

stop:
	@docker compose -f docker-compose.yml -f docker-compose.prod.yml stop

down:
	@docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v

volume-ls:
	@docker volume ls

redis:
	@open $(shell docker volume inspect redis-data | jq -r '.[0].Mountpoint')

sql:
	@open $(shell docker volume inspect sql-data | jq -r '.[0].Mountpoint')

file:
	@open $(shell docker volume inspect file-data | jq -r '.[0].Mountpoint')

rm-frontend:
	docker image rm matcha/frontend
	
prune:
	@docker buildx prune
