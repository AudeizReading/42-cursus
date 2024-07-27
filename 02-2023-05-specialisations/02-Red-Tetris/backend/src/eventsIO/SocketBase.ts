import { Socket } from 'socket.io';
import Player from '../players/Player';
import { IAPM, IMIP, IMOP, IPlayerJSON, IRoomJSON, OAPM } from './payloads/types/IPayload';
import { PayloadFactory } from './payloads/PayloadFactory';
import { ISocketData, ServerService, logger } from '../infra';
import { logFormattedNStyled } from '../infra/logger/helper';
import { BasicDataStylers } from '../infra/logger/stringStyler/Styler';

export abstract class SocketBase {
	protected handlers: { [key: string]: IAPM[keyof IAPM] } = {} as IAPM;
	public constructor(
		protected socket: Socket,
		protected io: ServerService,
	) {}

	private on(e: keyof IAPM, cb: IAPM[keyof IAPM]): void {
		this.socket.on(e, cb);
	}

	public emit(e: keyof OAPM, p: OAPM[keyof OAPM]): void {
		const player: Player = this.socket.data.player;
		const sid = player.sessionID;
		switch (e) {
			case 'join': {
				this.broadcast(
					'playerChange',
					{
						reason: 'connecting player',
						player: player.toJSON(),
					},
					sid,
				);
				break;
			}
			case 'error': {
				p = `Player ${player.username} has encountered an error: ${p}`;
				break;
			}
			case 'roomInfo':
				logEmitRoomInfo(p as IRoomJSON);
				break;
		}

		const sessionRoom = this.socket.nsp.adapter.rooms.get(sid);
		if (sessionRoom) {
			if (sessionRoom.size === 1) {
				this.socket.emit(e, p);
			} else if (sessionRoom.size > 1) {
				// si plusieurs sockets sur la meme session il faut adresser l'event a tous
				this.io.emit(sid, e, p);
			}
		}
	}

	public broadcast<T extends keyof OAPM>(e: T, data: OAPM[T], sid?: string, room?: string): void {
		this.io.broadcast(PayloadFactory.createBroadcastFormat(e, data, sid, room));
	}

	public getSocket(): Socket {
		return this.socket;
	}

	public getSocketData(): ISocketData {
		return this.getSocket().data;
	}

	public forwardMessage(d: IMIP, e: IPlayerJSON, r: IPlayerJSON | undefined | IRoomJSON): void {
		const payload: IMOP = PayloadFactory.createIMOP(d.message, new Date(), e, r);
		this.io.forwardMessage(payload, d.receiver);
	}

	public listen(): void {
		for (const event in this.handlers) {
			this.on(event as keyof IAPM, this.handlers[event]);
		}
	}
}

function logEmitRoomInfo(p: IRoomJSON): void {
	let data;
	if (p) {
		const { name, dateCreated, leader, gameState, winner, players, totalPlayers, readys, totalReady, games } =
			p as IRoomJSON;

		data = {
			room: {
				name,
				dateCreated,
				leader: {
					username: leader.username,
					connected: leader.connected,
					sessionID: leader.sessionID,
					leads: [...leader.leads],
					wins: [...leader.wins],
					roomsState: [...leader.roomsState.values()],
				},
				gameState,
				winner: winner
					? {
							username: winner.username,
							connected: winner.connected,
							sessionID: winner.sessionID,
							leads: [...winner.leads],
							wins: [...winner.wins],
							roomsState: [...winner.roomsState.values()],
						}
					: {},
				players,
				totalPlayers,
				readys,
				totalReady,
				games,
			},
		};
	} else {
		data = null;
	}
	try {
		const { raw, pretty } = logFormattedNStyled(data, new BasicDataStylers().stylers);
		logger.logContext(raw, `emitting event [roomInfo]`, pretty);
	} catch (error) {
		logger.logContext((<Error>error).message, `error event [roomInfo]`, (<Error>error).message);
	}
}
