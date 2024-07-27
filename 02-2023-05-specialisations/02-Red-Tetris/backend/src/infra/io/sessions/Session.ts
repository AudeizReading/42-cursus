import { Socket } from 'socket.io';

import { logSession, logger } from '../../';
import { IPlayerJSON } from '../../../eventsIO/payloads/types/IPayload';
import { ClientInfosStore, SessionEventsManager } from '.';
import { TimeoutManager } from '../TimeoutManager';

export class Session {
	private _sid: string;
	public clientsStore = new ClientInfosStore();
	public events: SessionEventsManager = new SessionEventsManager();

	public constructor(sid: string, socket: Socket) {
		this._sid = sid;
		this.push(socket);
	}

	public push(socket: Socket): void {
		this.clientsStore.save(socket.id, {
			socket,
			disconnectTimer: null,
		});
	}

	public get sid(): string {
		return this._sid;
	}

	public disconnect(socket: Socket): void {
		const client = this.clientsStore.get(socket.id);
		if (client) {
			if (client.disconnectTimer) {
				clearTimeout(client.disconnectTimer);
			}
			const timeout = parseInt(process.env.DISCO_TIMER ?? '15', 10) * 1000;
			this.clientsStore.disconnect(socket);
			const disconnectTimer = setTimeout(() => {
				if (this.clientsStore.total === 0) {
					this.events.notifyObserver('sessionEmpty', this);
				}
				client.disconnectTimer = null;
			}, timeout);
			TimeoutManager.addTimeout(disconnectTimer);
			client.disconnectTimer = disconnectTimer;
		}
	}

	public isEmpty(): boolean {
		return this.clientsStore.total === 0;
	}

	public get sockets(): Socket[] {
		const session = this.clientsStore.all;
		const sockets: Socket[] = [];
		session.forEach((client) => {
			client.socket !== null && sockets.push(client.socket);
		});
		return sockets;
	}

	private totalDisconnected(): number {
		let cnt = 0;

		for (const socket of this.clientsStore.all) {
			!socket?.socket?.connected && ++cnt;
		}
		return cnt;
	}

	public toJSON(): {
		sid: string;
		player: IPlayerJSON;
		sockets: Socket[];
		nbClients: number;
		nbClientsConnected: number;
	} {
		return {
			sid: this.sid,
			player: this.sockets[0]?.data.player.toJSON(),
			sockets: this.sockets,
			nbClients: this.clientsStore.total,
			nbClientsConnected: this.clientsStore.total - this.totalDisconnected(),
		};
	}

	public log(context: string): void {
		const { raw, pretty } = logSession(this);
		logger.logContext(raw, context, pretty);
	}
}
