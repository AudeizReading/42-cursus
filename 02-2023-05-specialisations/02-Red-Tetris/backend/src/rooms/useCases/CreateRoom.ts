import Room from '../Room';
import { RoomEmptyEventListener } from '../events/emptyRoom';
import { RoomManagerCommand } from './Base';
import { Server } from 'socket.io';
import Player from '../../players/Player';
import { RoomService } from '../RoomService';

export class CreateRoom<
	T extends {
		save: (name: string, room: Room) => void;
		log: () => void;
		get: (name: string) => Room | undefined;
		has: (name: string) => boolean;
		roomEmptyListener: RoomEmptyEventListener;
	},
> extends RoomManagerCommand<T> {
	public constructor(
		public manager: T,
		public io: Server,
	) {
		super(manager);
	}
	public execute(player: Player, name: string): void {
		try {
			if (!this.manager.has(name)) {
				const room = new Room(name, player, new RoomService(this.io, name));
				room.events.addObserver('roomEmpty', this.manager.roomEmptyListener);
				this.manager.save(name, room);
			}
			this.manager.log();
		} catch (e) {
			throw new Error(`${(<Error>e).message}`);
		}
	}
}
