# Red-tetris-42-project

[![Test](https://github.com/louchebem06/red-tetris-42-project/actions/workflows/main.yaml/badge.svg?branch=main)](https://github.com/louchebem06/red-tetris-42-project/actions/workflows/main.yaml)

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

## Frontend

![Framework](https://img.shields.io/badge/svelteKit-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)

### Commandes

#### Developpement and build

- `npm run install`
- `npm run dev`
- `npm run build`

#### Format, Linter and Syntax

- `npm run format`
- `npm run lint`
- `npm run check`

#### Test

- `npm run test`

## BackEnd Documentation

### Stack

![Static Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Static Badge](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Static Badge](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express&logoColor=white)
![Static Badge](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Static Badge](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

- [Node.js](https://nodejs.org/fr)
- [TypeScript](https://www.typescriptlang.org/) strict
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/fr/)
- [Jest](https://jestjs.io/)

In a new terminal instance, do:

```js
cd backend
```

### Production environment

Install and run the server:

```js
npm install
npm run start
```

### Development environment

Install and run the server with `nodemon` watching:

```js
npm install
npm run dev
```

#### Format & Lint

##### Run prettier

```js
npm run format
```

##### Run eslint

```js
npm run lint
```

or

```js
npm run lint:fix
```

##### Run both

```js
npm run indent
```

#### Transpiler

##### Run babel

```js
npm run build
```

#### Units Tests with jest

##### Run and watch changes

```js
npm run testDev
```

##### Run tests

```js
npm run test
```

##### Get Coverage

```js
npm run check
```

ou

```js
npm run test:open
```

#### Indent + Build + Test

```js
npm run ibt
```

### .env file

The mandatory environment variables needed to be set are (prod mode):

```sh
HOST=localhost
PORT=8080
PROTOCOL=ws
DESTROY_TIMER=15
DISCO_TIMER=15
START_GAME_TIMER=10
```

_The timers variables are set in seconds. Then, into codebase, it will be converted into milliseconds._

#### DEV

If the `DEV` variable is set to `1` the server will run in development mode.
The timers are decreased to:

- 10s for DESTROY_TIMER
- 10s for DISCO_TIMER
- 10s for START_GAME_TIMER
  The .env file is automatically created.

#### UNITSTESTS

If the `UNITSTESTS` variable is set to `1` the server will run in unit tests mode
The timers are decreased to:

- 1s for DESTROY_TIMER
- 1s for DISCO_TIMER
- 5s for START_GAME_TIMER
  The .env file is automatically created.

### PROD

If the `DEV` and the `UNITSTESTS` variables are unset, we are in production mode.
The timers are decreased to:

- 15s for DESTROY_TIMER
- 15s for DISCO_TIMER
- 10s for START_GAME_TIMER
  The .env file should be handled by the provider.

#### Application

```sh
cp .env.example .env
docker-compose up
```

or

```sh
make start
```
