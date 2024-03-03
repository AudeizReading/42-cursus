FROM alpine:3.17

RUN apk update

RUN apk add bash
RUN apk add nginx

# Create app directory
WORKDIR /usr/src/app
COPY ./build/ ./front/

ADD ./nginx/default.conf /etc/nginx/http.d/

EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
