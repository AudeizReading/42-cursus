#!/bin/bash

sqlite3 ./data/matcha.sqlite < ./fixtures/fixtures.sql
cat ./fixtures/archive-part-* > ./fixtures/archive.tar
tar -xvf ./fixtures/archive.tar -C ./fixtures/
mkdir -p ./uploadFile && mv ./fixtures/data/* ./uploadFile && rm -rf ./fixtures/data/ ./fixtures/archive.tar
