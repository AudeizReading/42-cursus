import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { GameService } from './game.service';
import { NotifService } from '../notif/notif.service';
import { MatchMaking, Prisma } from '@prisma/client';

const MATCHMAKING_SECONDS = 25;

@Injectable()
export class GameMatchMaking {
  private readonly logger = new Logger(GameMatchMaking.name);

  constructor(
    private prisma: PrismaService,
    private gameService: GameService,
    private notifService: NotifService,
  ) {}

  @Interval(10000)
  async task_MatchMaking() {
    const waiting = await this.prisma.matchMaking.count({
      where: { state: 'WAITING' },
    });
    const waiting_even = Math.min(waiting - (waiting % 2), 10); // Max 5 games each 10 seconds
    if (waiting_even > 0) {
      this.logger.verbose('Processing MatchMaking!');

      // OK après TS, voici Prisma qui nous montre ses faiblesses :(
      // En SQL ça se fait en une seul requête mais je vais eviter de passer par du rawQuery

      for (let i = waiting_even / 2 - 1; i >= 0; i--) {
        const couple = await this.gameService.matchMakings({
          skip: i * 2,
          take: 2,
          orderBy: { createdAt: 'asc' },
          where: { state: 'WAITING' },
        });
        console.log('couple matched: ', couple[0].userId, couple[1].userId);
        await this.prisma.matchMaking.updateMany({
          data: {
            state: 'MATCHED',
          },
          where: {
            userId: { in: [couple[0].userId, couple[1].userId] },
          },
        });
      }
    }
    const where_didnotconfirm: Prisma.MatchMakingWhereInput = {
      state: 'MATCHED',
      updatedAt: { lte: new Date(+new Date() - MATCHMAKING_SECONDS * 1000) },
    };
    const didnotconfirm = await this.prisma.matchMaking.count({
      where: where_didnotconfirm,
    });
    if (didnotconfirm > 0) {
      this.logger.verbose('Cleaning MatchMaking!');
      for (let i = didnotconfirm - 1; i >= 0; i--) {
        const slot = await this.gameService.matchMakings({
          skip: i,
          take: 1,
          orderBy: { createdAt: 'asc' },
          where: where_didnotconfirm,
        });
        await this.notifService.createNotif(slot[0].userId, {
          text:
            "Vous n'avez pas confirmé à temps la partie trouvée !\n" +
            'Vous avez été quitté du MatchMaking !',
        });
        await this.prisma.matchMaking.delete({
          where: {
            userId: slot[0].userId,
          },
        });
      }
    }

    const where_confirmed: Prisma.MatchMakingWhereInput = {
      state: 'CONFIRMED',
      // updatedAt: { gte: new Date(+new Date() - MATCHMAKING_SECONDS * 1000 * 2) }
    };
    const confirmed = await this.prisma.matchMaking.count({
      where: where_confirmed,
    });
    const confirmed_even = Math.min(confirmed - (confirmed % 2), 10); // Max 5 games each 10 seconds
    if (confirmed_even > 0) {
      this.logger.verbose('Making game from MatchMaking!');
      for (let i = confirmed_even / 2 - 1; i >= 0; i--) {
        const couple = await this.gameService.matchMakings({
          skip: i * 2,
          take: 2,
          orderBy: { createdAt: 'asc' },
          where: where_confirmed,
        });
        console.log(
          'couple confirmed: ',
          couple[0].userId,
          couple[1].userId,
          'create a game.',
        );
        await this.gameService.createGame(couple[0].userId, couple[1].userId);
        await this.prisma.matchMaking.deleteMany({
          where: {
            userId: { in: [couple[0].userId, couple[1].userId] },
          },
        });
      }
    }

    const where_didnotfind: Prisma.MatchMakingWhereInput = {
      state: 'CONFIRMED',
      updatedAt: {
        lte: new Date(+new Date() - MATCHMAKING_SECONDS * 1000 * 2.2),
      },
    };
    const didnotfind = await this.prisma.matchMaking.count({
      where: where_didnotfind,
    });
    if (didnotfind > 0) {
      this.logger.verbose('Downgrade MatchMaking!');
      for (let i = didnotfind - 1; i >= 0; i--) {
        const slot = await this.gameService.matchMakings({
          skip: i,
          take: 1,
          orderBy: { createdAt: 'asc' },
          where: where_didnotfind,
        });
        await this.notifService.createMsg(slot[0].userId, {
          text: "Votre opposant n'a pas validé à temps la partie !",
          type: 'warning',
        });
        await this.prisma.matchMaking.update({
          data: {
            state: 'WAITING',
          },
          where: {
            userId: slot[0].userId,
          },
        });
      }
    }

    // LOG
    if (!waiting_even && !didnotconfirm && !confirmed_even && !didnotfind)
      return;

    console.table({
      before: {
        WAITING: waiting,
        DIDNT_CONFIRM: didnotconfirm,
        CONFIRMED: confirmed,
        DIDNT_FIND: didnotfind,
      },
      after: {
        WAITING: await this.prisma.matchMaking.count({
          where: { state: 'WAITING' },
        }),
        MATCHED: await this.prisma.matchMaking.count({
          where: { state: 'MATCHED' },
        }),
        CONFIRMED: await this.prisma.matchMaking.count({
          where: { state: 'CONFIRMED' },
        }),
      },
    });
  }
}
