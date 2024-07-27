import { describe, it, expect } from '@jest/globals';
import Player from '../players/Player';
import { PlayerGame } from './GameLogic';
import { Map } from './Map';

describe('PlayerGame', () => {
	let instance: PlayerGame;
	const player = new Player('PlayerGame', 'sessionID');

	it('Define instance', () => {
		expect(() => (instance = new PlayerGame(player))).not.toThrow();
	});

	describe('EndGame', () => {
		it('Not End Game', () => {
			expect(instance.getEndGame()).toBe(false);
		});

		it('Set End Game', () => {
			expect(() => instance.isEndGame()).not.toThrow();
		});

		it('Is End Game', () => {
			expect(instance.getEndGame()).toBe(true);
		});
	});

	describe('soundEffect', () => {
		const notSoundFound = (name: string): void =>
			it(`Not sound effects: ${name}`, () => {
				expect(instance.getSoundEffect()).toStrictEqual([]);
			});

		notSoundFound('Begin');

		it('add move sound', () => {
			expect(() => instance.addSoundEffect('move')).not.toThrow();
		});

		it('add win sound', () => {
			expect(() => instance.addSoundEffect('win')).not.toThrow();
		});

		it('Check sound values', () => {
			expect(instance.getSoundEffect()).toStrictEqual(['move', 'win']);
		});

		it('Reset sound effects', () => {
			expect(() => instance.resetSoundEffect()).not.toThrow();
		});

		notSoundFound('End');
	});

	it('getLevel', () => {
		expect(instance.getLevel()).toBe(1);
	});

	describe('Score', () => {
		const scoreIs = (score: number): void =>
			it(`Score is ${score}`, () => {
				expect(instance.getScore()).toBe(score);
			});

		scoreIs(0);

		it('Add 10 pts', () => {
			expect(() => instance.addScore(10)).not.toThrow();
		});

		scoreIs(10);
	});

	it('getMap', () => {
		expect(instance.getMap()).toBeInstanceOf(Map);
	});

	it('getPlayer', () => {
		const ret = instance.getPlayer();
		expect(ret).toBeInstanceOf(Player);
		expect(ret).toBe(player);
	});

	describe('Date update', () => {
		const date = new Date();

		it('current date not date PlayerGame', () => {
			expect(instance.getLastUpdate()).not.toBe(date);
		});

		it('Set current Date', () => {
			expect(() => instance.setLastUpdate(date)).not.toThrow();
		});

		it('current date is date PlayerGame', () => {
			expect(instance.getLastUpdate()).toBe(date);
		});
	});

	describe('Add New line', () => {
		const getSpeed = (speed: number): void =>
			it(`getSpeed: ${speed}`, () => {
				expect(instance.getSpeed()).toBe(speed);
			});

		const addLine = (line: number): void =>
			it(`add new line: ${line}`, () => {
				expect(() => instance.addNewLine(line)).not.toThrow();
			});

		for (let i = 0; i < 9; i++) {
			addLine(i > 0 ? 10 : 0);
			getSpeed(1000 - i * 100);
		}
		addLine(10);
		getSpeed(100);
		for (let i = 0; i < 10; i++) {
			addLine(i);
		}
	});
});
