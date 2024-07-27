import { GameStore } from './GameStore';
import { PlayerGameStore } from './PlayerGameStore';
import { PlayerGame } from '../GameLogic';
import Player from '../../players/Player';

describe('GameStore', () => {
	let gameStore: GameStore;

	beforeEach(() => {
		gameStore = new GameStore();
	});

	it('should save and retrieve player game store', () => {
		const playerGameStore = new PlayerGameStore();
		gameStore.save('game1', playerGameStore);

		const retrievedStore = gameStore.get('game1');
		expect(retrievedStore).toBe(playerGameStore);
	});

	it('should return undefined for non-existent player game store', () => {
		const retrievedStore = gameStore.get('game2');
		expect(retrievedStore).toBeUndefined();
	});

	it('should return all player game stores', () => {
		const playerGameStore1 = new PlayerGameStore();
		const playerGameStore2 = new PlayerGameStore();
		gameStore.save('game1', playerGameStore1);
		gameStore.save('game2', playerGameStore2);

		const allStores = gameStore.all;
		expect(allStores).toEqual([playerGameStore1, playerGameStore2]);
	});

	it('should delete player game store', () => {
		const playerGameStore = new PlayerGameStore();
		gameStore.save('game1', playerGameStore);

		gameStore.delete('game1');
		const retrievedStore = gameStore.get('game1');
		expect(retrievedStore).toBeUndefined();
	});

	it('should check if player game store exists', () => {
		const playerGameStore = new PlayerGameStore();
		gameStore.save('game1', playerGameStore);

		const exists = gameStore.has('game1');
		expect(exists).toBe(true);
	});

	it('should return the total number of player game stores', () => {
		const playerGameStore1 = new PlayerGameStore();
		const playerGameStore2 = new PlayerGameStore();

		gameStore.save('game1', playerGameStore1);
		gameStore.save('game2', playerGameStore2);

		const total = gameStore.total;
		expect(total).toBe(2);
	});

	it('should add player game to player game store', () => {
		const playerGameStore = new PlayerGameStore();
		const player = new Player('player1', 'session1');
		const playerGame: PlayerGame = new PlayerGame(player);

		gameStore.save('game1', playerGameStore);
		gameStore.addPlayerGame('game1', 'session1', playerGame);

		const retrievedStore = gameStore.get('game1');
		expect(retrievedStore?.get('session1')).toBe(playerGame);
	});

	it('should get ended player games', () => {
		const playerGameStore = new PlayerGameStore();
		const player1 = new Player('player1', 'session1');
		const player2 = new Player('player2', 'session2');
		const playerGame1: PlayerGame = new PlayerGame(player1);
		const playerGame2: PlayerGame = new PlayerGame(player2);

		playerGameStore.save('session1', playerGame1);
		playerGameStore.save('session2', playerGame2);
		gameStore.save('game1', playerGameStore);

		const endedPlayerGames = gameStore.getEndedPlayerGames('game1');
		expect(endedPlayerGames).toEqual([playerGame1, playerGame2]);
	});

	it('should get winner ID', () => {
		const playerGameStore = new PlayerGameStore();
		const player1 = new Player('player1', 'session1');
		const player2 = new Player('player2', 'session2');
		const player3 = new Player('player3', 'session3');
		const playerGame1: PlayerGame = new PlayerGame(player1);
		const playerGame2: PlayerGame = new PlayerGame(player2);
		const playerGame3: PlayerGame = new PlayerGame(player3);

		playerGame1.addScore(100);
		playerGame2.addScore(5100);
		playerGame3.addScore(1100);
		playerGameStore.save('session1', playerGame1);
		playerGameStore.save('session2', playerGame2);
		playerGameStore.save('session3', playerGame3);
		gameStore.save('game1', playerGameStore);

		const winnerId = gameStore.getWinnerId('game1');
		expect(winnerId).toBe('session2');
	});
});
