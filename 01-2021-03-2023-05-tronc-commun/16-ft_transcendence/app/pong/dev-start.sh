#!/bin/bash
set -e

cd pong

npm install

(
	set -a
	source .env
	set +a
	until pg_isready --dbname=$PSQL_DATABASE --host=$PSQL_HOST --port=5432 --username=$PSQL_USER; do
		EC=$?
		if [ $EC -eq 127 ]; then
			echo "command pg_isready doesn't exist, try inside docker until."
			DOCKER_CONTAINER_NAME="psql"
			timeout 90s bash -c "until docker exec $DOCKER_CONTAINER_NAME pg_isready ; do sleep 5 ; done"
			break
		fi
		echo "PSQL is not ready (pg_iready: $EC), waiting 5 seconds."
		sleep 5
	done
)

npx prisma migrate deploy

npx prisma generate

exec "$@"
