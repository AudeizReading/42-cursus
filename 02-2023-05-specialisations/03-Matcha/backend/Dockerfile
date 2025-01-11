FROM node:lts-buster-slim AS base

ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /var/tmp

FROM base AS dev

CMD rm -rf node_modules && npm install && npm run dev

FROM base AS prod

RUN apt-get install sqlite3 -y

COPY . .
RUN npm install && npm run build
RUN npm run fixtures

CMD ["npm", "run", "prod"]
