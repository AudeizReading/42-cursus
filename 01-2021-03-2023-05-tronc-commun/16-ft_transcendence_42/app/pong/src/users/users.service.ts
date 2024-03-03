import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, PlayerGame, Game, MatchMaking, Image, Prisma } from '@prisma/client';
import { GameInterface } from 'src/game/game.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User & {
    games: (PlayerGame & {
      game: Game & {
        players: (PlayerGame & {
          user: User;
        })[];
      };
    })[];
    mMaking: MatchMaking;
  } | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        mMaking: true,
        games: {
          include: {
            game: {
              include: {
                players: {
                  include: {
                    user: true,
                  }
                },
              },
            },
          },
          orderBy: {
            gameId: 'desc',
          },
          where: {
            game: {
              NOT: {
                state: 'ENDED',
              },
            },
          },
        },
      },
    });
  }

  async getScore(userId: number): Promise<{
    wins: number;
    losses: number;
  }> {
    const wins = await this.prisma.game.count({
      where: {
        winnerId: userId,
      },
    });
    const total = await this.prisma.playerGame.count({
      where: {
        userId,
        game: {
          state: 'ENDED',
        },
      },
    });
    return {
      wins: wins,
      losses: total - wins,
    };
  }

  async getPlayedGames(userID: number)
  {
    // Get all games user has played, and include the "players" table
    const games = await this.prisma.game.findMany({
      where: {
        state: "ENDED",
      },
      include: {
        players: {
          include: {
            user: true
          }
        }
      }
    });

    let parsed: GameInterface[] = [];
    for (const game of games) { // Apparently this is faster than chaining array methods
      if (game.players[0].userId === +userID || game.players[1].userId === +userID)
      {
        parsed.unshift({ // Put element at begin and not end to save time in sorting
          id: game.id,
          winnerId: game.winnerId,
          winnedAt: game.winnedAt,
          scores: [game.scoreA, game.scoreB],
          players: [
            {
              id: game.players[0].user.id,
              name: game.players[0].user.name,
              avatar: game.players[0].user.avatar.replace('://<<host>>', `://${process.env.FRONT_HOST}`)
            },
            {
              id: game.players[1].user.id,
              name: game.players[1].user.name,
              avatar: game.players[1].user.avatar.replace('://<<host>>', `://${process.env.FRONT_HOST}`)
            },
          ]
        });
      }
    }
    // Still need to sort to have most recent first (id won't sort them completely, it
    // correlates to start time, not end time)
    return parsed.sort((a, b) => (b.winnedAt?.getTime() - a.winnedAt?.getTime()));
  }

  async getUserStatusFromID(userID: number): Promise<"offline" | "online" | "playing">
  {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userID
      }
    });
    return this.getUserStatus(user);
  }

  async getUserStatus(user: User): Promise<"offline" | "online" | "playing">
  {
    if (!user.sessionid || Date.now() - user.lastFetch.getTime() > 10_000) {
      return "offline";
    }
    const isPlaying = !!await this.prisma.playerGame.count({
      where: {
        userId: user.id,
        NOT: {
          game: {
            state: "ENDED"
          }
        }
      }
    });
    return (isPlaying ? "playing" : "online");
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  // TODO: move???
  async uploadImageInPsql(data: Prisma.ImageCreateInput): Promise<Image> {
    return this.prisma.image.upsert({
      where: { name: data.name },
      update: data,
      create: data,
    });
  }

  async image(
    imageWhereUniqueInput: Prisma.ImageWhereUniqueInput,
  ): Promise<Image | null> {
    return this.prisma.image.findUnique({
      where: imageWhereUniqueInput,
    });
  }

  async getBestPlayers(limit: number)
  {
    const getScore = (wins: number, games: number) => {
      const losses = games - wins;
      const winLoseRatio = (wins / (losses || 1));
      return (winLoseRatio * games) || 0;
    }

    const userList = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        wins: {
          select: {
            id: true,
          }
        },
        games: {
          select: {
            gameId: true,
          }
        }
      }
    });

    return userList.sort( (a, b) => {
      const scoreA = getScore(a.wins.length, a.games.length);
      const scoreB = getScore(b.wins.length, b.games.length);
      if (scoreA > scoreB)
        return -1;
      if (scoreA < scoreB)
        return 1;
      if (a.id < b.id)
      return -1;
      if (a.id > b.id)
        return 1;
      return 0;
    })
    .slice(0, limit)
    .map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar.replace('://<<host>>', '://' + process.env.FRONT_HOST),
      wins: user.wins.length,
      losses: user.games.length - user.wins.length,
    }));
  }

  async addAchivement(usersWhere: Prisma.UserWhereInput, achievementData: { primary: string, secondary?: string })
  {
    const serialized = JSON.stringify(achievementData);
    return this.prisma.user.updateMany({
      where: {
        AND: [
          {...usersWhere},
          {
            NOT: {
              achievements: {
                has: serialized,
              }
            }
          }
        ]
      },

      data: {
        achievements: {
          push: serialized,
        }
      }
    });
  }
}
