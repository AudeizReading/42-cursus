import { UseGuards, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { Socket, Server } from 'socket.io';
import { fromAuthHeaderOAsBearerToken } from '../auth/jwt.strategy';
import { GameService } from './game.service';
import { User, Game, PlayerGame } from '@prisma/client';
import { DataGame, DataElement, DataUser, Point, pl_intersect,
         Plane, pl_time_to_vector, check_segment_collision, v_norm } from './dep/minirt_functions'
import { UsersService } from '../users/users.service';
import { GameSettingsInterface } from '../invite/invite.controller';
import { NotifService } from 'src/notif/notif.service';

interface Client {
  userId: number;
  gameId: number;
  socketId: string;
};

interface pingpongData {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
};

type SocketUserAuth = Socket & {
  user: User;
};

type PlayerGameInclude = PlayerGame & {
  game: Game;
  user: User;
};

type GameInclude = Game & {
  players: PlayerGameInclude[];
};

// https://docs.nestjs.com/websockets/gateways
// https://codesandbox.io/s/xingyibiaochatserver-6x1jc?file=/src/main.ts

interface PlayGame {
  pGame: Game;
  data: DataGame;
  timeout: ReturnType<typeof setTimeout>;
  users: number[];
  settings: GameSettingsInterface;
  pause: boolean;
}

function getPlayerPosition(player: DataElement): number {
  if (player.at !== null && player.dir !== 0) {
    const time = (+new Date() - +player.at) / 1000;
    const speed = player.speed * (player.dir as number);
    const delta = speed * time;
    return Math.min(300 - player.size, Math.max(0, (player.pos as number) + delta));
  } else {
    return player.pos as number;
  }
}

@Injectable()
@WebSocketGateway(8192, {
  namespace: 'game',
  cors: {
    origin: '*',
    maxAge: 600,
  },
})
export class GameSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private gameService: GameService,
    private usersService: UsersService,
    private notifsService: NotifService,
  ) {}

  @WebSocketServer()
  private server: Server;

  private clients: Map<string, Client> = new Map();

  private games: Map<number, PlayGame> = new Map();

  private async getUserWithToken(socket: Socket) {
    const token = fromAuthHeaderOAsBearerToken(socket);
    return await (async () => {
      try {
        return this.jwtStrategy.validate(
          await this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET,
          }),
        );
      } catch (e) {
        if (e.name !== 'JsonWebTokenError') console.error(e); // show other error
        return null;
      }
    })();
  }

  // To call when game has ended
  private async gameJustEnded(game: PlayGame, winnerId: number, loserID: number)
  {
    // NOTE: This is... not efficient, but no matter.
    await this.usersService.addAchivement({OR: [{id: winnerId}, {id: loserID}]},
        {primary: "Il faut une première fois à tout", secondary: "Jouez une fois à pong"});
    await this.usersService.addAchivement({id: winnerId},
        {primary: "Point faible : trop fort", secondary: "Gagnez une partie de pong"});
    
    const [pointsA, pointsB] = game.data.points;
    if (pointsA == 0 || pointsB == 0) {
      await this.usersService.addAchivement({id: winnerId},
        {primary: "lmao gg ez", secondary: "Écrasez votre adversaire à pong"});
    }
  }

  sendGameData(socket: Socket, game: PlayGame) {
    socket.to(`game-${game.pGame.id}`).emit('dataGame', game.data);
    socket.emit('dataGame', game.data);
  }

  refreshBall(socket: Socket, game: PlayGame, pos: Point, angle: number, deltaTime?: number, speed?: number) {
    game.data.ball.speed = (speed) ? speed : game.settings.ballSpeed;
    game.data.ball.pos = pos;
    game.data.ball.dir = { x: Math.cos(angle), y: Math.sin(angle) };
    game.data.ball.at = +new Date() + (deltaTime || 0);

    this.planeCollisionChecking(socket, game);
    this.sendGameData(socket, game);
  }

  saveScore(game: PlayGame, winner?: number) {
    let data: any = {
      scoreA: game.data.points[0],
      scoreB: game.data.points[1]
    }
    if (winner) {
      data.winnerId = winner
      data.winnedAt = new Date()
      data.state = 'ENDED'
    }
    this.gameService.updateGame({
      data: data,
      where: {
        id: game.pGame.id
      }
    }).then((pGame) => {
      game.pGame = pGame;
    });
  }

  checkGameEnd(socket: Socket, game: PlayGame): boolean {
    if (game.pGame.state === 'ENDED') {
      game.data.ended = true;
      clearTimeout(game.timeout);
      this.refreshBall(socket, game, { x: 0, y: 0 }, 0, 30000);
      return true
    }
    const points = game.data.points
    if (points[0] < 0 || points[1] < 0 || (
      (points[0] >= game.settings.pointsToWin || points[1] >= game.settings.pointsToWin)
      && game.settings.pointsGap <= Math.abs(points[0] - points[1])))
    {
      game.data.ended = true;
      clearTimeout(game.timeout);
      const winnerID = (points[0] < points[1]) ? game.data.users[1].id : game.data.users[0].id;
      const loserID = (points[0] < points[1]) ? game.data.users[0].id : game.data.users[1].id;
      this.saveScore(game, (points[0] < points[1]) ? game.data.users[1].id : game.data.users[0].id)
      this.refreshBall(socket, game, game.data.ball.pos as Point, 0, 8000);
      this.gameJustEnded(game, winnerID, loserID);
      return true
    }
    return false
  }

  getStarterAngle(i: number | boolean): number {
    return Math.PI / 180 * (Math.random() * 120 - 60 - ((i) ? 180 : 0));
  }

  goalWillMaybeHappened(socket: Socket, game: PlayGame, time: number, i: number) {
    if (game.pause)
      return ;
    game.pause = true;
    const plane: Plane = this.getPlanes(game)[i];
    const a: Point = game.data.ball.pos as Point;
    const dir: Point = v_norm(game.data.ball.dir as Point);
    const speed: number = game.data.ball.speed;
    const b: Point = { x: a.x + speed * dir.x, y: a.y + speed * dir.y }

    const point: Point = pl_time_to_vector(a, b, time);
    if (point && !(0 <= point.y && point.y <= 300)) {
      point.y = Math.abs(point.y);
      const pair: number = Math.floor(point.y / 300) % 2;
      point.y = point.y % 300;
      if (pair) 
        point.y = 300 - point.y;
    }
    if (check_segment_collision(plane, point)) {
      const size: number = (plane.size || 0);
      let dist: number = (point.y - plane.pos.y + 3) / (size + 6) * 160; // 3 et 6 == rayon/diametre de la balle
      if (Math.sign(plane.n.x) < 0)
        dist = (160 - dist) - 180;
      this.refreshBall(socket, game, point, Math.PI / 180 * (dist - 80), 0, speed + 20);
      game.pause = false;
    }
    else {
      const angle: number = this.getStarterAngle(i);

      game.data.points[+!i]++;
      this.saveScore(game);

      // Calc time distance between player and goal (x: 20 -> 0 || x: 380 -> 400)
      const a: Point = point;
      const b: Point = { x: a.x + speed * dir.x, y: a.y + speed * dir.y };
      plane.pos.x = (i) ? 400 : 0;
      const time: number = pl_intersect(a, b, plane);
      const real_ms = Math.min(2.4, time) * 1000;

      clearTimeout(game.timeout);
      game.timeout = setTimeout(() => {
        if (!this.checkGameEnd(socket, game))
          this.refreshBall(socket, game, { x: 200, y: 150 }, angle, 3000);
        game.pause = false;
      }, real_ms);
    }
  }

  getPlanes(game: PlayGame): Plane[] {
    return [{
      n: { x: 1, y: 0 },
      pos: { x: 20, y: getPlayerPosition(game.data.players[0]) as number },
      size: game.data.players[0].size
    }, {
      n: { x: -1, y: 0 },
      pos: { x: 400 - 20, y: getPlayerPosition(game.data.players[1]) as number },
      size: game.data.players[1].size
    }];
  }

  planeCollisionChecking(socket: Socket, game: PlayGame) {
    if (game.data.ball.at === null || game.data.ended)
      return ;
    const planes: Plane[] = this.getPlanes(game);
    const a: Point = game.data.ball.pos as Point;
    const dir: Point = v_norm(game.data.ball.dir as Point);
    const speed: number = game.data.ball.speed;
    const b: Point = { x: a.x + speed * dir.x, y: a.y + speed * dir.y }
    let time: number = -1;

    // CHECK WHICH SIDE IS THE GOAL
    for (let i: number = 0; i < planes.length; i++) {
      if ((time = pl_intersect(a, b, planes[i])) > -1) {
        const ms: number = game.data.ball.at + time * 1000 - +new Date();
        if (time > 10) { // We prefere recalcul very long/infinite move
          console.log('recalcul.');
          const angle: number = this.getStarterAngle(!i);
          this.refreshBall(socket, game, game.data.ball.pos as Point, angle,
            Math.min(0, game.data.ball.at - +new Date()), speed);
          break;
        }
        if (ms <= 0) {
          console.log('is now!', game.pause);
          if (!game.pause) {
            clearTimeout(game.timeout);
            this.goalWillMaybeHappened(socket, game, time, i);
          }
          break;
        }
        clearTimeout(game.timeout);
        game.timeout = setTimeout(() =>
          this.goalWillMaybeHappened(socket, game, time, i), ms);
        break ;
      } else if (time < 0 && i + 1 === planes.length) {
        console.log('impossible!'); // = restart, should not happened with the first recalcul
        const angle: number = this.getStarterAngle(i);
        this.refreshBall(socket, game, { x: 200, y: 150 }, angle, 3000);
      }
    }
  }

  // @UseGuards(JwtAuthGuard) <== Not supported for handleConnection
  async handleConnection(socket: Socket) {
    const user = await this.getUserWithToken(socket);
    if (!user) {
      // && demo) ??? ---> pouvoir laisser voir la demo aux hors-lignes
      socket.disconnect();
      return { success: false, gameid: -1 };
    }
    const iterator1 = this.clients[Symbol.iterator]();

    for (const item of iterator1) {
      if (item[1].userId === user.id) {
        console.log('double connexion!');
        socket.disconnect();
        return { success: false, gameid: -1 };
      }
    }
    console.log(user.name, 'has join.');

    const client: Client = {
      userId: user.id,
      gameId: 0,
      socketId: socket.id,
    };
    this.clients.set(client.socketId, client);

    /*console.log('👇️ total:', this.clients.size);
    this.clients.forEach((client, id) => {
      console.log(id, client);
    });*/

    let logicState = '';
    let pGame: Game & { players: (PlayerGame & { user: User; })[]; } | null = null; // Prisma

    // STEP 1: Try to connect
    if (socket.handshake?.query?.gameid == 'mygame' && user.playingAt) {
      pGame = user.playingAt.game as GameInclude;
      client.gameId = pGame.id;
      console.log('Est-ce que la game peut commencer ?');
      if (pGame.state === 'WAITING') {
        const oppId = (() => {
          const players = pGame.players.filter(
            (a) => a.userId !== user.id,
          );
          if (players[0]) return players[0].userId;
          else return -1;
        })();
        const users = [...this.clients].filter(
          ([key, val]) => val.userId === oppId,
        );
        if (users.length <= 0) {
          console.log('Il vous manque encore un opposant !', oppId);
        } else {
          console.log('oui');
          pGame = await this.gameService.updateGame({
            data: {
              state: 'PLAYING',
            },
            where: {
              id: client.gameId,
            },
          });
          logicState = 'STARTING';
        }
      } else {
        console.log('Elle a déjà commencé, tu es en retard !');
        logicState = 'PLAYING';
      }
    } else if (!isNaN(parseInt(socket.handshake?.query?.gameid as string))) {
      pGame = await this.gameService.game({
        id: parseInt(socket.handshake?.query?.gameid as string)
      });
      if (pGame) {
        client.gameId = pGame.id;
        logicState = pGame.state;
      }
    }

    if (!pGame || client.gameId < 0) {
      socket.emit('not-found');
      socket.disconnect();
      return ;
    }

    let game: PlayGame = this.games.get(client.gameId);
    if (game) {
      game.users.push(user.id);
    } else {
      const angle = this.getStarterAngle(Date.now() % 2);
      const gameOpt = (() => {
        try {
          return JSON.parse(pGame.option);
        } catch (e) {
          console.error(e);
          return {}
        }
      })();
      const settings: GameSettingsInterface = {
        pointsToWin: ('pointsToWin' in gameOpt) ? gameOpt.pointsToWin : 11,
        pointsGap: ('pointsGap' in gameOpt) ? gameOpt.pointsGap : 2,
        ballSpeed: ('ballSpeed' in gameOpt) ? 80 + gameOpt.ballSpeed * 2 : 130,
        racketSize: ('racketSize' in gameOpt) ? gameOpt.racketSize : 40,
      };
      game = {
        pGame: pGame,
        data: {
          users: pGame.players.map((player): DataUser => ({
            id: player.user.id,
            name: player.user.name,
            avatar: user.avatar.replace(
              '://<<host>>',
              '://' + process.env.FRONT_HOST,
            ),
          })) as DataUser[],
          points: [pGame.scoreA, pGame.scoreB],
          players: [
            { dir: 0, pos: 140, speed: 250, size: settings.racketSize, at: null },
            { dir: 0, pos: 140, speed: 250, size: settings.racketSize, at: null },
          ],
          ball: {
            dir: {
              x: Math.cos(angle),
              y: Math.sin(angle)
            }, pos: { x: 200, y: 150 }, speed: settings.ballSpeed, size: 6, at: null
          },
          ended: false
        },
        users: [user.id],
        timeout: 0 as any,
        settings: settings,
        pause: false,
      };
      this.games.set(client.gameId, game);
    }

    if (logicState === 'STARTING' || logicState === 'PLAYING') {
      if (game.data.ball.at === null) {
        console.log('ball go!')
        game.data.ball.at = +new Date() + 10000;
      }
    }

    this.planeCollisionChecking(socket, game);

    socket.join(`game-${client.gameId}`);
    this.sendGameData(socket, game);
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(@ConnectedSocket() socket: SocketUserAuth) {
    const user = await this.getUserWithToken(socket);
    if (!this.clients.get(socket.id)) return;
    this.clients.delete(socket.id);
    if (user) {
      this.games.forEach((game, gameId) => {
        game.users.forEach((userId) => {
          if (userId === user.id) {
            console.log('disconnected of game ', gameId);
            game.users = game.users.filter((a) => a != userId);
            this.games.set(gameId, game);
          }
        });
      });
      console.log(user.name + ' has left.');
    }
  }

  getClient(socket: Socket): Client | null  {
    const client = this.clients.get(socket.id);
    if (!client || !client.gameId)
      return null;
    return client;
  }

  getGame(client: Client): PlayGame | null  {
    if (!client)
      return null;
    const game = this.games.get(client.gameId);
    if (!game || game.users.indexOf(client.userId) === -1)
      return null;
    return game;
  }

  getPlayerId(client: Client, game: PlayGame): number | null  {
    if (!game)
      return null;

    const pGame = game.pGame as Game & { players: PlayerGame[] };
    const playerId: number = +(client.userId === pGame.players[1].userId);

    if (pGame.players[playerId].userId !== client.userId) {
      console.log('tricheur?');
      return null;
    }
    return playerId;
  }

  //@UseGuards(JwtAuthGuard) <=== Rajoute bcp trop de latence!
  @SubscribeMessage('data')
  data(
    @ConnectedSocket() socket: SocketUserAuth,
  ) {
    const client = this.getClient(socket)
    const game = this.getGame(client);

    if (game)
      return game.data;
  }

  //@UseGuards(JwtAuthGuard) <=== Rajoute bcp trop de latence!
  @SubscribeMessage('move')
  move(
    @MessageBody() data: DataElement,
    @ConnectedSocket() socket: SocketUserAuth,
  ) {
    const diff: number = +new Date() - data.at;
    const client = this.getClient(socket)
    const game = this.getGame(client);
    const playerId = this.getPlayerId(client, game);
    if (playerId === null || game.data.ended)
      return null;

    this.planeCollisionChecking(socket, game);

    // ANTICHEAT & CHECK DATA
    const player = getPlayerPosition(game.data.players[playerId]);
    const delta = Math.abs(getPlayerPosition(data) - getPlayerPosition(game.data.players[playerId]))
    if (delta > 5) {
      console.log('tricheur?', delta);
    }
    game.data.players[playerId].dir = data.dir;
    game.data.players[playerId].pos = (delta < 5) ? getPlayerPosition(data) : getPlayerPosition(game.data.players[playerId]);
    game.data.players[playerId].at = +new Date();

    this.sendGameData(socket, game);

    return diff
  }

  @SubscribeMessage('giveup')
  giveup(
    @MessageBody() data: DataElement,
    @ConnectedSocket() socket: SocketUserAuth,
  ) {
    const client = this.getClient(socket)
    const game = this.getGame(client);
    const playerId = this.getPlayerId(client, game);
    if (playerId === null || game.data.ended)
      return null;

    game.data.points[playerId] *= -1;
    console.log('giveup', playerId, game.data.points[playerId])
    this.checkGameEnd(socket, game);
  }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('ping')
  ping(
    @MessageBody() data: pingpongData,
    //@ConnectedSocket() socket: SocketUserAuth,
  ) {
    data.second = +new Date();
    return data;
  }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('pong')
  pong(
    @MessageBody() data: pingpongData,
    //@ConnectedSocket() socket: SocketUserAuth,
  ) {
    data.fourth = +new Date();
    return data;
  }
}
