import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotifService, ActionRedirContent } from '../notif/notif.service';
import { User, Game, PlayerGame, MatchMaking, Prisma } from '@prisma/client';
import { InviteDTO } from 'src/invite/invite.controller';

// For frontend. Represents a game that has already ended.
export interface GameInterface {
  id: number;
  winnerId: number;
  winnedAt: Date;
  scores: number[];
  players: {
    id: number;
    name: string;
    avatar: string;
  }[];
}

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotifService))
    private notifService: NotifService,
  ) {}

  async scoreForFront(/*take: number, pagination: number*/): Promise<
    GameInterface[]
  > {
    const scores: GameInterface[] = [];
    const data = await this.prisma.game.findMany({
      /*skip: take * pagination,
      take: take,*/
      orderBy: {
        winnedAt: 'desc',
      },
      where: {
        state: 'ENDED',
      },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });
    data.forEach((item) => {
      const players = item.players;
      const parsePlayer = (num) => ({
        id: players[num].user.id,
        name: players[num].user.name,
        avatar: players[num].user.avatar.replace(
          '://<<host>>',
          '://' + process.env.FRONT_HOST,
        ),
      });
      scores.push({
        id: item.id,
        winnerId: item.winnerId,
        winnedAt: item.winnedAt,
        scores: [item.scoreA, item.scoreB],
        players: [parsePlayer(0), parsePlayer(1)],
      });
    });
    return scores;
  }

  async game(
    gameWhereUniqueInput: Prisma.GameWhereUniqueInput,
  ): Promise<Game & { players: (PlayerGame & { user: User; })[]; }> {
    return this.prisma.game.findUnique({
      where: gameWhereUniqueInput,
      include: {
        players: {
          include: {
            user: true
          },
        },
      },
    });
  }

  async updateGame(params: {
    where: Prisma.GameWhereUniqueInput;
    data: Prisma.GameUpdateInput;
  }): Promise<Game & { players: (PlayerGame & { user: User; })[]; }> {
    const { where, data } = params;
    return this.prisma.game.update({
      data,
      where,
      include: {
        players: {
          include: {
            user: true
          },
        },
      },
    });
  }

  async createGame(
    userId1: number,
    userId2: number,
    gameOptions?: InviteDTO,
  ): Promise<{ game: Game; players: PlayerGame[] }> {
    const game = await this.prisma.game.create({
      data: {
        option: gameOptions ? JSON.stringify(gameOptions.settings) : "{}",
      },
    });
    const players = [];
    players.push(
      await this.prisma.playerGame.create({
        data: {
          gameId: game.id,
          userId: userId1,
        },
      }),
    );
    players.push(
      await this.prisma.playerGame.create({
        data: {
          gameId: game.id,
          userId: userId2,
        },
      }),
    );
    const action: ActionRedirContent = {
      type: 'redir',
      url: '/game/',
    };
    await this.notifService.createAction(userId1, action);
    await this.notifService.createAction(userId2, action);
    return {
      game,
      players,
    };
  }

  async listTenMatchMakings(): Promise<any> {
    const rawAvatars = await this.matchMakings({
      take: 10,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
    const avatars = [];
    rawAvatars.map((item) => {
      avatars.push({
        name: item.user.name,
        avatar: item.user.avatar.replace(
          '://<<host>>',
          '://' + process.env.FRONT_HOST,
        ),
      });
    });
    return {
      count: await this.matchMakingCount(),
      avatars: avatars,
    };
  }

  async matchMakings(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MatchMakingWhereUniqueInput;
    where?: Prisma.MatchMakingWhereInput;
    orderBy?: Prisma.MatchMakingOrderByWithRelationInput;
    select?: Prisma.MatchMakingSelect; // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    include?: Prisma.MatchMakingInclude; // https://www.prisma.io/docs/concepts/components/prisma-client/select-fields#include-relations-and-select-relation-fields
  }): Promise<any> {
    // hack: any… because select
    const { skip, take, cursor, where, orderBy, select, include } = params;
    const opt: any = {};
    if (include) opt.include = include;
    else opt.select = select;
    return this.prisma.matchMaking.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      ...opt,
    });
  }

  async updateMatchMaking(params: {
    where: Prisma.MatchMakingWhereUniqueInput;
    data: Prisma.MatchMakingUpdateInput;
  }): Promise<MatchMaking> {
    const { where, data } = params;
    return this.prisma.matchMaking.update({
      data,
      where,
    });
  }

  async matchMakingCount(): Promise<number> {
    return this.prisma.matchMaking.count();
  }

  async createMatchMaking(
    data: Prisma.MatchMakingCreateInput,
  ): Promise<MatchMaking> {
    return this.prisma.matchMaking.create({
      data,
    });
  }

  async deleteMatchMaking(
    where: Prisma.MatchMakingWhereUniqueInput,
  ): Promise<MatchMaking> {
    return this.prisma.matchMaking.delete({
      where,
    });
  }
}
