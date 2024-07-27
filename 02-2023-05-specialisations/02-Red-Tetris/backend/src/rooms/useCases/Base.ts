import { RoomEmptyEventListener } from '../events/emptyRoom';
import Player from '../../players/Player';
import Room from '../Room';
import { RoomService } from '../RoomService';
import { GameService } from 'games/GameService';

export abstract class RoomCommand {
	public constructor(
		protected room: Room,
		protected service: RoomService | GameService,
	) {}
	public abstract execute(player: Player): void;
}

export abstract class RoomManagerCommand<
	T extends {
		save: (name: string, room: Room) => void;
		log: () => void;
		get: (name: string) => Room | undefined;
		roomEmptyListener: RoomEmptyEventListener;
	},
> {
	public constructor(protected manager: T) {}
	public abstract execute(player: Player, name?: string): void;
}
