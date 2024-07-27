import { Server } from 'socket.io';
import Room from './Room';
import Player from '../players/Player';
import { Change, IGameStartPayload, OAPM } from '../eventsIO/payloads/types/IPayload';
import { PayloadFactory } from '../eventsIO/payloads/PayloadFactory';
import { ServerService } from '../infra/io';

type PublishArgs = { room: Room; player: Player; event: keyof OAPM; reason?: Change };
export class RoomService extends ServerService {
	public constructor(
		protected io: Server,
		private name: string,
	) {
		super(io);
	}

	public get server(): Server {
		return this.io;
	}

	public isConnectedOnServer(): boolean {
		return !!this.isPublicRoom(this.name);
	}

	public isEmpty(): boolean {
		const room = this.getRoom(this.name);
		const roomSids = room && [...room.values()];

		return !!roomSids && roomSids.length === 0;
	}

	public hasPlayer(player: Player): boolean {
		const room = this.getRoom(this.name);
		const roomSids = room && [...room.values()];
		const playerRoom = this.getRoom(player.sessionID);
		const playerSids = playerRoom && [...playerRoom.values()];
		const isInRoom = playerSids && roomSids && playerSids.some((sid) => roomSids.includes(sid));
		return !!isInRoom;
	}

	// publie sur tout le serveur
	protected publish(args: PublishArgs): void {
		const { room, player, event, reason } = args;
		const payload = PayloadFactory.createBroadcastFormat(
			event,
			event === 'playerChange'
				? PayloadFactory.createPlayerPayload(player, reason)
				: PayloadFactory.createRoomPayload(room, player, reason),
		);
		this.broadcast(payload);
	}

	// publie seulement dans la room
	protected publishInternal<T extends keyof OAPM>(args: { event: T; data: OAPM[T] }): void {
		const { event, data } = args;
		const payload = PayloadFactory.createBroadcastFormat(event, data, '', this.name);
		this.broadcast(payload);
	}

	// open
	public create(room: Room, player: Player): void {
		try {
			this.createRoom(room.name);
			this.publish({ room, player, event: 'roomOpened' });
			// leader
			this.publish({ room, player, event: 'roomChange', reason: 'new leader' });
		} catch (e) {
			this.throwError((<Error>e).message);
		}
	}

	// join
	public join(room: Room, player: Player): void {
		try {
			this.changeRoom(player.sessionID, room.name, 'join');
			this.publish({ room, player, event: 'roomChange', reason: 'player incoming' });
		} catch (e) {
			this.throwError((<Error>e).message);
		}
	}

	// roomChange "new leader"
	// roomChange "new winner"
	public publishNewRole(role: 'leader' | 'winner', room: Room, player: Player): void {
		//informe tout le serveur du nouveau role attribué au player dans la room (leader ou winner)
		this.publish({ room, player, event: 'roomChange', reason: `new ${role}` });
	}

	// leave
	public leave(room: Room, player: Player): void {
		try {
			const datas: {
				room: Room;
				player: Player;
				event: keyof OAPM;
				reason?: Change;
			} = {
				room,
				player,
				event: 'playerChange',
				reason: 'left',
			};

			this.changeRoom(player.sessionID, room.name, 'leave');
			this.publish(datas);

			datas.event = 'roomChange';

			datas.reason = 'player outgoing';
			this.publish(datas);
		} catch (e) {
			if (this.io.engine.clientsCount !== 0) {
				this.throwError((<Error>e).message);
			}
		}
	}

	public handleRoomEmpty(room: Room): void {
		room.events.notifyObserver('roomEmpty', room);
	}

	public close(room: Room, player: Player): void {
		this.publish({ room, player, event: 'roomClosed' });
	}

	// ready timer
	// game start
	public timer(data: IGameStartPayload): void {
		try {
			this.publishInternal({ event: 'gameStart', data: data });
		} catch (e) {
			this.throwError((<Error>e).message);
		}
	}

	// error
	public error(message: string): void {
		const payload = PayloadFactory.createBroadcastFormat('error', message);
		this.broadcast(payload);
	}
}
