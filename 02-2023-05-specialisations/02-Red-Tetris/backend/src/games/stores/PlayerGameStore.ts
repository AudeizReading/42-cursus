import IStore from '../../base/IStore';
import { PlayerGame } from '../GameLogic';

export class PlayerGameStore implements IStore<PlayerGame> {
	public store: Map<string, PlayerGame> = new Map();

	public get(id: string): PlayerGame | undefined {
		return this.store.get(id);
	}

	public save(id: string, playerGame: PlayerGame): void {
		this.store.set(id, playerGame);
	}

	public get all(): PlayerGame[] {
		return [...this.store.values()];
	}

	public delete(id: string): void {
		this.store.delete(id);
	}

	public has(id: string): boolean {
		return this.store.has(id);
	}

	public get total(): number {
		return this.store.size;
	}

	public get table(): { id: string; playerGame: PlayerGame }[] {
		return Array.from(this.store).map(([id, playerGame]) => ({ id, playerGame }));
	}

	public get scores(): { id: string; playerGame: PlayerGame }[] {
		return this.table.sort((a, b) => b.playerGame.getScore() - a.playerGame.getScore());
	}

	public get winner(): string | null {
		return this.scores.length > 0 ? this.scores[0].id : null;
	}
}
