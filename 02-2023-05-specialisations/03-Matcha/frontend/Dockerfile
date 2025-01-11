FROM node:20-bookworm as build

ARG BACKEND_PROXY_URL
ARG FRONTEND_URL
ARG PUBLIC_PORT_FRONT
ARG MATCHA_HOSTNAME

ENV BACKEND_PROXY_URL=${BACKEND_PROXY_URL}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV PUBLIC_PORT_FRONT=${PUBLIC_PORT_FRONT}
ENV MATCHA_HOSTNAME=${MATCHA_HOSTNAME}

WORKDIR /tmp
ADD ./package.json ./package.json
RUN mkdir -p /usr/local/app

COPY . /usr/local/app/
RUN npm install && cp -a /tmp/node_modules /usr/local/app/
WORKDIR /usr/local/app

RUN ./setup_ssl_with_mkcert.sh && ./setup_prod_config.sh && npm run build:prod && rm -rf /tmp

CMD ["npm", "run", "start:prod"]
