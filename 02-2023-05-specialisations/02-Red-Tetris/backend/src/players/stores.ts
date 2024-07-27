import IStore from '../base/IStore';
import Player from './Player';

export class PlayerStore implements IStore<Player> {
	private players: Map<string, Player> = new Map();

	public get(id: string): Player | undefined {
		return this.players.get(id);
	}

	public save(id: string, player: Player): void {
		this.players.set(id, player);
	}

	public get all(): Player[] {
		return [...this.players.values()];
	}

	public delete(id: string): void {
		this.players.delete(id);
	}

	public has(id: string): boolean {
		return this.players.has(id);
	}

	public get total(): number {
		return this.players.size;
	}
}
