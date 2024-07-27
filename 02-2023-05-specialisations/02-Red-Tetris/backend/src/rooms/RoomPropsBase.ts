import Player from '../players/Player';
import { RoomService } from './RoomService';
import { RoomPlayersBase } from './stores';
import { Timer } from './Timer';
import { Observable } from '../base/Observer';
import Room from './Room';
import { Server } from 'socket.io';

export class RoomPropsBase extends RoomPlayersBase {
	public destroySession: number;
	public disconnectSession: number;
	public countdown: number;
	public lock: boolean;
	public constructor(
		public name: string,
		protected service: RoomService,
		public leader: Player,
		public dateCreated: Date = new Date(),
		protected timer: Timer = new Timer(),
	) {
		super(name);
		this.leader.leads = this.name;

		this.destroySession = timer.destroySession;
		this.disconnectSession = timer.disconnectSession;
		this.countdown = timer.countdown;
		this.lock = timer.lock;
	}

	public get io(): Server {
		return this.service.server;
	}

	public update(eventId: string, observable: Observable): void {
		this.timer.update(eventId, observable);
	}

	public startCountdown(player: Player, room: Room): void {
		try {
			this.timer.startCountdown(player, room);
			this.toggleCountDownLock();
		} catch (e) {
			throw new Error((<Error>e).message);
		}
	}

	public resetCountdown(): void {
		this.timer.resetCountdown();
		this.toggleCountDownLock();
	}

	public toggleCountDownLock(): void {
		this.timer.lock = !this.timer.lock;
		this.lock = !this.lock;
	}

	public isLeader(player: Player): boolean {
		return this.leader === player;
	}

	public canStartGame(): boolean {
		return this.arePlayersReady;
	}
}
