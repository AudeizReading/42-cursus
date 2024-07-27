import { describe, it, expect } from '@jest/globals';
import { LeaderBoardResult, LeaderBoardService } from './leaderBoardService';
import { PlayerGame } from '../../games/GameLogic';
import Player from '../../players/Player';

describe('LeaderBoardService', () => {
	let instance: LeaderBoardService;

	const insert = (username: string, score: number): void =>
		it(`Insert: ${username} - ${score}`, () => {
			expect(async () => await instance.insert(username, score)).not.toThrow();
		});
	const insertByPlayerGame = (player: PlayerGame): void =>
		it(`Insert: ${player.getPlayer().username} - ${player.getScore()}`, () => {
			expect(async () => await instance.insertByPlayerGame(player)).not.toThrow();
		});
	const search = (page: number, limit: number, result?: LeaderBoardResult, error: boolean = false): void =>
		it(`Search: ${page} - ${limit}`, async () => {
			if (error) {
				try {
					await instance.search(page, limit);
					expect(false).toBe(true);
				} catch {
					expect(true).toBe(true);
				}
			} else {
				expect(await instance.search(page, limit)).toBeLeaderBoardResult({
					page: result?.page,
					totalPage: result?.totalPage,
					results: result?.results,
				});
			}
		});

	const fakePlayerGame = (username: string, score: number): PlayerGame => {
		class FakePlayerGame {
			public getScore(): number {
				return score;
			}
			public getPlayer(): Player {
				return new Player(username, username);
			}
		}
		return new FakePlayerGame() as PlayerGame;
	};

	it('Define instance', () => {
		expect(() => (instance = new LeaderBoardService())).not.toThrow();
	});

	search(0, 5, undefined, true);
	search(1, 5, { page: 1, totalPage: 0, results: [] });
	insert('first', 42);
	insertByPlayerGame(fakePlayerGame('second', 1500));
	search(1, 5, {
		page: 1,
		totalPage: 1,
		results: [
			{
				id: 2,
				username: 'second',
				score: 1500,
			},
			{
				id: 1,
				username: 'first',
				score: 42,
			},
		],
	});
	search(1, 1, {
		page: 1,
		totalPage: 2,
		results: [
			{
				id: 2,
				username: 'second',
				score: 1500,
			},
		],
	});
	search(2, 1, {
		page: 2,
		totalPage: 2,
		results: [
			{
				id: 1,
				username: 'first',
				score: 42,
			},
		],
	});
});
