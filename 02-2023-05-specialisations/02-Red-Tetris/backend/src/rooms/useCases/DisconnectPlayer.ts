import Room from '../Room';
import { RoomEmptyEventListener } from '../events/emptyRoom';
import { RoomManagerCommand } from './Base';
import Player from '../../players/Player';

export class DisconnectPlayer<
	T extends {
		save: (name: string, room: Room) => void;
		log: () => void;
		get: (name: string) => Room | undefined;
		roomEmptyListener: RoomEmptyEventListener;
	},
> extends RoomManagerCommand<T> {
	public constructor(public manager: T) {
		super(manager);
	}

	public execute(player: Player): void {
		try {
			player?.roomsState?.forEach((state) => {
				const isPlayerDisconnected = state.status?.match(/left|disconnect/);
				const room = this.manager.get(state.name);
				if (!isPlayerDisconnected && room?.has(player.sessionID)) {
					player.connected = false;
					room.updatePlayer(player, 'disconnected');
					room.removePlayer(player);
				}
				this.manager.log();
			});
		} catch (e) {
			throw new Error(`${(<Error>e).message}`);
		}
	}
}
