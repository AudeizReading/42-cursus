import { describe, it, expect } from '@jest/globals';
import { GameLogic, IStatePlayer, PlayerGame, TypeAction } from './GameLogic';
import Player from '../players/Player';

describe('GameLogic', () => {
	let instance: GameLogic;
	const players: Player[] = [
		new Player('player0', `0`),
		new Player('player1', `1`),
		new Player('player2', `2`),
		new Player('player3', `3`),
		new Player('player4', `4`),
		new Player('player5', `5`),
		new Player('player6', `6`),
		new Player('player7', `7`),
		new Player('player8', `8`),
		new Player('player9', `9`),
		new Player('player10', `10`),
	];

	const update = (updateName: string): void =>
		it(`update ${updateName}`, () => {
			expect(() => instance.update()).not.toThrow();
		});

	it('Define instance', () => {
		expect(() => (instance = new GameLogic())).not.toThrow();
	});

	describe('addPlayer', () => {
		players.forEach((player: Player) => {
			it(`add Player: ${player.username}`, () => {
				expect(() => instance.addPlayer(player)).not.toThrow();
			});
		});
		update('addPlayer');
	});

	describe('action and statePlayer', () => {
		const action = (player: Player, action: TypeAction): void =>
			it(`action ${action}: ${player.username}`, () => {
				expect(() => instance.action(player.sessionID, action)).not.toThrow();
			});

		const statePlayer = (sessionIDorPlayer: string | Player, soundEffect: boolean): void => {
			const idt: string = typeof sessionIDorPlayer == 'string' ? sessionIDorPlayer : sessionIDorPlayer.sessionID;
			return it(`statePlayer ${idt}`, () => {
				const dataPlayer: IStatePlayer = instance.statePlayer(sessionIDorPlayer);
				soundEffect
					? expect(dataPlayer).toHaveProperty('soundEffect')
					: expect(dataPlayer).not.toHaveProperty('soundEffect');
				expect(dataPlayer).toHaveProperty('level');
				expect(dataPlayer).toHaveProperty('score');
				expect(dataPlayer).toHaveProperty('map');
				expect(dataPlayer).toHaveProperty('nextPiece');
			});
		};

		describe('statePlayer sessionID', () => {
			players.forEach((player) => {
				statePlayer(player.sessionID, false);
			});
			update('statePlayer sessionID');
		});

		describe('statePlayer player', () => {
			players.forEach((player) => {
				statePlayer(player, false);
			});
			update('statePlayer player');
		});

		describe('left', () => {
			players.forEach((player) => {
				action(player, 'left');
			});
			update('left');
			players.forEach((player) => {
				statePlayer(player, true);
			});
		});

		describe('right', () => {
			players.forEach((player) => {
				action(player, 'right');
			});
			update('right');
			players.forEach((player) => {
				statePlayer(player, true);
			});
		});

		describe('up', () => {
			players.forEach((player) => {
				action(player, 'up');
			});
			update('up');
			players.forEach((player) => {
				statePlayer(player, true);
			});
		});

		describe('down', () => {
			players.forEach((player) => {
				action(player, 'down');
			});
			update('down');
			players.forEach((player) => {
				statePlayer(player, true);
			});
		});

		describe('space', () => {
			players.forEach((player) => {
				action(player, 'space');
			});
			update('space');
			players.forEach((player) => {
				statePlayer(player, true);
			});
		});
	});

	describe('endGame', () => {
		players.forEach((player) => {
			it(`endGame: ${player.username}`, () => {
				expect(instance.endGame(player.sessionID)).toBeInstanceOf(PlayerGame);
			});
		});
	});
});
