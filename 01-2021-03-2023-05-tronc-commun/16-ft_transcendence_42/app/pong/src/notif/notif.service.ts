import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InviteService } from '../invite/invite.service';
import { Notif, Prisma } from '@prisma/client';

interface MsgContent {
  text: string;
  type?: 'info' | 'warning';
}

interface NotifContent {
  text: string;
  url?: string | null;
  // When type is defined, the notif menu can use it to
  // display a special interface for the notification.
  // For example, GAMEINVITE displays accept/refuse buttons.
  type?: 'GAMEINVITE';
}

export interface ActionRedirContent {
  url: string;
  type: 'redir';
}

export interface NotifDataType {
  id: number,
  text: string;
  date: Date;
  url?: string | null;
  read: boolean;
  type: string;
}

export interface NotifContainerType {
  num: number;
  arr: Array<NotifDataType>;
}

@Injectable()
export class NotifService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => InviteService))
    private inviteService: InviteService,
  ) {}

  async createAction(
    userId: number,
    content: ActionRedirContent,
  ): Promise<Notif> {
    return this.prisma.notif.create({
      data: {
        userId,
        content: JSON.stringify(content),
        read: false,
        type: 'ACTION',
      },
    });
  }

  async createMsg(userId: number, content: MsgContent): Promise<Notif> {
    return this.prisma.notif.create({
      data: {
        userId,
        content: JSON.stringify(content),
        read: false,
        type: 'MSG',
      },
    });
  }

  async createNotif(userId: number, content: NotifContent): Promise<Notif> {
    return this.prisma.notif.create({
      data: {
        userId,
        content: JSON.stringify(content),
        read: false,
        type: 'NOTIF',
      },
    });
  }

  async readsNotif(userId: number, date: Date): Promise<{ count: number }> {
    return this.prisma.notif.updateMany({
      data: {
        read: true,
      },
      where: {
        userId,
        type: 'NOTIF',
        createdAt: { lte: date },
      },
    });
  }

  async notif(
    notifWhereUniqueInput: Prisma.NotifWhereUniqueInput,
  ): Promise<Notif | null> {
    return this.prisma.notif.findUnique({
      where: notifWhereUniqueInput,
    });
  }

  async notifs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.NotifWhereUniqueInput;
    where?: Prisma.NotifWhereInput;
    orderBy?: Prisma.NotifOrderByWithRelationInput;
  }): Promise<Notif[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.notif.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async deleteNotifs(
    where: Prisma.NotifWhereInput,
  ): Promise<{ count: number }> {
    return this.prisma.notif.deleteMany({
      where,
    });
  }

  async deleteExpiredInviteNotifs()
  {
    const notifs = await this.prisma.notif.findMany({
      where: {
        type: 'NOTIF'
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      }
    });

    const deleteIDs = notifs.map( notif =>
        ({
          id: notif.id,
          createdAt: notif.createdAt,
          content: JSON.parse(notif.content) as NotifContent,
        })
      ).filter( parsedNotif => (parsedNotif.content.type === "GAMEINVITE"
          && Date.now() - parsedNotif.createdAt.getTime() > 1000 * 60 * 2)
      ).map(tgt => tgt.id);

    return this.prisma.notif.deleteMany({
      where: {
        id: {
          in: deleteIDs
        }
      }
    });
  }

  async objectForFront(userId: number): Promise<{
    notifs: NotifContainerType;
    msgs: NotifContainerType;
    actions: NotifContainerType;
  }>
  {
    // Deletes expired invites and their notifs in the DB.
    // Since this is called periodically by the frontend, it ensures they correctly expire.
    // No need for await, an invite might expire between two refreshes.
    this.deleteExpiredInviteNotifs();
    this.inviteService.deleteAllExpired();

    const notifs: NotifDataType[] = [];
    const msgs: NotifDataType[] = [];
    const actions: NotifDataType[] = [];
    const data = await this.notifs({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    data.forEach((item) => {
      const content: MsgContent | NotifContent | ActionRedirContent =
        JSON.parse(item.content);
      const container = (() => {
        switch (item.type) {
          case 'NOTIF':
            return notifs;
          case 'MSG':
            return msgs;
          case 'ACTION':
            return actions;
        }
      })();
      container.push({
        id: item.id,
        text: content['text'] || null,
        date: item.createdAt,
        url: content['url'] || null,
        read: item.read,
        type: content['type'] || null,
      });
    });
    return {
      notifs: {
        num: notifs.length,
        arr: notifs,
      },
      msgs: {
        num: msgs.length,
        arr: msgs,
      },
      actions: {
        num: actions.length,
        arr: actions,
      },
    };
  }
}
