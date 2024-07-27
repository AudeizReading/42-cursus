import { PlayerGameStore } from './PlayerGameStore';
import { PlayerGame } from '../GameLogic';
import Player from '../../players/Player';

describe('PlayerGameStore', () => {
	let store: PlayerGameStore;

	beforeEach(() => {
		store = new PlayerGameStore();
	});

	it('should initialize an empty store', () => {
		expect(store.total).toBe(0);
		expect(store.all).toEqual([]);
		expect(store.table).toEqual([]);
		expect(store.scores).toEqual([]);
		expect(store.winner).toBeNull();
	});

	it('should save and retrieve player games', () => {
		const player1 = new Player('player1', 'session1');
		const player2 = new Player('player2', 'session2');
		const playerGame1 = new PlayerGame(player1);
		const playerGame2 = new PlayerGame(player2);

		store.save('session1', playerGame1);
		store.save('session2', playerGame2);

		expect(store.get('session1')).toBe(playerGame1);
		expect(store.get('session2')).toBe(playerGame2);
		expect(store.total).toBe(2);
		expect(store.all).toEqual([playerGame1, playerGame2]);
		expect(store.table).toEqual([
			{ id: 'session1', playerGame: playerGame1 },
			{ id: 'session2', playerGame: playerGame2 },
		]);
	});

	it('should delete player games', () => {
		const player1 = new Player('player1', 'session1');
		const playerGame1 = new PlayerGame(player1);

		store.save('session1', playerGame1);
		store.delete('session1');

		expect(store.get('session1')).toBeUndefined();
		expect(store.total).toBe(0);
		expect(store.all).toEqual([]);
		expect(store.table).toEqual([]);
	});

	it('should check if a player game exists', () => {
		const player1 = new Player('player1', 'session1');
		const playerGame = new PlayerGame(player1);

		store.save('session1', playerGame);

		expect(store.has('session1')).toBe(true);
		expect(store.has('nonexistentId')).toBe(false);
	});

	it('should retrieve player games sorted by score', () => {
		const player1 = new Player('player1', 'session1');
		const player2 = new Player('player2', 'session2');
		const player3 = new Player('player3', 'session3');
		const playerGame1 = new PlayerGame(player1);
		const playerGame2 = new PlayerGame(player2);
		const playerGame3 = new PlayerGame(player3);

		playerGame1.addScore(100);
		playerGame2.addScore(200);
		playerGame3.addScore(150);

		store.save('session1', playerGame1);
		store.save('session2', playerGame2);
		store.save('session3', playerGame3);

		expect(store.scores).toEqual([
			{ id: 'session2', playerGame: playerGame2 },
			{ id: 'session3', playerGame: playerGame3 },
			{ id: 'session1', playerGame: playerGame1 },
		]);
	});

	it('should retrieve the winner', () => {
		const player1 = new Player('player1', 'session1');
		const player2 = new Player('player2', 'session2');
		const player3 = new Player('player3', 'session3');
		const playerGame1 = new PlayerGame(player1);
		const playerGame2 = new PlayerGame(player2);
		const playerGame3 = new PlayerGame(player3);

		playerGame1.addScore(100);
		playerGame2.addScore(200);
		playerGame3.addScore(150);

		store.save('session1', playerGame1);
		store.save('session2', playerGame2);
		store.save('session3', playerGame3);

		expect(store.winner).toBe('session2');
	});
});
