#!/usr/bin/bash

docker build -t test42 .
docker run -it test42 /bin/bash
