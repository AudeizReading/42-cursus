# matcha-42-project

Because, love too can be industrialized.

![Framework](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Framework](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Framework](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Framework](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Framework](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Framework](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Framework](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Framework](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)
![Framework](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Framework](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Framework](https://img.shields.io/badge/-SCSS-eee?style=for-the-badge&logo=sass)
![Framework](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Framework](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

## Branch naming

### ✨ Feature ✨

- feat/\*
- feature/\*

### 🐛 Bug fix 🐛

- fix/\*
- hotfix/\*

### ♻️ Refactorisation du code ♻️

- facto/\*
- refactorisation/\*

## Subject

https://cdn.intra.42.fr/pdf/pdf/88600/en.subject.pdf

## Figma

https://www.figma.com/file/LK6hQoJ37o8zMB06MkgOtF/Matcha?type=design&t=wxLS4WTJGtwLh5L4-6

## Docker

```sh
docker compose up
```

## Prod mode

1. Copy `.env.example` to `.env` (at root level). Do not forget to setup your API keys credentials! Set up your hostname overthere.
2. Start production: `make prod`.

## Dev Mode

1. Copy `.env.example` to `.env` (at root level). Do not forget to setup your API keys credentials!
2. Update the variables

```sh
BACKEND_PROXY_URL="http://backend:3000"
MATCHA_HOSTNAME=localhost
FRONTEND_URL="https://${MATCHA_HOSTNAME}:${PUBLIC_PORT_FRONT}"
```

to

```sh
BACKEND_PROXY_URL="http://localhost:3000"
MATCHA_HOSTNAME=localhost
FRONTEND_URL="http://${MATCHA_HOSTNAME}:${PUBLIC_PORT_FRONT}"
```

3. Copy `./backend/.env.example` to `./backend/.env` and add your credentials into.
4. Add `./frontend/src/environments/environments.development.ts`

```ts
export const environment = {
  frontendUrl: "http://localhost:4200",
};
```

5. Add `./frontend/src/proxy.conf.mjs`

```ts
export default [
  {
    context: ["/socket.io/"],
    target: "ws://localhost:3000",
    ws: true,
    loglevel: "debug",
    secure: false,
  },
  {
    context: ["/api"],
    target: "http://localhost:3000",
    secure: false,
    loglevel: "debug",
  },
];
```

6. Start redis container:

```sh
make dev-redis
```

7. Generate fixtures:

```sh
# remove ./backend/data/matchha.sqlite if needed before
cd backend && npm run fixtures
```

8. Start backend:

```sh
cd backend && npm install && npm run build && npm run dev # ou npm run start si rien à faire dans le backend
```

9. Start frontend:

```sh
cd frontend && npm install && npm run start
```

## Frontend

Available at `http://localhost:4200`
or at `http://127.0.0.1` or `http://localhost` from the Docker conntainer

### How to make the first install

[notion - explications](https://audewheels.notion.site/How-to-start-an-Angular-frontend-application-b20b9c9fc91c45e88dbbb0e007bd5981)

### Format with prettier

```sh
npm run prettier
```

### Linter with eslint

```sh
npm run lint
```

### Dev Guidelines

#### Cera Pro Font

:warning: Download only the official font packages! ALL others are compromized, and charset is not complete.

You should find it [here](https://www.typemates.com/fonts/cera-pro/).

#### Sanitize Inputs

Angular does it itself by default, check [Angular's cross-site scripting security model](https://angular.dev/best-practices/security#angulars-cross-site-scripting-security-model)

#### Socket Connection

- [x] Inject SocketService into AppComponent -> The service will be initialized, the socket may be created if pre-conditions are fullfilled: need JWT token to be set
- [ ] Into each page component where you need to be connected, inject ProfileService -> The socket previously created will be connected only if the user's profile is complete

## Docs Backend

### Pre-requesites

- [ ] Install ffmpeg

#### MacOSX

```sh
brew install ffmpeg
```

### REST API (with Swagger)

`http://127.0.0.1:3000/api`

### Socket API (with AsyncAPI)

`http://127.0.0.1:3000/api/async`

### Configuration mail

Create password for nodemailer gmail: [Password app gmail](https://myaccount.google.com/u/2/apppasswords)

### Oauth

#### Google

- [Gestion de droits](https://console.cloud.google.com/iam-admin/iam?hl=fr&orgonly=true&project=matcha-42-project-424918&supportedpurview=organizationId)
- [Config and keys](https://console.cloud.google.com/apis/credentials/oauthclient/976349405266-bo3tmcckr5tukqikurvnv2fkaqtv1qa4.apps.googleusercontent.com?hl=fr&project=matcha-42-project-424918)
- [Add testeur](https://console.cloud.google.com/apis/credentials/consent?hl=fr&project=matcha-42-project-424918)

#### Facebook

- [Scope config](https://developers.facebook.com/apps/438437495474073/permissions/?use_case_enum=FB_LOGIN)
- [Config and keys](https://developers.facebook.com/apps/438437495474073/settings/basic/)
- [URI](https://developers.facebook.com/apps/438437495474073/use_cases/customize/settings/?use_case_enum=FB_LOGIN&product_route=fb-login)
- [USER remove access](https://www.facebook.com/settings/?tab=applications)

### Here

- [Admin Panel](https://platform.here.com/admin/apps/h8vE8i5n6tyoMQRsmeDv)
- [Usage](https://platform.here.com/management/usage)

### Sqlite

#### Access DB

```sh
cd backend
sqlite3 matcha.sqlite # The matcha.sqlite file must exist before accessing it
sqlite> .quit # for exiting sqlite3 CLI
```

#### Basic CRUD actions

##### Creat

```sql
INSERT INTO table (key1, key2, key3) VALUES (val1, val2, val3);
```

##### Read

```sql
SELECT * FROM table;
```

##### Update

```sql
UPDATE table SET key1=val1, key2=val2 WHERE condition;
```

##### Delete

```sql
DELETE FROM table WHERE condition;
```

#### Basic CRUD actions

Do not forget the semi-colon (;) at the end of your query! You may have some troubles otherwise.

Did you know that it still works if you pass lowercase command? :wink:
