#!/bin/bash
set -e

cd front

npm install

HOST=0.0.0.0

exec "$@"
