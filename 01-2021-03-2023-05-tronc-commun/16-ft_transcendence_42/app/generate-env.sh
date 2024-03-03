#!/bin/bash

cd "$(dirname "$0")"

function urlencode() {
	echo $(python3 -c "import sys, urllib.parse as up; print(up.quote_plus('$1'))")
}

if [ -f "pong/.env" ]; then
  echo ".env already exist"
else
  echo "create pong/.env"
  PSQL_PWD="$(openssl rand -base64 32)"
  cat << EOF > pong/.env
#API
API_42_UID="$(printf "1) Write your uid api: " 1>&2;read api;echo $api)"
API_42_SECRET="$(printf "2) Write your secret api: " 1>&2;read api;echo $api)"

#FRONT
FRONT_HOST="$(printf "3) Write your host: " 1>&2;read host;echo $host)"

#NESTJS
JWT_SECRET="$(openssl rand -base64 32)"

#USER
N_USER=user
N_PASS="$(openssl rand -base64 12)"

#PSQL         TODO: For prod (in Docker) change 'localhost' by 'psql'
PSQL_HOST=psql
PSQL_DATABASE=pong
PSQL_USER=pong
PSQL_PASSWORD="$PSQL_PWD"
PSQL_URL="postgresql://pong:$(urlencode "$PSQL_PWD")@psql:5432/pong"
EOF
fi
