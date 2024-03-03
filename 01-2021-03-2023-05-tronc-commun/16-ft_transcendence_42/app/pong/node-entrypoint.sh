#!/bin/bash
set -e

cd pong

npx prisma migrate deploy

npx prisma generate

exec "$@"
