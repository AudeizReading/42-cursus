import Player from './Player';
import { IEvent } from '../base/Observer';
import Room from '../rooms/Room';

export class PlayerReady implements IEvent {
	public date: Date;
	public player: Player;
	public roomId: string;
	public name: string;

	public constructor(player: Player, roomId: string) {
		this.date = new Date();
		this.player = player;
		this.roomId = roomId;
		this.name = this.constructor.name;
	}

	public add(room: Room): void {
		this.player.addObserver({ event: this, observer: room });
	}

	public delete(room: Room): void {
		// unset le player si il est ready (donc toggle compte a rebours si demarré)
		const status = this.player.status(this.roomId);
		if (status?.match(/ready/)) {
			this.player.changeRoomStatus('ready', this.roomId);
		}
		// supp event 'ready'
		this.player.deleteObserver({ event: this, observer: room });
	}
}
