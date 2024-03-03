FROM alpine:3.17

RUN apk update

RUN apk add bash

# https://git.alpinelinux.org/aports/log/main/nodejs
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/bash -D node \
    && apk add nodejs==18.12.1-r0 npm==9.1.2-r0 \
    && echo "node : $(node --version) npm : $(npm --version)"

# Create app directory
WORKDIR /usr/src/app

COPY . ./pong/

RUN cd pong && npm install

EXPOSE 8190

ADD ./node-entrypoint.sh .
ENTRYPOINT ["./node-entrypoint.sh"]
CMD [ "npm", "run", "start:prod" ]
