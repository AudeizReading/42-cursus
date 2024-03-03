README
======



# project42_transcendence

Group project to be done between 3 and 5 students, we were 4.

Developpement of a website, entirely mounted in Typescript, allowing to play the famous Pong game.

*I was in charge of the front-end part of the Home page, which welcomes any visitor to the website.*

![Home preview](./preview_home.png)


## Installation:

 - Prerequis version node: v16.17.0
 - timeout command `brew install coreutils`

### Back

#### Apply Migration of psql

Prepare Postgres (Docker with psql should be running, eg `make`).

```
# It is now automatic with `make run_back`
cd app/pong
npm install
npx prisma migrate deploy
```

If you want to read about: [How to make a migration?](https://docs.nestjs.com/recipes/prisma#create-two-database-tables-with-prisma-migrate)

## Usage

### How to run project for dev ?

Open 3 terminal session:
 - `make run_psql` to run docker and database ;
 - `make run_front` to run front (React) ;
 - `make run_back` to run back (Nestjs).

 ### How to run project for prod ?
Only one session has to be opened, type into a terminal session:
- `make`

 All should be installed by itself after that.

 Maybe, on MacOSX, `Docker` get troubes with the containers: do not hesitate to stop the install (double `ctrl-C`), and do not hesitate to delete these containers into the **Docker's Desktop**, it would be rebuilt at the next run (`make`). 

 It is also possible that the Docker commands used are specific to MacOSX. Take it in consideration, if you run it on another OS, the Dockerfile might not work with these commands. You just have to adapt to the instructions supported by your OS.

 At the **first using**, you need to have a **42's account** able to connect to the **42's API**. You have to create a pair of public / private keys, by the intranet at `https://profile.intra.42.fr/oauth/applications`. A redirect URI is asked, set it at `http://127.0.0.1:8190/auth/callback`. Be warn that a pair of keys is only available for a month. You have to regenerate it every month. It is done for preventing private API's keys leaks.

 A script will be launched for setting the .env file. At this occasion, your 42's api's keys will be asked (public and private part -> ***NEVER PUSH THEM EVERYWHERE*** !!! *Sad to still have to remind this to you*).

 Then, your IP is asked. At this time, `127.0.0.1` works fine, you can safely indicate it. But if this one has to be deployed, of course this is the application's IP that should be inserted instead of the loopback's one.

### How to create and login a fake account ?

Open a url to: `http://127.0.0.1:8190/auth/fake/<login>`

## Docs :

 - **Material-ui docs:** https://mui.com/material-ui/getting-started/usage/
 - **Nestjs docs:** https://docs.nestjs.com/
 - **Prisma docs:** https://www.prisma.io/docs/
