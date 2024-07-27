import IStore from '../../base/IStore';
import { PlayerGame } from '../GameLogic';
import { PlayerGameStore } from './PlayerGameStore';

export class GameStore implements IStore<PlayerGameStore> {
	public store: Map<string, PlayerGameStore> = new Map();

	public get(id: string): PlayerGameStore | undefined {
		return this.store.get(id);
	}

	public save(id: string, playerGameStore: PlayerGameStore): void {
		this.store.set(id, playerGameStore);
	}

	public get all(): PlayerGameStore[] {
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

	public addPlayerGame(gameId: string, playerId: string, playerGame: PlayerGame): void {
		let gamePlayerStore = this.get(gameId);
		if (!gamePlayerStore) {
			gamePlayerStore = new PlayerGameStore();
		}
		gamePlayerStore.save(playerId, playerGame);
		this.save(gameId, gamePlayerStore);
	}

	public getEndedPlayerGames(gameId: string): PlayerGame[] | undefined {
		return this.get(gameId)?.scores.reduce((acc, { playerGame }) => {
			acc.push(playerGame);
			return acc;
		}, [] as PlayerGame[]);
	}

	public getWinnerId(gameId: string): string {
		return this.get(gameId)?.winner ?? '';
	}
}
