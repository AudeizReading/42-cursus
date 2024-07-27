import IStore from '../../base/IStore';
import { RoomState } from './RoomState';

export class RoomStateStore implements IStore<RoomState> {
	private rooms: Map<string, RoomState> = new Map();

	public get(id: string): RoomState | undefined {
		return this.rooms.get(id);
	}

	public save(id: string, room: RoomState): void {
		this.rooms.set(id, room);
	}

	public get all(): RoomState[] {
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
