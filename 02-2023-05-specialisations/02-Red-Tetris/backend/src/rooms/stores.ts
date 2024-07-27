import IStore from '../base/IStore';
import { PlayerStore } from '../players/stores';
import Player from '../players/Player';
import Room from './Room';
import { IPlayerJSON } from '../eventsIO/payloads/types/IPayload';

export class RoomStore implements IStore<Room> {
	private rooms: Map<string, Room> = new Map();

	public get(id: string): Room | undefined {
		return this.rooms.get(id);
	}

	public save(id: string, room: Room): void {
		this.rooms.set(id, room);
	}

	public get all(): Room[] {
		return [...this.rooms.values()];
	}

	public delete(id: string): void {
		this.rooms.delete(id);
	}

	public has(id: string): boolean {
		return this.rooms.has(id);
	}

	public get total(): number {
		return this.rooms.size;
	}
}

export class RoomPlayersBase extends PlayerStore {
	public constructor(public name: string) {
		super();
	}

	public get empty(): boolean {
		return this.total === 0;
	}

	public get readys(): Player[] {
		return this.all.filter((player) => {
			return player.status(this.name)?.includes('ready');
		});
	}

	public get totalReady(): number {
		return this.readys.length;
	}

	public get readyJSON(): IPlayerJSON[] {
		return [...this.readys.map((p: Player) => p.toJSON() as IPlayerJSON)];
	}

	public canJoin(player: Player): boolean {
		return !this.has(player.sessionID);
	}

	public get arePlayersReady(): boolean {
		return !this.empty && this.totalReady === this.total;
	}
}
