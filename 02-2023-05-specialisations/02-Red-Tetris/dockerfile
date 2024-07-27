FROM node:18-bookworm-slim

WORKDIR /tmp
COPY . /tmp

RUN apt-get update && apt-get install -y \
    vim \
    curl \
&& npx playwright install  \
&& npx playwright install-deps \
&& cd backend && npm install \
&& cd ../frontend && cp .env.example .env && npm install

CMD ["/bin/bash"]
